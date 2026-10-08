import { ApiMethod, baseURL, request } from "./axiosConfig";
import type { History } from "../components/Chat/AiChat";
import type { LlmProvider } from "../enums/providers";

export const CHAT_ROUTES_ENUM = {
    CHAT: "/chat",
    CHAT_PING: "/chat/ping",
    CHAT_MODELS: "/chat/models",
}

export type ChatModel = {
    id: string;
    name: string;
    thinking: boolean;
    vision: boolean;
}

export async function chat(
    obj: { model: string, provider: LlmProvider, history: History[], thinking?: boolean, version?: string },
    handleChunk: (chunk: string, isResponse: boolean, isThinking?: boolean, thinkingTime?: number) => void,
    signal: AbortSignal
) {
    try {
        // Route to the selected endpoint version (defaults to v2).
        const res = await fetch(`${baseURL}${CHAT_ROUTES_ENUM.CHAT}/${obj.version ?? "v2"}`, {
            method: ApiMethod.POST,
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                model: obj.model,
                provider: obj.provider,
                messages: obj.history,
                thinking: obj.thinking ?? false
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