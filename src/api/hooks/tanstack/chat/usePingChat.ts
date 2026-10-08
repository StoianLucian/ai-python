import { useMutation } from '@tanstack/react-query';
import { pingModel } from '../../../chatApi';
import type { LlmProvider } from '../../../../enums/providers';

export function usePingModel(statusHandler: React.Dispatch<React.SetStateAction<boolean>>) {
    return useMutation({
        mutationFn: async ({ model, provider }: { model: string; provider: LlmProvider }) => {
            const response = await pingModel(model, provider);
            return response;
        },
        onError: (error) => {
            console.error(error)
            statusHandler(false)
        },
        onSuccess: (_success) => {
            statusHandler(true)
        }
    });
}
