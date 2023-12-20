import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";

import Content from "../../general/content";
import Header from "../../general/header";
import Contacts from "../../partials/chat/contacts";
import ChatContainer from "../../partials/chat/chat-container";
import { message } from "antd";
import useViewModel from "./ViewModel"

function ChatView() {

    // currentUser è l'utente loggato
    const {getUser, currentUser, getAllContacts, contacts, openSocket,
          handleChatChange, currentChat, messages, sendMsg, getAllMessages, notifys, error} = useViewModel();

    const [messageApi, contextHolder] = message.useMessage();

    const showError = (msg, duration) => {
        messageApi.open({
            type: 'error',
            content: msg,
            duration: duration,
        });
    };
    useEffect(() => {

        error && showError(error, 2);

    }, [error]);

    useEffect(() => {

        getUser();

    }, []);

    // Invocata quando i dati dell'utente sono stati caricati
    useEffect(() => {   

        currentUser && getAllContacts() && openSocket();

    }, [currentUser]);
    // Dovrebbero essere messe anche le funzioni come depency

    // Invocato quando cambia l'utente selezionato(con cui chattare)
    useEffect(() => {

        currentChat && getAllMessages();

    }, [currentChat]);


    return (
        <>
        <Header currentSelection={2}></Header>
        <Content>
            {contextHolder}
            <div className="chat-container">
                <div className="chat-content">
                    <div className="row" style={{height: '100%'}}>
                        <div className="col-md-4 contacts-column d-flex align-items-center justify-content-center">
                            <div className="card">
                                <div className="card-body">
                                    <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} notifications={notifys} />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8 chat-column">
                            {currentChat===undefined?
                                <h2>Welcome</h2>:
                                <ChatContainer currentChat={currentChat} currentUser={currentUser} sendMsg={sendMsg} messages={messages} />
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Content>
        </>
    );

} 


export default ChatView;