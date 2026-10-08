import { useQuery } from '@tanstack/react-query';
import { getAvailableModels } from '../../../chatApi';
import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { queryKeys } from '../../../../enums/queryKeys';
import type { LlmProvider } from '../../../../enums/providers';


export function useChatModels(setModel: Dispatch<SetStateAction<string>>, provider: LlmProvider) {
    const query = useQuery({
        queryFn: () => getAvailableModels(provider),
        queryKey: queryKeys.models(provider),
    });

    useEffect(() => {
        if (query.isSuccess && query.data?.length) {
            setModel((current) =>
                current && query.data.some((m) => m.id === current)
                    ? current
                    : query.data[0].id
            );
        }
    }, [query.isSuccess, query.data, setModel]);

    return query
}
