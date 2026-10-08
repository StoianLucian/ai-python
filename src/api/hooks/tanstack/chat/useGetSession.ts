import { useQuery } from "@tanstack/react-query";
import { getSession } from "../../../sessionApi";
import type { Role } from "./useChatSession";
import { useNavigate } from "react-router-dom";
import { APP_PATHS } from "../../../../routing/routes";
import { queryKeys } from "../../../../enums/queryKeys";

export type ChatSession = {
    id: string,
    title: string,
    created_at: Date
    chat_messages: ChatMessage[]
}

export type ChatImage = {
    id: number,
    message_id: number,
    text: string
}


export type ChatMessage = {
    id: string,
    text: string,
    session_id: number,
    role: Role
    images?: ChatImage[]
    created_at: Date,
    created_by: number,
}

const useGetSession = (id: string) => {
    const navigate = useNavigate();
    const query = useQuery({
        queryKey: queryKeys.session_id(id),
        queryFn: () => getSession(id),
        enabled: !!Number(id)
    });

    if (query.isError) {
        navigate(`${APP_PATHS.CHAT}/new`)
    }

    return query
};

export default useGetSession;
