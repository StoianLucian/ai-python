import { Box, CircularProgress, Link } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import { NodeViewWrapper, ReactNodeViewRenderer, type ReactNodeViewProps } from "@tiptap/react";
import { Node } from "@tiptap/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { EntityType } from "../../../types/chat";
import { translations } from "../../../../i18n";

type UrlAttrs = {
    text: string
    url: string
}

export const PingStatusEnum = {
    IDLE: "idle",
    PENDING: "pending",
    OK: "ok",
    FAILED: "failed",
} as const;

type PingStatus = typeof PingStatusEnum[keyof typeof PingStatusEnum];

// Only allow links we know are safe to click. The URL constructor throws on
// malformed input, and restricting the protocol blocks XSS vectors such as
// `javascript:` / `data:` hrefs (this url comes from an LLM response).
function isSafeUrl(value: string) {
    try {
        const { protocol } = new URL(value);
        return protocol === "http:" || protocol === "https:";
    } catch {
        return false;
    }
}

// Best-effort reachability check. NOTE: the browser can't read the HTTP status
// of a cross-origin URL (CORS), so we use a `no-cors` request — it only tells
// us the request reached the network without erroring, not that it was 200.
// For a real status check this needs to go through a backend proxy.
function usePingUrl(url: string, enabled: boolean) {
    const [status, setStatus] = useState<PingStatus>(PingStatusEnum.IDLE);

    useEffect(() => {
        if (!enabled) {
            setStatus(PingStatusEnum.IDLE);
            return;
        }

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        setStatus(PingStatusEnum.PENDING);

        fetch(url, { method: "HEAD", mode: "no-cors", signal: controller.signal })
            .then(() => setStatus(PingStatusEnum.OK))
            .catch(() => setStatus(PingStatusEnum.FAILED))
            .finally(() => clearTimeout(timeout));

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [url, enabled]);

    return status;
}

export function UrlComponent({ text, url }: UrlAttrs) {
    const { t } = useTranslation();
    const safe = isSafeUrl(url);
    const status = usePingUrl(url, safe);

    if (!safe) {
        // Render the label as plain text rather than a broken/unsafe link,
        // flagged with an error icon so it's clear the link was rejected.
        return (
            <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                <span>{text}</span>
                <ErrorIcon color="error" sx={{ fontSize: 14 }} titleAccess={t(translations.aiChat.urlUnsafe)} />
            </Box>
        );
    }

    return (
        <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
            <Link
                href={url}
                target="_blank"
                rel="noopener noreferrer"
            >
                {text}
            </Link>
            {status === PingStatusEnum.PENDING && <CircularProgress size={12} />}
            {status === PingStatusEnum.OK && (
                <CheckCircleIcon color="success" sx={{ fontSize: 14 }} titleAccess={t(translations.aiChat.urlReachable)} />
            )}
            {status === PingStatusEnum.FAILED && (
                <WarningIcon color="warning" sx={{ fontSize: 14 }} titleAccess={t(translations.aiChat.urlUnreachable)} />
            )}
        </Box>
    );
}

export function UrlNode({ node }: ReactNodeViewProps) {
    const attrs = node.attrs as UrlAttrs
    return (
        <NodeViewWrapper as="span">
            <UrlComponent text={attrs.text} url={attrs.url} />
        </NodeViewWrapper>
    );
}

export const url = Node.create({
    name: EntityType.URL,
    group: "inline",
    inline: true,
    atom: true,

    addAttributes() {
        return {
            text: {
                default: null,
            },
            url: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: EntityType.URL,
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [EntityType.URL, HTMLAttributes];
    },

    addNodeView() {
        return ReactNodeViewRenderer(UrlNode);
    },
});
