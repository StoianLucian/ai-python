import React, { createContext, useContext, useState } from "react";
import type { Role } from "../../../components/Chat/AiChat";
import { getSession } from "../../sessionApi";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routing/routes";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../enums/queryKeys";

type AuthContext = {
    changeSession: (id: string) => void
    chatResponse?: ChatResponse[]
    setChatResponse?: React.Dispatch<React.SetStateAction<ChatResponse[]>>
    isSessionFetching?: boolean,
    startSession: () => void
}

const ChatContext = createContext<AuthContext>({
    changeSession: () => { },
    chatResponse: [],
    setChatResponse: () => { },
    isSessionFetching: false,
    startSession: () => { }
});

export type ChatResponse = {
    content: string
    thinking: string
    role: Role
    isThinking?: boolean
    thinkingTime?: number
    images?: string[]
}

export function ChatContextProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [chatResponse, setChatResponse] = useState<ChatResponse[]>([])
    const [isSessionFetching, setIsSessionFetching] = useState(false);

    function startSession() {
        navigate(PATHS.CHAT_NEW, { replace: true })
        setChatResponse([]);
    }

    async function changeSession(id: string) {
        setIsSessionFetching(true);
        try {
            const session = await queryClient.fetchQuery({
                queryKey: queryKeys.session_id(id),
                queryFn: () => getSession(id),
            });
            setChatResponse(
                session.chat_messages.map((message) => ({
                    content: message.text,
                    thinking: "",
                    role: message.role,
                    images: message.images?.map((image) => image.text)
                }))
            );

            navigate(PATHS.CHAT_ID(id), { replace: true })
        } catch {
            startSession();
        } finally {
            setIsSessionFetching(false);
        }
    }

    return (
        <ChatContext.Provider value={{ changeSession, chatResponse, setChatResponse, isSessionFetching, startSession }}>
            {children}
        </ChatContext.Provider>
    );
}

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error("useChatContext must be used within an ChatProvider");
    }
    return context;
};