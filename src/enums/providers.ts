// LLM providers the chat can talk to. The `id` is sent to the backend and
// resolved by `get_lmm_provider()`; `name` is the label shown in the dropdown.
export const LLM_PROVIDERS = [
    { id: "ollama", name: "Ollama" },
    { id: "google", name: "Google" },
] as const;

export type LlmProvider = typeof LLM_PROVIDERS[number]["id"];

export const DEFAULT_PROVIDER: LlmProvider = "ollama";
