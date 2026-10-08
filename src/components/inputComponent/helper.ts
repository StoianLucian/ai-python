export function matchHotkey(
    e: React.KeyboardEvent,
    shortcut?: string
) {

    if (shortcut === undefined) return false

    const keys = shortcut.toLowerCase()
        .split("+")
        .map(k => k.trim());

    const mainKey = keys.find(
        k => !["ctrl", "shift", "alt", "meta"].includes(k)
    );

    return (
        e.key.toLowerCase() === mainKey &&
        e.ctrlKey === keys.includes("ctrl") &&
        e.shiftKey === keys.includes("shift") &&
        e.altKey === keys.includes("alt") &&
        e.metaKey === keys.includes("meta")
    );
}

export const keyboardShortcuts = {
    submit: "enter"
}