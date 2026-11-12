
const baseQueryKeys = {
    sessions: "sessions",
    providers: "providers",
    models: "models",
    hfModels: "hfModels",
    files: "files",
    chunks: "chunks",
    users: "users",
    skills: "skills",
    dailySummary: "dailySummary",
    embeddedDocuments: "embeddedDocuments"
} as const;

export const queryKeys = {
    sessions: [baseQueryKeys.sessions],
    session_id: (id: string) => [baseQueryKeys.sessions, id],
    providers: [baseQueryKeys.providers],
    models: (provider: string) => [baseQueryKeys.models, provider],
    hfModels: (q: string) => [baseQueryKeys.hfModels, q],
    files: [baseQueryKeys.files],
    file: (id: string) => [baseQueryKeys.files, id],
    chunks: [baseQueryKeys.chunks],
    fileChunks: (id: string) => [baseQueryKeys.chunks, id],
    users: (search: string) => [baseQueryKeys.users, search],
    skills: (search: string) => [baseQueryKeys.skills, search],
    dailySummary: (filters: Record<string, string | undefined>) => [baseQueryKeys.dailySummary, filters],
    dailyDetail: (day: string) => [baseQueryKeys.dailySummary, "detail", day],
    embeddedDocuments: [baseQueryKeys.embeddedDocuments],
    embeddedDocumentChunks: (id: number) => [baseQueryKeys.embeddedDocuments, id, "chunks"],
} as const;