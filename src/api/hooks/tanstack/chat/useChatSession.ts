import { useEffect, useRef, useState } from "react"
import { useChatModel } from "./useChat"
import { useCreateSession } from "./useCreateSession"
import { useParams } from "react-router-dom"
import { useStoreMessage } from "./useCreateMessage"
import { useChatContext, type ChatResponse } from "../../../context/chatContext/ChatContext"
import type { LlmProvider } from "../../../../enums/providers"

export const RoleEnum = {
    AGENT: "assistant",
    USER: "user",
}

export type Role = typeof RoleEnum[keyof typeof RoleEnum];

export function useChatSession(model: string, provider: LlmProvider, thinking = false) {
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

    async function handleUserMessage(userMessage: ChatResponse) {
        if (isNewChat) {
            const sessionId = await createSession({ query: userMessage.content });
            await storeMessage({ id: sessionId, message: userMessage })
            return sessionId
        } else {
            await storeMessage({ id: id!, message: userMessage })
            return id
        }
    }

    const loading = messagePending || sessionPending || chatPending;

    const sendMessage = async (query: string) => {
        // if (query.trim() === "") return
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();
        aiIndexRef.current = null;

        const signal = controllerRef.current.signal;

        const message = await returnCreatedMessage(query)

        const updatedHistory = attachHistory(message)

        const history = {
            model,
            provider,
            thinking,
            history: updatedHistory.map((message) => ({
                role: message.role,
                content: message.content,
                images: message.images
            }))
        };

        const aiMessage = await startChat({
            obj: history,
            handleChunk: showAiResponse,
            signal,
        });

        const sessionId = await handleUserMessage(message)

        if (sessionId && aiMessage) {
            await storeMessage({ id: sessionId, message: { content: aiMessage, role: RoleEnum.AGENT } })
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