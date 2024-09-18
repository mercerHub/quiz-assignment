import { createContext, useState } from "react";
import Session from "@/models/session";

interface Props {
    children: React.ReactNode;
}

export const AuthContext = createContext({});


export function AuthProvider(props: Props) {
    const [session, setSession] = useState<Session | null>(null);
    if(session === null){
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        if(accessToken && refreshToken && user){
            setSession({accessToken, refreshToken, user});
        }
    }

    return (
        <AuthContext.Provider value={{session,setSession}}>
            {props.children}
        </AuthContext.Provider>
    )
}