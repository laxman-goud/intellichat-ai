/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/set-state-in-effect */
import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type { ReactNode } from "react";
import type { NavigateFunction } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { dummyUserData, dummyChats } from "../assets/assets";
import type { IUser, IChat } from "../types/chat.types";
import type { AppContextType } from "../types/app-context.types";

/* ------------------ CONTEXT ------------------ */

const AppContext = createContext<AppContextType | undefined>(undefined);

/* ------------------ PROVIDER PROPS ------------------ */

interface AppContextProviderProps {
    children: ReactNode;
}

/* ------------------ PROVIDER ------------------ */

export const AppContextProvider = ({
    children,
}: AppContextProviderProps) => {
    const navigate: NavigateFunction = useNavigate();

    const [user, setUser] = useState<IUser | null>(null);
    const [chats, setChats] = useState<IChat[]>([]);
    const [selectedChat, setSelectedChat] = useState<IChat | null>(null);
    const [theme, setTheme] = useState<string>(
        localStorage.getItem("theme") || "light"
    );

    /* ------------------ ACTIONS ------------------ */

    const fetchUser = async (): Promise<void> => {
        setUser(dummyUserData);
    };

    const fetchUsersChats = async (): Promise<void> => {
        setChats(dummyChats);
        setSelectedChat(dummyChats[0] || null);
    };

    /* ------------------ EFFECTS ------------------ */

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        if (user) {
            fetchUsersChats();
        } else {
            setChats([]);
            setSelectedChat(null);
        }
    }, [user]);

    useEffect(() => {
        fetchUser();
    }, []);

    /* ------------------ CONTEXT VALUE ------------------ */

    const value: AppContextType = {
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        theme,
        setTheme,
        navigate,
        fetchUser,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

/* ------------------ CUSTOM HOOK ------------------ */

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error(
            "useAppContext must be used within an AppContextProvider"
        );
    }

    return context;
};