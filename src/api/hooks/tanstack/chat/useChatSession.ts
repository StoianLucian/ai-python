import { useEffect, useRef, useState } from "react"
import { useChatModel } from "./useChat"
import { useCreateSession } from "./useCreateSession"
import { useParams } from "react-router-dom"
import { useStoreMessage } from "./useCreateMessage"
import { useChatContext, type ChatResponse } from "../../../context/chatContext/ChatContext"
import type { LlmProvider } from "../../../../enums/providers"
import { summarizeSession } from "../../../sessionApi"
import { clearPendingChat, loadPendingChat, newTempId, savePendingChat } from "../../../pendingChat"

export const RoleEnum = {
    AGENT: "assistant",
    USER: "user",
}

export type Role = typeof RoleEnum[keyof typeof RoleEnum];

export function useChatSession(model: string, provider: LlmProvider) {
    const { chatResponse = [], setChatResponse, isSessionFetching } = useChatContext()
    const [file, setFile] = useState<File | null>(null)

    function resetInputs() {
        setFile(null);
    }

    const { id } = useParams();

    const isNewChat = id === "new";

    const controllerRef = useRef<AbortController | null>(null)
    const aiIndexRef = useRef<number | null>(null)

    const { mutateAsync: startChat, isPending: chatPending } = useChatModel()
    const { mutateAsync: createSession, isPending: sessionPending } = useCreateSession()
    const { mutateAsync: storeMessage, isPending: messagePending } = useStoreMessage()

    function stopChat() {
        controllerRef.current?.abort()
    }

    useEffect(() => {
        if (isNewChat) {
            aiIndexRef.current = null;
            controllerRef.current?.abort();

            // Restore an in-flight turn that was never persisted (reload / failed
            // save mid-turn), so the user doesn't lose their message.
            const pending = loadPendingChat();
            if (pending?.messages.length) {
                setChatResponse?.(pending.messages as ChatResponse[]);
            }
            return;
        }
    }, [isNewChat]);

    const toBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });

    function removeBeforeComma(str: string) {
        return str.substring(str.indexOf(",") + 1);
    }

    async function returnCreatedMessage(query: string): Promise<ChatResponse> {
        const base64Image: string = file ? await toBase64(file) : ""
        const message = {
            content: query,
            thinking: "",
            role: RoleEnum.USER,
            images: base64Image ? [removeBeforeComma(base64Image)] : []
        };

        return message
    }

    function attachHistory(message: ChatResponse) {

        const history = [...chatResponse, message];

        setChatResponse?.(history);

        resetInputs();

        return history;
    }

    function showAiResponse(
        chunk: string,
        isResponse: boolean,
        isLoading = false,
        time = 0
    ) {
        setChatResponse?.((prev) => {
            const updated = [...prev]

            if (aiIndexRef.current === null) {
                aiIndexRef.current = updated.length
                updated.push({
                    content: "",
                    thinking: "",
                    role: RoleEnum.AGENT,
                })
            }

            const idx = aiIndexRef.current

            updated[idx] = {
                ...updated[idx],
                role: RoleEnum.AGENT,
                ...(isResponse
                    ? {
                        content: (updated[idx]?.content || "") + chunk,
                    }
                    : {
                        thinking: (updated[idx]?.thinking || "") + chunk,
                        isThinking: isLoading,
                        thinkingTime: time,
                    }),
            }
            return updated
        })
    }

    const loading = messagePending || sessionPending || chatPending;

    const sendMessage = async (query: string) => {
        // if (query.trim() === "") return
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();
        aiIndexRef.current = null;

        const signal = controllerRef.current.signal;

        const message = await returnCreatedMessage(query)

        attachHistory(message)

        // Buffer the turn locally (localStorage) under a temp id, BEFORE any
        // await, so it survives a reload / failed save until it's persisted.
        const tempId = newTempId();
        savePendingChat({
            tempId,
            sessionId: null,
            messages: [{ role: message.role, content: message.content, images: message.images }],
        });

        // Create the session UP FRONT on a new chat (awaited) so this turn's
        // messages can be persisted to a real session_id; an existing chat
        // reuses `id`. The session is created empty — messages are stored after
        // the stream — so the server's conversation_history is empty on this
        // first turn and the current message isn't sent twice.
        const sessionId = isNewChat
            ? await createSession({ query: message.content })
            : id;

        // Record the real session id against the temp buffer now it exists.
        savePendingChat({
            tempId,
            sessionId: sessionId ?? null,
            messages: [{ role: message.role, content: message.content, images: message.images }],
        });

        // Only send the current turn; the server rebuilds prior context from the
        // session's rolling summary (+ recent messages) using session_id.
        const history = {
            model,
            provider,
            session_id: sessionId ?? null,
            history: [{
                role: message.role,
                content: message.content,
                images: message.images
            }]
        };

        const aiMessage = await startChat({
            obj: history,
            handleChunk: showAiResponse,
            signal,
        });

        if (sessionId) {
            // Persist the user turn, then the assistant turn, in order.
            await storeMessage({ id: sessionId, message })
            if (aiMessage) {
                await storeMessage({ id: sessionId, message: { content: aiMessage, role: RoleEnum.AGENT } })
                // Fire-and-forget: refresh the session's rolling summary now that
                // both turns are persisted. Never block or fail the chat on it.
                void summarizeSession(sessionId).catch(() => { })
            }
            // Persisted server-side — the local buffer is no longer needed.
            clearPendingChat()
        }
    };

    return {
        chatResponse,
        sendMessage,
        loading,
        stopChat,
        chatPending,
        isSessionFetching,
        setFile,
        file
    }
}