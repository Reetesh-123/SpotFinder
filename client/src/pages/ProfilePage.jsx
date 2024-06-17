import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from 'axios'
import PlacesPage from "./PlacesPage";
import AccountNav from "../AccountNav";
export default function AccountPage() {
    const { user, setUser, ready } = useContext(UserContext);
    const [redirect, setRedirect] = useState(null);
    let { subpage } = useParams();
    if (subpage === undefined) {
        subpage = 'profile';
    }

    async function Logout() {
        await axios.post('/logout');
        setUser(null);
        setRedirect('/');
    }

    if (!ready) {
        return "Loading...";
    }
    if (ready && !user && !redirect) {
        <Navigate to={'/login'} />
    }
    if (redirect) {
        return <Navigate to={redirect} />
    }

   

    return (
        <div>
            <AccountNav/>
            {subpage === 'profile' && (
                <div className="text-center max-w-lg mx-auto mt-8">
                    Logged in as {user.name} ({user.email})<br />
                    <button className="primary max-w-sm mt-2" onClick={Logout}>Logout</button>
                </div>
            )}
            {subpage === 'places' && (
                <PlacesPage />
            )}
        </div>
    );
}