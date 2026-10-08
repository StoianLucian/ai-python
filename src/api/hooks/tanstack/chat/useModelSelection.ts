import { useEffect, useState } from 'react';
import { DEFAULT_PROVIDER, type LlmProvider } from '../../../../enums/providers';
import { useChatModels } from './useChatModels';

/**
 * Owns everything about "which model are we talking to and how":
 * the selected provider/model, the thinking toggle, and the model list.
 * `supportsThinking` is derived from the selected model, and the toggle is
 * force-reset off whenever it lands on a model that can't think — so callers
 * never have to keep those pieces of state in sync by hand.
 */
export function useModelSelection() {
    const [provider, setProvider] = useState<LlmProvider>(DEFAULT_PROVIDER);
    const [model, setModel] = useState<string>('');
    const [thinking, setThinking] = useState<boolean>(false);

    const { data: options = [], isLoading: loadingOptions } = useChatModels(setModel, provider);

    const supportsThinking = !!options.find((o) => o.id === model)?.thinking;
    const supportsVision = !!options.find((o) => o.id === model)?.vision;

    useEffect(() => {
        if (!supportsThinking && thinking) {
            setThinking(false);
        }
    }, [supportsThinking, thinking]);

    return {
        provider,
        setProvider,
        model,
        setModel,
        thinking,
        setThinking,
        options,
        loadingOptions,
        supportsThinking,
        supportsVision,
    };
}
