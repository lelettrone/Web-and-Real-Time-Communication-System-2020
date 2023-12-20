import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { getStrangerData, addContactData } from "../../data/source";

export default function StrangerPageViewModel() {

    const {getAccessTokenSilently} = useAuth0();
    
    const navigate = useNavigate();

    const location = useLocation();

    // Preleva userId Auth0 dell'utente di cui si vuole visualizzare il profilo
    // passato dalla pagina Connect
    let userId = location.state.userId;

    // Invocata quando si decide di avviare una conversazione con il nuovo contatto
    const handleClick = async() => {
    
        const token = await getAccessTokenSilently();  

        const data = await addContactData(token, userId);
        if(data === "Contact added"){
            navigate('/chat');
        }
        
    };

    const [strangerData, setStrangerData] = useState();

    async function getStranger() {

        const token = await getAccessTokenSilently();

        const data = await getStrangerData(token, userId);

        if(data) {
            setStrangerData(data);
        }

    }
    return {
        getStranger,
        strangerData,
        handleClick,
    }
}