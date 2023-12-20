/*const COLLECTION = "PRODUCTS"
export function getAll() {
    try {
        let data = [];
        let dataString = window.localStorage.getItem(COLLECTION)
        if (dataString) {
            data = JSON.parse(dataString)
        }
        return Promise.resolve({ error: null, result: data })

    } catch (err) {
        return Promise.resolve({ error: err.message, result: null })
    }
}
*/

import Axios from "axios";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_SERVER_URL;

export const getStrangerData = async(token, userId) => {
    
    const response = await Axios.get(BASE_URL+'/getStrangerData', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            user_id: userId
        }
    });

    return response.data;

};

export const addContactData = async(token, userId) => {
    // L'utente viene aggiunto come nuovo contatto 
    const response = await axios({method: 'post', url: BASE_URL + '/addContact', 
        headers: {'Authorization': `Bearer ${token}`}, 
        params : {
            contact_id: userId,
        } 
   });

    return response.data;

};

export const getUserData = async(token) => {

    //Preleva dati utente tramite API
    const response = await Axios.get(BASE_URL+'/getUserData', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;

};

export const getAllContactsData = async(token) => {

    //Preleva dati utente tramite API
    const response = await Axios.get(BASE_URL+'/getContacts', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const getAllMessagesData = async(token, currentChat) => {

    //Preleva i messaggi
    const response = await axios({method: 'post', url: BASE_URL + '/getAllMsgs', 
        headers: {'Authorization': `Bearer ${token}`}, 
        params : {
            to: currentChat.id,
        } 
    });

    return response.data;
};

export const addMsgData = async(token, currentChat, msg) => {
    const response = await axios({method: 'post', url: BASE_URL + '/addMsg', 
        headers: {'Authorization': `Bearer ${token}`}, 
        params : {
            to: currentChat.id,
            message: msg,
        } 
    });
    
    return response.data;
};


// Preleva tramite API la lista di possibli nuovi contatti
export const getPossibleUsersData = async(token) => {

    const response = await Axios.get(BASE_URL+'/getPossibleUsers', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const updateUserData = async(token, params_update) => {

    const response = await axios({method: 'post', url: BASE_URL + '/updateUserProfile', 
        headers: {'Authorization': `Bearer ${token}`}, 
        params : params_update 
    });

    return response.data;
};

// Controlla tramite API se l'utente ha già terminato la registrazione dei dati profilo
export const checkIfUserExistData = async(token) => {
    
    const response = await Axios.get(BASE_URL + "/checkIfUserExist", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Controlla tramite API se l'utente ha già terminato la registrazione dei dati profilo
export const createUserData = async(token, data) => {
    
    const response = await axios({method: 'post', url: BASE_URL + '/registerUser', 
        headers: {'Authorization': `Bearer ${token}`}, 
        params : {...data} // Spread operator
    });

    return response.data;
};

export const getPossibleLivesData = async(token, native_l) => {

    const response = await Axios.get(BASE_URL+'/getPossibleLives', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params:{
            native_l: native_l
        }
    });

    return response.data;
};