import { useState, useRef, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react";
import {io} from 'socket.io-client';
import { useNavigate } from 'react-router-dom'

import { getUserData, getPossibleLivesData} from "../../data/source";

export default function LiveViewModel() {

    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    const {getAccessTokenSilently} = useAuth0();

    const navigate = useNavigate();

    // Utente loggato(non cambia mai è per gestire il primo rendering)
    const [currentUser, setCurrentUser] = useState();

    // Lista delle lives attive
    const [lives, setLives] = useState();

    // Lista partecipanti nella live selezionata
    const [live_users, setLiveUsers] = useState([]);

    // Lista messaggi
    const [messages,setMessages] = useState([]);

    // Messaggio attuale da inviare
    const [message, setMessage] = useState('');

    // Variabile booleana
    const [roomSelected, setRoomSelected] = useState(false);

    // Flag
    const [is_broadcaster, setIsBroadcaster] = useState(false);

    // Variabili relative alla live selezionata
    const [roomName, setRoomName] = useState();
    const [roomDescr, setRoomDescr] = useState();

    //
    const [countDownError, setCountDownError] = useState();

    // Socket 
    const socket = useRef();

    // Dizionario => socket.id: RTCPeerConnection
    // utilizzato dal Broadcaster gestire i Viewers connessi
    // dal Viewer per memorizzare la connessione al Broadcaster
    // socket.id è relativo all'id del socket in nodejs
    let rtcPeerConnections = {};

    useEffect(() => {
        return () => {
            socket.current && socket.current.disconnect();
        }
    }, []);

    // Preleva o aggiorna i dati dell'utente dal localStorage
    const getUser = async() => {

        // Controlla se i dati dell'utente sono già nel localStorage
        if(!localStorage.getItem("user-data")) {
            const token = await getAccessTokenSilently();
            const data = await getUserData(token);
            console.log(data);
            if(data) {
                const user_data = {
                    id: data.user_id,
                    username: data.username,
                    avatar_image: data.avatar_image,
                    native_l: data.native_l,
                    new_l: data.new_l,
                }
                console.log(data.user_id);
                // Aggiorna localStorage
                localStorage.setItem('user-data', JSON.stringify(user_data));
                setCurrentUser(user_data);
            }

        } else {
            setCurrentUser(JSON.parse(localStorage.getItem('user-data')));
        } 
    };

    // Preleva le lives compatibili con la lingua dell'utente
    // ed attive sul server tramite API
    const getPossibleLives = async() => {

        const token = await getAccessTokenSilently();
        const data = await getPossibleLivesData(token, currentUser.new_l);

        data && setLives(data);
        
    };

    
    const sendMsg = async(msg) => {

        //Il from e l'id della live vengono aggiunte lato server
        const data = {
            user: currentUser.username,
            avatar: currentUser.avatar_image,
            msg: msg,
        };

        socket.current.emit("liveMsg", data);
        
        setMessages((prev)=>
            [...prev, 
            {user: currentUser.username, avatar: currentUser.avatar_image, msg: msg}
        ]);
        
    };

    // Invio messaggio nella live
    const handleSendMessage = async() => {
        await sendMsg(message);
        setMessage('');
    }

    
    // Gestisce l'accesso ad una live da parte di un utente
    // che prende il ruolo di Viewer
    const handleClickViewer = async(room) => {
        if (!currentUser.username || !room) {
          alert("Please type a room number and a name");
        } else {
          // Si registra l'utente come Viewer
          socket.current.emit(
            "register as viewer", 
          { room: room, 
            userId:currentUser.id, 
            name:currentUser.username, 
            avatar: currentUser.avatar_image } );
            // Come dict
        }
    }
    const handleClickBroadcaster = async() => {

        socket.current.emit("register as broadcaster", 
            currentUser.id,  //id Auth0
            currentUser.native_l, 
            roomName, 
            roomDescr 
        );
        // Var separate
    }

    // Inizializza connessione alla socket.io\live 
    // per la chat nella live
    const openSocket = async()=>{
        const token = await getAccessTokenSilently();
        socket.current = io(BASE_URL, 
            { 
                query: { type: 'live' },
                extraHeaders: { Authorization: `Bearer ${token}`}
            }
            );

        //  Evento ricevuto sia dall'utente Broadcaster che Viewer
        socket.current.on("liveMsg", function (msg, user, avatar) {

            setMessages(messages => [...messages, {user: user ,avatar: avatar, msg: msg}]);  
            //bisogna usare questo metodo, non si può usare push e setMessages(new_messages)
            //dato che il listener .on(liveMsg) viene registrato in useEffect, 
            //la lista messages sarà quella del momento in cui viene usato useEffect e non quella aggiornata
        });

        // VIEWER => BROADCASTER (1)
        // Evento inviato dal Viewer ed invocato sul client Broadcaster
        // come primo step del SIGNALING. Il Viewer invia la richiesta di voler accedere alla live
        // il broadcaster in risposta invierà una offer.
        socket.current.on("new viewer", function (viewer) {
            console.log("NEW VIEW REQ");
            // viewer.id è il socket.id del viewer sul server nodejs
            // creiamo un oggetto di tipo RTCPeerConnection associato al viewer
            // per gestire la successiva fase di negoziazione ICE Candidate
            rtcPeerConnections[viewer.id] = new RTCPeerConnection(config);
            
            const videoElement = document.querySelector("video");
            const stream = videoElement.srcObject;

            // Tramite getTracks() otteniamo i tracks (audio, video)
            // Aggiungiamo alla connessione RTCPeerConnections con il viewer i tracks
            stream
                .getTracks()
                .forEach((track) => rtcPeerConnections[viewer.id].addTrack(track, stream));
            
            // Registriamo l'evento onIceCanditate, questo verrà invocato dal ICE Layer(Browser)
            // nel momento in cui è stato trovato un nuovo IceCandidate ed è quindi necessario
            // inviarlo all'altro peer tramite SIGNALING
            rtcPeerConnections[viewer.id].onicecandidate = (event) => {
                if (event.candidate) {
                console.log("SEND CANDIDATE ", JSON.stringify(event.candidate) );
                // Invio IceCandidate all'altro peer(Viewer) tramite socket.io
                socket.current.emit("candidate", viewer.id, {
                    type: "candidate",
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate,
                });
                }
            };
                
            // Viene creata una offer per il peer(Viewer) che desidera connettersi
            rtcPeerConnections[viewer.id]
                .createOffer()
                .then((sessionDescription) => {
                // Memorizza le configurazioni locali(lato broadcaster) della connessione con il Viewer
                // il browser inizia ad invocare onIceCandidate
                rtcPeerConnections[viewer.id].setLocalDescription(sessionDescription);
                console.log("SEND OFFER");
                // Invio della offer al Viewer tramite socket.io
                socket.current.emit("offer", viewer.id, {
                    type: "offer",
                    sdp: sessionDescription,
                    broadcaster: {
                    room: currentUser.id,
                    name: currentUser.username,
                    },
                });

                })
                .catch((error) => {
                console.log(error);
                });
                
        });

        // VIEWER <= BROADCASTER (2)
        // Evento inviato dal Broadcster in risposta a "new-viewer"
        // invocato sul client Viewer
        socket.current.on("offer", function (broadcaster, sdp) {
            setRoomSelected(true); //Cambia render grafico
            console.log("REC OFFER" , JSON.stringify(sdp) );
            //NOTA
            //broadcaster.id è aggiunto nel server nodejs
            //non e' l'id auth0, ma l'id socket.io
            //broadcaster.room è l'id auth0 = stanza 

            rtcPeerConnections[broadcaster.id] = new RTCPeerConnection(config);

            // Memorizza le configurazioni ricevute dal broadcaster come descrittore 
            // della end-remota 
            rtcPeerConnections[broadcaster.id].setRemoteDescription(sdp);
        
            // Si crea una answer da inviare al broadcaster
            rtcPeerConnections[broadcaster.id]
            .createAnswer()
            .then((sessionDescription) => {
                // Memorizza le configurazioni locali(lato viewer) della connessione con il Broadcaster
                // il browser inizia ad invocare onIceCandidate
                rtcPeerConnections[broadcaster.id].setLocalDescription(
                sessionDescription
                );
                console.log("SEND ANSWR ");
                //Si invia la answer al Broadcaster tramite socket.io
                socket.current.emit("answer", {
                type: "answer",
                sdp: sessionDescription,
                room: broadcaster.room,
                });
            });
            

            rtcPeerConnections[broadcaster.id].ontrack = (event) => {
                console.log("ON TRACK " + JSON.stringify(event.streams[0]) );
                console.log("ON TRACK.." + event.streams[0]);
                console.log("ON TRACK.." + event.streams);
                console.log("ON TRACK.." + event);
                console.log("ON TRACK.." + event.streams[0].getTracks().length);
                console.log("ON TRACK.." + event.track);
                const videoElement = document.querySelector("video");
                videoElement.srcObject = event.streams[0];
                videoElement.style.transform       = "scaleX(" + "-1" + ")";
            };

            rtcPeerConnections[broadcaster.id].onicecandidate = (event) => {
            if (event.candidate) {
                console.log("SEND CANDIDATE ", JSON.stringify(event.candidate) );
                // Invio IceCandidate all'altro peer(Broadcaster) tramite socket.io
                socket.current.emit("candidate", broadcaster.id, {
                type: "candidate",
                label: event.candidate.sdpMLineIndex,
                id: event.candidate.sdpMid,
                candidate: event.candidate.candidate,
                });
            }
            };


        });


        // VIEWER => BROADCASTER (3)
        // Evento inviato dal Broadcaster ed invocato sul client Viewer
        socket.current.on("answer", function (viewerId, event) {
            console.log("REC ANSWR " + viewerId + ", " + JSON.stringify(event));
            rtcPeerConnections[viewerId].setRemoteDescription(
            new RTCSessionDescription(event)
            );
            
        });

        // VIEWER <=> BROADCASTER (dopo setLocalDescript)
        // Evento inviato sia da Viewer che da Broadcaster
        // per comunicare all'altro peer un proprio ICE Candidate
        socket.current.on("candidate", function (id, event) {
            console.log("REC CANDIDATE "+id + ", " + JSON.stringify(event) );
            var candidate = new RTCIceCandidate({
            sdpMLineIndex: event.label,
            candidate: event.candidate,
            });
            // Si aggiunge l'ICE Candidate al ICE Layer
            rtcPeerConnections[id].addIceCandidate(candidate);
            
        });


        socket.current.on('add new viewer', function(viewer) {
            setLiveUsers(live_users => [...live_users, viewer]);  
        }); 
        socket.current.on('old users', function(viewers) {
            setLiveUsers(viewers);
        });
        socket.current.on('remove viewer', function(viewers) {
            setLiveUsers(viewers);
        });


        socket.current.on('broadcaster disconnected', function() {
            console.log('broad-disc');
            navigate(0);
        });
            

        // Viewer prova ad entrare in una live non più disponibile
        socket.current.on("room not exist", function (room) {
            setCountDownError(
                ["Room does not exist", "Sorry, this room has been closed"]
            );
            //countDown("Room does not exist", "Sorry, this room has been closed");
        });

        // Viewer prova ad entrare in una live senza avere punti sufficienti
        socket.current.on("not enough points", function (room) {
            setCountDownError(
                ["Not enough points", "“sine pecunia ne cantantur missae“"]
            );
            //countDown("Not enough points", "“sine pecunia ne cantantur missae“");
        });

    };

    // Configurazione iceServers, indica i servizi STUN e TURN da utilizzare a RTCPeerConnection
    const config = {
        iceServers: [
            {
              urls: "stun:a.relay.metered.ca:80",
            },
            {
              urls: "turn:a.relay.metered.ca:80",
              username: "3b7192d066a3ca26bc09e5b2",
              credential: "/A9X9jYBMmgvIpRY",
            },
            {
              urls: "turn:a.relay.metered.ca:80?transport=tcp",
              username: "3b7192d066a3ca26bc09e5b2",
              credential: "/A9X9jYBMmgvIpRY",
            },
            {
              urls: "turn:a.relay.metered.ca:443",
              username: "3b7192d066a3ca26bc09e5b2",
              credential: "/A9X9jYBMmgvIpRY",
            },
            {
              urls: "turn:a.relay.metered.ca:443?transport=tcp",
              username: "3b7192d066a3ca26bc09e5b2",
              credential: "/A9X9jYBMmgvIpRY",
            },
        ],
    };


    return {
        getUser,
        currentUser,
        getPossibleLives,
        messages,
        message,
        setMessage,
        handleSendMessage,
        handleClickViewer,
        handleClickBroadcaster,
        lives,
        live_users,
        roomSelected,
        setRoomSelected,
        is_broadcaster,
        setIsBroadcaster,
        roomName,
        roomDescr,
        setRoomName,
        setRoomDescr,
        countDownError,
        openSocket,
    }

}