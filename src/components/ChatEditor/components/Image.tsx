import { Box } from "@mui/material";
import { NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewProps } from "@tiptap/react";
import { Node } from "@tiptap/core";
import { useTranslation } from "react-i18next";
import { EntityType } from "../../../types/chat";
import { translations } from "../../../../i18n";

type ImageAttrs = {
    src: string
    alt?: string
}

export function ImageComponent({ src, alt }: ImageAttrs) {
    const { t } = useTranslation();
    return (
        <Box
            component="img"
            src={src}
            alt={alt ?? t(translations.aiChat.imageAttachment)}
            className="inline-block max-w-50 max-h-50 rounded-lg border align-middle"
        />
    );
}

export function ImageNode({ node }: ReactNodeViewProps) {
    const attrs = node.attrs as ImageAttrs;
    return (
        <NodeViewWrapper as="span">
            <ImageComponent src={attrs.src} alt={attrs.alt} />
        </NodeViewWrapper>
    );
}

export const image = Node.create({
    name: EntityType.IMAGE,
    group: "inline",
    inline: true,
    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "img[src]",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ["img", HTMLAttributes];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageNode);
    },
});
