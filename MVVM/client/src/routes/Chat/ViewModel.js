import { useState, useRef, useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react";
import {io} from 'socket.io-client';

import { getUserData, getAllContactsData, getAllMessagesData, addMsgData } from "../../data/source";

export default function ChatViewModel() {

    const BASE_URL = process.env.REACT_APP_SERVER_URL;

    const {getAccessTokenSilently} = useAuth0();

    // Utente loggato(non cambia mai è per gestire il primo rendering)
    const [currentUser, setCurrentUser] = useState();

    // Lista di contatti
    const [contacts,setContacts]= useState([]);

    // Lista messaggi
    const [messages,setMessages] = useState([]);

    const [error, setError] = useState();
    // Socket 
    const socket = useRef();

    //PROVA

    // currentChat indica la chat selezionata
    const [currentChat,setCurrentChat] = useState();        
    const currentChatRef = useRef();    

    const [notifys, setNotifys] = useState([]);

    // Callback richiamata dal componente Contacts
    // Quando si cambia chat
    const handleChatChange = (contact) =>{
        setCurrentChat(contact);
        currentChatRef.current = contact;

        // Elimina le notifiche per l'utente selezionato
        if(notifys[contact.id]) { 
            var new_notifications = {...notifys};
            delete new_notifications[contact.id];
            // Callback al componente chat
            setNotifys(new_notifications);
        }
    }

    // socket, notifyUser, notifications, 
    
    // Invocato al montaggio del componente, al cambio del contatto selezionato
    // e per ogni volta che si cambia chat. Dato che l'evento è registrato da useEffect
    // la funzione dentro socket.on usa la versione di currentChat con cui è stata registrata
    // quindi quando cambia currentChat dobbiamo smontare e rimontare
    /*useEffect(() => {
        console.log("socket.ondddddd CURRENT: " + currentUser);
        if(socket.current) {
            // Essendo socket = useRef(), tramite .current, accediamo sempre all'istanza attuale
            socket.current.on("msg-receive", (data) => {
                console.log("msg: " + data);

                // Se il messaggio ricevuto riguarda la chat attuale
                if(currentChat && data.from === currentChat.id) {
                    // Mostra nuovo messaggio all'utente
                    setMessages((prev) => [...prev,{fromSelf: false, message: data.message}]);
                    //functional updates, cosi posso non mettere messages nella dependency array
                    //anche se quando registro la callback prende il val di messages vecchio
                    //tramite questa "scorciatoia" posso aggiornare messages, senza avere lo stato attuale
                    //infatti msgs = [...messages]; NON funziona
                    //https://blog.bitsrc.io/understanding-dependencies-in-useeffect-7afd4df37c96
                    //https://overreacted.io/a-complete-guide-to-useeffect/

                    console.log("new msg:" + data.message);

                } else { // Se il messaggio ricevuto non riguarda la chat attuale
                    setNotifys((prev) => {
                        if(prev[data.from]){
                            return {...prev, [data.from] : prev[data.from] + 1 };
                        }else{
                            return {...prev, [data.from] : 1 };
                        }
                    });      
                }
            });

            return () => {
                socket.current.off('msg-receive');
            }
            

        } 
    }, [currentChat]); */


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

    // Preleva i contatti dell'utente tramite API
    const getAllContacts = async() => {
        const token = await getAccessTokenSilently();

        const data = await getAllContactsData(token);

        if(data.length > 0 && data != 'Unable to get contacts') {
            console.log("contacts" + data);
            setContacts(data);
        }else{
            console.log("Pls add contacts");
            setError('Pls add contacts');
        }
    };

    // Preleva i messaggi vecchi con l'utente selezionato
    const getAllMessages = async() => {
        const token = await getAccessTokenSilently();

        const data = await getAllMessagesData(token, currentChat);
        if(data) {
            setMessages(data);
        }
    };
    
    const sendMsg = async(msg) => {
        //Salva msg nel db
        const token = await getAccessTokenSilently();

        const data = await addMsgData(token, currentChat, msg);

        if(data !=="Message created"){
            return;
        }
        // Invia msg tramite socket
        socket.current.emit('send-msg', {
            from: currentUser.id,
            to: currentChat.id,
            message: msg,
        });


        setMessages((prev)=>[...prev, {fromSelf:true, message:msg}]);
    };

        // Inizializza connessione alla socket.io\chat 
    // per la chat tra utenti
    const openSocket = async()=>{
        const token = await getAccessTokenSilently();
        socket.current = io(BASE_URL, 
            { 
                query: { type: 'chat' },
                extraHeaders: { Authorization: `Bearer ${token}`}
            }
            );
        if(socket.current) {
            console.log("socket.ondddddd CURRENT: " + currentUser);
            // Essendo socket = useRef(), tramite .current, accediamo sempre all'istanza attuale
            socket.current.on("msg-receive", (data) => {
                console.log("msg: " + data);

                // Se il messaggio ricevuto riguarda la chat attuale
                if(currentChatRef.current && data.from === currentChatRef.current.id) {
                    // Mostra nuovo messaggio all'utente
                    setMessages((prev) => [...prev,{fromSelf: false, message: data.message}]);
                    //functional updates, cosi posso non mettere messages nella dependency array
                    //anche se quando registro la callback prende il val di messages vecchio
                    //tramite questa "scorciatoia" posso aggiornare messages, senza avere lo stato attuale
                    //infatti msgs = [...messages]; NON funziona
                    //https://blog.bitsrc.io/understanding-dependencies-in-useeffect-7afd4df37c96
                    //https://overreacted.io/a-complete-guide-to-useeffect/

                    console.log("new msg:" + data.message);

                } else { // Se il messaggio ricevuto non riguarda la chat attuale
                    setNotifys((prev) => {
                        if(prev[data.from]){
                            return {...prev, [data.from] : prev[data.from] + 1 };
                        }else{
                            return {...prev, [data.from] : 1 };
                        }
                    });      
                }
            });

            socket.current.on("disconnect", () => {console.log("disconnect");});
            

        } 
        // Per aggiungere l'utente alla lista deli utenti online
        socket.current.emit("add-user",currentUser.id);
    };

    return {
        getUser,
        currentUser,
        getAllContacts,
        contacts,
        openSocket,
        handleChatChange,
        currentChat,
        messages,
        sendMsg,
        getAllMessages,
        notifys,
        error,
    }
}