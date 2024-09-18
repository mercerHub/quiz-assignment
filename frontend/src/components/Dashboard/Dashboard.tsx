import { AuthContext } from "@/contexts/AuthContext";
import Session from "@/models/session";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Sidemenu from "../Sidemenu";

function Dashboard() {
    const {session} = useContext(AuthContext); // Retrieve the session from AuthContext
    const [userSession, setUserSession] = useState<Session | null>(session);
    const navigate = useNavigate();

    useEffect(() => {
        setUserSession(session);
        if (!session || session === null) {
            navigate("/login", { replace: true }); // Navigate to login if no session
        }else{
            console.log(session);
            
        }  
        
    }, [session, navigate]); // Use useEffect for side effects

    console.log(userSession?.user);

    return (
        <div className="w-screen h-screen bg-black flex"> 
            <div className="w-1/5 p-2 flex flex-col justify-between px-4">
                <Sidemenu/>
                <footer className="flex justify-between items-center p-4">
                    <span className="text-gray-900 font-semibold px-4 py-2 bg-slate-100 rounded-lg">{userSession?.user?.name}</span>
                    <span className="text-gray-900 font-semibold px-4 py-2 bg-slate-100 rounded-lg">Points : {userSession?.user?.points}</span>
                </footer>
            </div>
            <div className="w-4/5 rounded-lg bg-slate-200 p-2 m-2">
                <Outlet/>
            </div>
            
        </div>
    );
}

export default Dashboard;
