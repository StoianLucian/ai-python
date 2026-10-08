import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createSession } from '../../../sessionApi';
import { APP_PATHS } from '../../../../routing/routes';
import { queryKeys } from '../../../../enums/queryKeys';

export type CreateSessionProps = {
    query: string,
}

export function useCreateSession() {
    // const { t } = useTranslation();
    const client = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async ({ query }: CreateSessionProps) => {
            return await createSession({ query });
        },
        onSuccess(id) {
            navigate(`${APP_PATHS.CHAT}/${id}`, { replace: true })
            client.invalidateQueries({ queryKey: queryKeys.sessions })
        }
    });
}
