import { useMutation, useQueryClient } from '@tanstack/react-query';
import { changeSessionTitle } from '../../../sessionApi';
import { queryKeys } from '../../../../enums/queryKeys';

export type SetSessionTitleProps = {
    id: string,
    title: string
}

export function useSetSessionTitle() {
    const client = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, title }: SetSessionTitleProps) => {
            return await changeSessionTitle({ id, title });
        },
        onSuccess() {
            client.invalidateQueries({ queryKey: queryKeys.sessions })
        }
    });
}
