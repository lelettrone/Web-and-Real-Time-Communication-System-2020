import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { checkIfUserExistData, createUserData } from "../../data/source";

export default function RegisterViewModel() {

    const {getAccessTokenSilently, user} = useAuth0();
    
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

    const checkIfUserExist = async() => {

        const token = await getAccessTokenSilently();

        const data = await checkIfUserExistData(token);
        
        if(data && data.isRegistered) {
            navigate('/userpage');
        }
    };

    const createUser = async(user_data) => {
    
        const token = await getAccessTokenSilently();

        const data = await createUserData(token, {...user_data, email: user.email});

        if(data.registered) {
            navigate('/profile');
        } else {
            alert(data.message);
        }
    };

    return {
        checkIfUserExist,
        createUser,
        handleClick,
    }
}