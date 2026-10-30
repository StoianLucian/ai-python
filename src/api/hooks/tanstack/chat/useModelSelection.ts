import { useEffect, useState } from 'react';
import { DEFAULT_PROVIDER, type LlmProvider } from '../../../../enums/providers';
import { useChatModels } from './useChatModels';
import { useProviders } from './useProviders';

/**
 * Owns "which model are we talking to": the selected provider/model, the model
 * list, and whether the current model supports image input (`supportsVision`).
 * The provider list comes from the backend (GET /chat/providers).
 */
export function useModelSelection() {
    const [provider, setProvider] = useState<LlmProvider>(DEFAULT_PROVIDER);
    const [model, setModel] = useState<string>('');

    const { data: providersData, isLoading: loadingProviders } = useProviders();
    const providers = providersData?.providers ?? [];

    // Once the backend list loads, snap to its default if the current pick isn't
    // one it offers (e.g. the fallback default isn't available).
    useEffect(() => {
        if (providersData && !providers.some((p) => p.id === provider)) {
            setProvider(providersData.default);
        }
    }, [providersData, providers, provider]);

    const { data: options = [], isLoading: loadingOptions } = useChatModels(setModel, provider);

    const supportsVision = !!options.find((o) => o.id === model)?.vision;

    return {
        provider,
        setProvider,
        providers,
        loadingProviders,
        model,
        setModel,
        options,
        loadingOptions,
        supportsVision,
    };
}
