// Client-side buffer for an in-flight chat turn, so a brand-new chat's messages
// aren't lost before the session is persisted server-side (e.g. a reload or a
// failed save mid-turn). Lives in localStorage — NOT a cookie: cookies are ~4KB
// and ride along on every HTTP request, which is wrong for app data.
//
// A random `tempId` gives the turn a stable handle before the real integer
// `sessionId` exists; once the session is created we record it here, and once
// the messages are persisted we clear the buffer.

const KEY = "pendingChat";

export type PendingMessage = {
    role: string;
    content: string;
    images?: string[];
};

export type PendingChat = {
    tempId: string;
    sessionId: string | null; // filled once the session is created
    messages: PendingMessage[];
};

export function savePendingChat(pending: PendingChat): void {
    try {
        localStorage.setItem(KEY, JSON.stringify(pending));
    } catch {
        // Quota exceeded / private mode — the buffer is best-effort, never fatal.
    }
}

export function loadPendingChat(): PendingChat | null {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as PendingChat) : null;
    } catch {
        return null;
    }
}

export function clearPendingChat(): void {
    try {
        localStorage.removeItem(KEY);
    } catch {
        // ignore
    }
}

export function newTempId(): string {
    // crypto.randomUUID is available in all modern browsers (secure contexts).
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
        return crypto.randomUUID();
    }
    return `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
