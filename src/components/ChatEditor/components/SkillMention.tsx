import { Chip } from "@mui/material";
import { NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewProps } from "@tiptap/react";
import { Node } from "@tiptap/core";
import { EntityType } from "../../../types/chat";

type SkillAttrs = {
    id: string
    label: string
}

export function SkillMentionComponent({ label }: { label: string }) {
    return <Chip
        size="small"
        label={label}
    />
}

export function SkillMention({ node }: ReactNodeViewProps) {
    const attrs = node.attrs as SkillAttrs
    return (
        <NodeViewWrapper as="span">
            <SkillMentionComponent label={attrs.label} />
        </NodeViewWrapper>
    );
}

export const skillMention = Node.create({
    name: EntityType.SKILL_MENTION,
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
                tag: EntityType.SKILL_MENTION,
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [EntityType.SKILL_MENTION, HTMLAttributes];
    },

    addNodeView() {
        return ReactNodeViewRenderer(SkillMention);
    },
});