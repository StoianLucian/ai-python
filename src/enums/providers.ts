// The chat providers are fetched from the backend (GET /chat/providers), which
// owns the list and the default. These are only the type and a fallback default
// used for initial state before that request resolves.
export type LlmProvider = string;

export const DEFAULT_PROVIDER: LlmProvider = "mlx";
