
const baseQueryKeys = {
    sessions: "sessions",
    models: "models",
    files: "files",
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
    users: (search: string) => [baseQueryKeys.users, search],
    skills: (search: string) => [baseQueryKeys.skills, search],
    dailySummary: (filters: Record<string, string | undefined>) => [baseQueryKeys.dailySummary, filters],
    dailyDetail: (day: string) => [baseQueryKeys.dailySummary, "detail", day]
} as const;