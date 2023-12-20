import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { getPossibleUsersData } from "../../data/source";

export default function ConnectViewModel() {

    const {getAccessTokenSilently} = useAuth0();
    
    const navigate = useNavigate();

    const [users, setUsers] = useState();

    // Redirect alla pagine profilo di un altro utente
    const handleClick = (id) => {
        navigate('/strangerpage', {
            state: {
                userId: id,
            }
        });
    }

    const getPossibleUsers = async() => {

        const token = await getAccessTokenSilently();

        const data = await getPossibleUsersData(token);
        
        if(data){
            setUsers(data);
        }
    };

    

    return {
        getPossibleUsers,
        users,
        handleClick,
    }
}