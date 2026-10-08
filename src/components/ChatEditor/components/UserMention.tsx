import { Chip } from "@mui/material";
import { NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewProps } from "@tiptap/react";
import { Node } from "@tiptap/core";
import { EntityType } from "../../../types/chat";

type SkillAttrs = {
    id: string
    label: string
}

export function UserMentionComponent({ label }: { label: string }) {
    return <Chip
        size="small"
        label={label}

    />
}

export function UserMention({ node }: ReactNodeViewProps) {
    const attrs = node.attrs as SkillAttrs
    return (
        <NodeViewWrapper as="span">
            <UserMentionComponent label={attrs.label} />
        </NodeViewWrapper>
    );
}

export const userMention = Node.create({
    name: EntityType.USER_MENTION,
    group: "inline",
    inline: true,
    atom: true,

    addAttributes() {
        return {
            id: {
                default: null,
            },
            label: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: EntityType.USER_MENTION,
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [EntityType.USER_MENTION, HTMLAttributes];
    },

    addNodeView() {
        return ReactNodeViewRenderer(UserMention);
    },
});