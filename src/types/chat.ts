
export type Entity = {
    type: string
    text: string
    content?: string
    action?: string
    source_id?: string
    page_number?: string
    url?: string
}

export const EntityType = {
    TEXT: "text",
    BUTTON: "button",
    ERROR: "error",
    POPOVER: "popover",
    URL: "url",
    SKILL_MENTION: "skill-mention",
    USER_MENTION: 'user-mention',
    HARD_BREAK: "hardBreak",
    IMAGE: "image"
}