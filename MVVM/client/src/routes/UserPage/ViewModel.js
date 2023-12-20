import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react";
import { cloneDeep } from "lodash";

import { getUserData, updateUserData} from "../../data/source";

export default function ProfileViewModel() {

    const {getAccessTokenSilently, user} = useAuth0();

    // Preleva o aggiorna i dati dell'utente dal localStorage
    const getUser = async() => {

        const token = await getAccessTokenSilently();
        const data = await getUserData(token);
        console.log(data);
        if(data) {
            data.hobbie1 = data.hobbies[0];
            data.hobbie2 = data.hobbies[1];
            data.hobbie3 = data.hobbies[2];
            data.hobbie4 = data.hobbies[3];
            data.goal1 = data.goals[0];
            data.goal2 = data.goals[1];
            data.goal3 = data.goals[2];
            data.goal4 = data.goals[3];
            delete data['hobbies'];
            delete data['goals'];
            console.log(data);
            setUserData(data);
        }

    };

    // Modifica dati utente tramite API
    const updateUser = async() => {

        const token = await getAccessTokenSilently();

        const updated_data = cloneDeep(userData); //copia per valore
        updated_data.hobbies = [updated_data.hobbie1,updated_data.hobbie2,updated_data.hobbie3,updated_data.hobbie4];
        updated_data.goals = [updated_data.goal1,updated_data.goal2,updated_data.goal3,updated_data.goal4];
        delete updated_data['points'];
        delete updated_data['goal1'];
        delete updated_data['goal2'];
        delete updated_data['goal3'];
        delete updated_data['goal4'];
        delete updated_data['hobbie1'];
        delete updated_data['hobbie2'];
        delete updated_data['hobbie3'];
        delete updated_data['hobbie4'];

        const data = await updateUserData(token, updated_data);

        if(data.registered && data.message === "Successfull registration") {

            const user_data = {
                id: user.sub,
                username: userData.username,
                avatar_image: userData.avatar_image,
                native_l: userData.native_l,
                new_l: userData.new_l,
            }
            localStorage.setItem('user-data', JSON.stringify(user_data));

            return true;
        } else {
            alert(data.message);
        }
        return false; 
    }

    const [userData, setUserData] = useState({
        avatar_image: null,
        username: null,
        biography: null,
        gender: null,
        birth_date: null,
        birth_country: null,
        job: null,
        first_name: null,
        last_name: null,
        native_l: null,
        new_l: null,
        points: null,
        email: user.email,
        goal1: '',
        goal2: '',
        goal3: '',
        goal4: '',
        hobbie1: '',
        hobbie2: '',
        hobbie3: '',
        hobbie4: '',
    });

    const setUser = (key, value) => {
        setUserData((prev) => ( {...prev, [key]: value} ) );
    };

    return {
        getUser,
        userData,
        setUser,
        updateUser,
    }
}
