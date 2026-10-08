import { useMutation } from '@tanstack/react-query';
import { storeMessage } from '../../../messageApi';
import type { ChatResponse } from '../../../context/chatContext/ChatContext';

type CreateMessageProps = {
    id: string,
    message: PartialChatResponse,
}

export type PartialChatResponse = Pick<ChatResponse, "content" | "role" | "images">

export function useStoreMessage() {
    return useMutation({
        mutationFn: async ({ id, message }: CreateMessageProps) => {
            return await storeMessage({ id, message });
        },
        onError(e) {
            console.log(e)
        }
    });
}
