
const baseQueryKeys = {
    sessions: "sessions",
    models: "models",
    files: "files",
    chunks: "chunks",
    users: "users",
    skills: "skills",
    dailySummary: "dailySummary"
} as const;

export const queryKeys = {
    sessions: [baseQueryKeys.sessions],
    session_id: (id: string) => [baseQueryKeys.sessions, id],
    models: (provider: string) => [baseQueryKeys.models, provider],
    files: [baseQueryKeys.files],
    file: (id: string) => [baseQueryKeys.files, id],
    chunks: [baseQueryKeys.chunks],
    fileChunks: (id: string) => [baseQueryKeys.chunks, id],
    users: (search: string) => [baseQueryKeys.users, search],
    skills: (search: string) => [baseQueryKeys.skills, search],
    dailySummary: (filters: Record<string, string | undefined>) => [baseQueryKeys.dailySummary, filters],
    dailyDetail: (day: string) => [baseQueryKeys.dailySummary, "detail", day]
} as const;