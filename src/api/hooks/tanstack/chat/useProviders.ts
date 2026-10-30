import { useQuery } from '@tanstack/react-query';
import { getProviders } from '../../../chatApi';
import { queryKeys } from '../../../../enums/queryKeys';

/** Fetches the chat providers (id + display name) and the default, from the
 * backend's GET /chat/providers — the single source of truth for the list. */
export function useProviders() {
    return useQuery({
        queryKey: queryKeys.providers,
        queryFn: getProviders,
        // The provider list rarely changes within a session.
        staleTime: Infinity,
    });
}
