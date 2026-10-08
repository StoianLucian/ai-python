import { useQuery } from "@tanstack/react-query";
import { getSessions } from "../../../sessionApi";
import { queryKeys } from "../../../../enums/queryKeys";

export type ChatSession = {
    id: string,
    title: string,
    created_at: Date
    chat_messages?: ChatMessage[]
}

export type ChatMessage = {
    id: string,
    text: string,
    session_id: number,
    created_at: Date,
    created_by: number,
}

const useGetSessions = () => {
    return useQuery<ChatSession[]>({
        queryKey: queryKeys.sessions,
        queryFn: () => getSessions()
    });
};

export default useGetSessions;
