import { ApiMethod, baseURL, request } from "./axiosConfig";
import type { History } from "../components/Chat/AiChat";
import type { LlmProvider } from "../enums/providers";

export const CHAT_ROUTES_ENUM = {
    CHAT: "/chat",
    CHAT_PING: "/chat/ping",
    CHAT_PROVIDERS: "/chat/providers",
    CHAT_MODELS: "/chat/models",
    CHAT_MODELS_SEARCH: "/chat/models/search",
    CHAT_MODELS_PULL: "/chat/models/pull",
}

export type LlmProviderOption = {
    id: string;
    name: string;
}

export type ProvidersResponse = {
    providers: LlmProviderOption[];
    default: string;
}

export type ChatModel = {
    id: string;
    name: string;
    thinking: boolean;
    vision: boolean;
}

export type HfModel = {
    id: string;
    downloads: number;
    likes: number;
}

export type PullStatus = {
    status: "downloading" | "ready" | "error" | "unknown";
    error: string | null;
}

export async function chat(
    obj: { model: string, provider: LlmProvider, history: History[], session_id?: string | null },
    handleChunk: (chunk: string, isResponse: boolean, isThinking?: boolean, thinkingTime?: number) => void,
    signal: AbortSignal
) {
    try {
        const res = await fetch(`${baseURL}${CHAT_ROUTES_ENUM.CHAT}`, {
            method: ApiMethod.POST,
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                model: obj.model,
                provider: obj.provider,
                messages: obj.history,
                // Lets the server rebuild prior context from the session summary,
                // so we don't resend the whole conversation.
                session_id: obj.session_id ?? null
            }),
            signal: signal
        });

        const reader = res.body?.getReader();

        if (!reader) {
            console.log("No stream body received");
            return;
        }

        const decoder = new TextDecoder();
        // const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
        let buffer = "";
        let thinkingLoading = true;
        let thinkingStart: number | null = null;
        let thinkingEnd: number | null = null;

        let aiMessage = "";

        while (true) {
            const { done, value } = await reader!.read();

            if (signal?.aborted) {
                break
            }

            if (done) {
                break
            };

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");

            buffer = lines.pop() || "";

            for (const line of lines) {
                if (!line.trim()) continue;

                const parsed = JSON.parse(line);

                if (parsed.content) {
                    handleChunk(parsed.content, true);
                    aiMessage += parsed.content;
                }

                if (parsed.thinking) {
                    if (thinkingStart === null) {
                        thinkingStart = Date.now(); // initiate once
                    }
                    handleChunk(parsed.thinking, false, thinkingLoading)
                } else if (parsed.thinking == null && thinkingLoading) { // use thinkingLoading to only trigger once
                    thinkingLoading = false
                    thinkingEnd = Date.now()
                    const thinkingTime = (thinkingEnd - thinkingStart!) / 1000;
                    handleChunk("", false, thinkingLoading, thinkingTime)
                }
            }
        }

        return aiMessage;
    } catch (error) {
        throw error
    }
}

export async function pingModel(model: string, provider: LlmProvider) {
    return request({ method: ApiMethod.POST, url: CHAT_ROUTES_ENUM.CHAT_PING, data: { model, provider } })
}

export async function getAvailableModels(provider: LlmProvider): Promise<ChatModel[]> {
    return request({ method: ApiMethod.GET, url: `${CHAT_ROUTES_ENUM.CHAT_MODELS}?provider=${encodeURIComponent(provider)}` })
}

export async function getProviders(): Promise<ProvidersResponse> {
    return request({ method: ApiMethod.GET, url: CHAT_ROUTES_ENUM.CHAT_PROVIDERS })
}

export async function searchHfModels(q: string, limit = 20): Promise<HfModel[]> {
    return request({ method: ApiMethod.GET, url: `${CHAT_ROUTES_ENUM.CHAT_MODELS_SEARCH}?q=${encodeURIComponent(q)}&limit=${limit}` })
}

export async function pullModel(model: string): Promise<PullStatus> {
    return request({ method: ApiMethod.POST, url: CHAT_ROUTES_ENUM.CHAT_MODELS_PULL, data: { model } })
}

export async function getPullStatus(model: string): Promise<PullStatus> {
    return request({ method: ApiMethod.GET, url: `${CHAT_ROUTES_ENUM.CHAT_MODELS_PULL}?model=${encodeURIComponent(model)}` })
}