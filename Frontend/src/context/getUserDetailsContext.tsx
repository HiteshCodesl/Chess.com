import { useNavigate } from "react-router-dom";
import axios from "axios"
import { useEffect, useState } from "react";

export interface UserInterface {
    id: string,
    username: string,
    email: string,
    createdAt: Date
}

function getUserDetails() {
    const [user, setUser] = useState<UserInterface | null>(null);
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem('token');

        if (!token) {
            console.log("Token Not Found");
            navigate('/login');
            return;
        }

        const userDetails = async () => {
            const response = await axios.get(`${import.meta.env.BACKEND_URL}/api/v1/user/me`, {
                headers: {
                    "Authorization": token
                }
            })
            console.log(response.data);
            setUser(response.data);
        }
        userDetails();
        
    }, [])

    return { user };
}

export default getUserDetails;