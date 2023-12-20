import React, { useEffect, useRef, useState } from "react";
import Header from "../../general/header";
import TextArea from 'antd/es/input/TextArea';
import { Input, Modal } from "antd";
import { useNavigate } from 'react-router-dom'
import Content from "../../general/content";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhoneSlash, faPaperPlane, faCamera, faPlus, faTv } from "@fortawesome/free-solid-svg-icons";
import england_flag from '../../assets/flags/england.png';
import spain_flag from '../../assets/flags/spain.png';
import italy_flag from '../../assets/flags/italy.png';
import sweden_flag from '../../assets/flags/sweden.png';
import { message as msgAlert } from "antd";

import useViewModel from "./ViewModel"

// Componente utilizzato per gestire le live, sia da viewer che broadcaster

function LiveView(){ 

    const { getUser, currentUser, getPossibleLives, messages, message, setMessage, 
            handleSendMessage, handleClickViewer, handleClickBroadcaster,
            lives, live_users,
            roomSelected, setRoomSelected,
            roomName, roomDescr, setRoomName, setRoomDescr,
            is_broadcaster, setIsBroadcaster,
            countDownError,
            openSocket } = useViewModel();

    const navigate = useNavigate();

    const scrollRef = useRef();

    const [create_live, setCreateLive] = useState(false);

    const flags_array = {
      italian: italy_flag,
      spanish: spain_flag,
      swedish: sweden_flag,
      english: england_flag,
    }

    // Contraint per la trasmissione
    const streamConstraints = { audio: true, video: true };

    // MessageBox
    const [messageApi, contextHolder] = msgAlert.useMessage();

    const showError = (msg, duration) => {
        messageApi.open({
            type: 'error',
            content: msg,
            duration: duration,
        });
    };

    // MessageBox
    const showCountDown = (title, message) => {
      let secondsToGo = 5;
      const modal = Modal.error({
        title: title,
        content: message,
      });
      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
    };

    useEffect(() => {

      getUser();

    }, []);

    useEffect(() => {

      currentUser && getPossibleLives() && openSocket();

    }, [currentUser]);

    useEffect(() => {

      countDownError && showCountDown(...countDownError);

    }, [countDownError]);
    
    // Gestisce l'avvio di una diretta da parte dell'utente
    // che prende il ruolo di Broadcaster
    const handleClickBroadcasterWrapper = () => {
      if (!roomName && !roomDescr) {
          showError("Pls, all fields must be filled", 2);
      } else {

        setRoomSelected(true);

        setIsBroadcaster(true);    
        // Richiesta accesso camera e microfono
        navigator.mediaDevices
          .getUserMedia(streamConstraints)
          .then(function (stream) {
            const videoElement = document.querySelector("video");
            videoElement.srcObject = stream;
            videoElement.volume = 0;
            var factor = "-1";
            videoElement.style.transform = "scaleX(" + factor + ")";
            console.log("reg as broad");

            // Si registra l'utente come Broadcaster, l'id della live è l'id Auth0 dell'utente
            handleClickBroadcaster();

          })
          .catch(function (err) {
            console.log("An error ocurred when accessing media devices", err);
          });
      }
    }



    useEffect(() => {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const mute = () => {
      const videoElement = document.querySelector("video");
      videoElement.srcObject.getTracks().forEach(t => t.enabled = !t.enabled);
    }

    return (
    <>
    <>
    {!roomSelected ? 
    <>

    <Header currentSelection={0}></Header>
    <Content>
    {contextHolder}
    <div id="selectRoom" style={{height: '100%'}}>
      <div className="button-open-create-room-modal-container">
        <button className="btn button-open-create-room-modal"><FontAwesomeIcon icon={faTv} onClick={() => {setCreateLive(true)}}/></button>
      </div>
        <div className="possible-lives-container d-flex justify-content-center align-items-center" style={{height: '100%'}}>
          <div className="possible-lives-content">
            <div className="rooms row">
              {lives && lives.map((live, index) => {
                return (
                  <div className="col-md-4" key={index}>
                    <div className="card room-card">
                        <div className="card-body">
                            <div className="flag-image">
                                <img src={flags_array[live.native_l]} />
                            </div>
                            <div className="room">
                              <div className="row">
                                <div className="col-md-5 d-flex justify-content-center">
                                  <div className="avatar">
                                    <img src={live.avatar_image} />
                                  </div>
                                </div>
                                <div className="col-md-7 d-flex align-items-center justify-content-left">
                                  <div className="info-content">
                                    <div className="room-name mb-2">
                                      <h4>{live.roomName}</h4>
                                    </div>
                                    <div className="room-l mb-2">
                                      <p>{live.native_l}</p>
                                    </div>
                                    <div className="room-description mb-4">
                                      <p>{live.roomDescr}</p>
                                    </div>
                                    <div className="button-join-live-container">
                                      <button className="btn button-join-live" onClick={() => handleClickViewer(live.id)}>join</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
    </div>
    <Modal
    title="Create your room"
    className="modal-create-room"
    centered
    open={create_live}
    onCancel={() => setCreateLive(false)}
    >
    <div className="form-outline my-4">
        <Input placeholder="Room Name" onChange={(e) => {setRoomName(e.target.value)}} />
    </div>
    <div className="form-outline mb-4">
        <TextArea rows={4} placeholder="Write a short description of the room" maxLength={50} onChange={(e) => {setRoomDescr(e.target.value)}}/>
    </div>
    <div className="button-create-room-container">
      <button className="btn create-room-button" id="joinBroadcaster" onClick={()=>handleClickBroadcasterWrapper()}>Create room</button>
    </div>
    </Modal>
    </Content>
    </>
    :
    <div className="live-chat-container">
      <div className="live-chat-content">
        <div className="row" style={{height: '100%'}}>
          <div className="col-md-2 partecipants-container d-flex align-items-center justify-content-center" style={{width: '20%', height:'100%'}}>
            <div className="card">
              <div className="card-header">
                  <div className="title mt-3">
                    <h4>Partecipants</h4>
                  </div>
              </div>
              <div className="card-body main-card-body">
                <div className="participants-list-container">
                  <div className="participants-list-content">
                    {live_users.map((viewer, index) => {
                      return (
                        <div key={viewer.id} className="participant mb-4">
                          <div className="card partecipant-card">
                            <div className="card-body">
                              <div className="avatar">
                                <img src={viewer.avatar} />
                              </div>
                              <div className="username">
                                <p>{viewer.name}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-7" style={{width: '60%', height:'100%'}}>
            <div className="main-section-container">
              <div className="main-section-content">
                <div className="card">
                  <div className="card-body">
                    <div className="video-container">
                      <div className="video">
                        <video autoPlay id="myVideo"></video>
                      </div>
                    </div>
                    <div className="control-button-container">
                      <div className="endcall-button">
                        <button className="btn" onClick={() => {navigate(0)}}>
                          <FontAwesomeIcon icon={faPhoneSlash}></FontAwesomeIcon>
                        </button>
                      </div>
                      <div className="cameraoff-button">
                        <button className="btn" onClick={() => {mute()}}>
                          <FontAwesomeIcon icon={faCamera}></FontAwesomeIcon>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="col-md-3" style={{width: '20%', height:'100%'}}>
            <div className="chat-container">
              <div className="chat-content d-flex align-items-center justify-content-center">
                <div className="card">
                  <div className="card-header">
                    <h4>Chat</h4>
                  </div>
                  <div className="card-body">
                    <div className="messages-container">
                      <div className="messages">
                        { messages && 
                        <>
                        {messages.map((message, index) => {
                          return (
                            <div key={index} ref={scrollRef} className="message-item mb-3">
                              <div className="message-avatar">
                                <img src={message.avatar} />
                              </div>
                              <div className="message-container">
                                <div className="message-content">
                                  <div className="username">
                                    <p><strong>{message.user}</strong></p>
                                  </div>
                                  <div className="message-text">
                                    <p>{message.msg}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        </>
                        }
                      </div>
                    </div>
                  </div>
                  {!is_broadcaster &&
                  <div className="card-footer">
                    <div className="message-input">
                      <input type="text" placeholder='type your message here' value={message} onChange={(e) => setMessage(e.target.value)}/>
                      <button className='submit btn' type='submit' onClick={() => handleSendMessage()}>
                        <FontAwesomeIcon className="icon" icon={faPaperPlane}/>
                      </button>
                    </div>
                  </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    }




    </>
    </>

    );




}

export default LiveView;