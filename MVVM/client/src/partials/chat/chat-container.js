import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useRef, useState } from "react";
import ChatInput from "./chat-input"; 
import axios from "axios";
import {v4 as uuidv4} from 'uuid';

// Componente utilizzato renderizzare la chat con l'utente selezionato.

const ChatContainer = ({currentChat, currentUser,
                        sendMsg, messages}) => {

    const scrollRef = useRef();
    
    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    
    const handleSendMsg = (msg) => {
        sendMsg(msg);
    };

    return(
        <>
        <div className="chat-component-container">
            <div className="chat-component-content">
                <div className="card">
                    <div className="card-header">
                        <div className="user-details">
                            <div className="avatar">
                                <img src={currentChat.avatar_image} alt="avatar" />
                            </div>
                            <div className="username">
                                <h3>{currentChat.username}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="chat-messages-container">
                            <div className="chat-messages-content">
                                {messages.map((message) => {
                                    return (
                                        <div className="message-scroll-div mb-4" ref={scrollRef} key={uuidv4()}>
                                            <div className={`message-item ${message.fromSelf?"sended":"recieved"}`}>
                                                {!message.fromSelf &&
                                                <div className={`message-avatar ${message.fromSelf?"sended":"recieved"}`}>
                                                    <img src={`${message.fromSelf?currentUser.avatar_image:currentChat.avatar_image}`} />
                                                </div>
                                                }
                                                <div className="message-content">
                                                    <p>
                                                        {message.message}
                                                    </p>
                                                </div>
                                                {message.fromSelf && 
                                                <div className={`message-avatar ${message.fromSelf?"sended":"recieved"}`}>
                                                    <img src={`${message.fromSelf?currentUser.avatar_image:currentChat.avatar_image}`} />
                                                </div>
                                                }
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <div className="chat-input-container">
                            <ChatInput handleSendMsg={handleSendMsg} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );

}


export default ChatContainer;