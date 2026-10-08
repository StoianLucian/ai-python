import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../../axiosConfig";

type AuthUser = {
    email: string
    username: string,
    id: string
}

type AuthContext = {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
    isAuthenticated: boolean
    setUser: React.Dispatch<React.SetStateAction<AuthUser | undefined>>,
    user: AuthUser | undefined,
    loading: boolean,
}

const AuthContext = createContext<AuthContext>({
    setIsAuthenticated: () => { },
    isAuthenticated: false,
    setUser: () => { },
    user: undefined,
    loading: true,
});


export function AuthContextProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<AuthUser | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get("/auth/me"); // cookie-ul este trimis automat
                setUser(res.data);
                setIsAuthenticated(true);
            } catch (err) {
                setUser(undefined);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ setIsAuthenticated, isAuthenticated, setUser, user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
};