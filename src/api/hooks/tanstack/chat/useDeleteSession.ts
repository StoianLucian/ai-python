import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteSession } from '../../../sessionApi';
import { queryKeys } from '../../../../enums/queryKeys';
import { useNavigate, useParams } from 'react-router-dom';
import { PATHS } from '../../../../routing/routes';
import { useChatContext } from '../../../context/chatContext/ChatContext';

export type CreateSessionProps = {
    query: string,
}

export function useDeleteSession(sessionId?: string) {
    const { setChatResponse } = useChatContext()
    const client = useQueryClient();
    const { id } = useParams();
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (id: string) => {
            return await deleteSession(id);
        },
        onSuccess() {
            client.invalidateQueries({ queryKey: queryKeys.sessions })
            if (id == sessionId) {
                navigate(PATHS.CHAT_NEW)
                setChatResponse?.([])
            }
        }
    });
}
