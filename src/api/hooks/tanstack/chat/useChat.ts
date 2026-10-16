import { useMutation } from '@tanstack/react-query';
import { chat } from '../../../chatApi';
import type { History } from '../../../../components/Chat/AiChat';
import type { LlmProvider } from '../../../../enums/providers';

type ChatProps = {
    obj: {
        history: History[],
        model: string,
        provider: LlmProvider,
        thinking?: boolean
    },
    handleChunk: (chunk: string, isResponse: boolean, isThinking?: boolean, thinkingTime?: number) => void,
    signal: AbortSignal
}

export function useChatModel() {
    return useMutation({
        mutationFn: async ({ obj, handleChunk, signal }: ChatProps) => {
            return await chat(obj, handleChunk, signal);
        },
    });
}