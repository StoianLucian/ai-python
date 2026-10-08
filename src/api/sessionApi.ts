import { ApiMethod, request } from "./axiosConfig";
import type { CreateSessionProps } from "./hooks/tanstack/chat/useCreateSession";
import type { ChatSession } from "./hooks/tanstack/chat/useGetSession";
import type { SetSessionTitleProps } from "./hooks/tanstack/chat/useSetSessionTitle";

const SESSION_ROUTES_ENUM = {
    SESSION: "/session",
}

export const SESSION_ROUTES = {
    SESSION: SESSION_ROUTES_ENUM.SESSION,
    SESSION_ID: (id: string) => `${SESSION_ROUTES_ENUM.SESSION}/${id}`,
}

export async function createSession({ query }: CreateSessionProps) {
    return await request({ method: ApiMethod.POST, url: SESSION_ROUTES.SESSION, data: { query } })
}

export async function deleteSession(id: string) {
    return await request({ method: ApiMethod.DELETE, url: SESSION_ROUTES.SESSION_ID(id) })
}

export async function getSessions(): Promise<ChatSession[]> {
    return await request({ method: ApiMethod.GET, url: SESSION_ROUTES.SESSION })
}

export async function getSession(id: string): Promise<ChatSession> {
    return await request({ method: ApiMethod.GET, url: SESSION_ROUTES.SESSION_ID(id) })
}

export async function changeSessionTitle({ id, title }: SetSessionTitleProps) {
    return await request({ method: ApiMethod.PUT, url: SESSION_ROUTES.SESSION_ID(id), data: { title } })
}