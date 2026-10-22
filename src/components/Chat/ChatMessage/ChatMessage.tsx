import { Alert, Box, Button } from '@mui/material'
import HoverPopover from '../../HoverPopover/HoverPopover'
import { EntityType, type Entity } from '../../../types/chat';
import { jsonrepair } from "jsonrepair";
import { useMemo, useRef } from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { SkillMentionComponent } from '../../ChatEditor/components/SkillMention';
import { UserMentionComponent } from '../../ChatEditor/components/UserMention';
import { UrlComponent } from '../../ChatEditor/components/Url';
import { ImageComponent } from '../../ChatEditor/components/Image';


type ChatMessageProps = {
    message: string;
    alignRight: boolean;
    isStreaming?: boolean;
}

// Citation marker the assistant emits: [[source:<file_id>:<page>|<quote>]] (the
// quote is optional). We rewrite it to a markdown link with a `source:` scheme
// (quote URL-encoded) so react-markdown routes it to a HoverPopover, which
// previews/downloads the file and highlights the quote in the PDF.
const SOURCE_MARKER = /\[\[source:([^:|\]]+):([^:|\]]+)(?:\|([^\]]*))?\]\]/g;

function MarkdownMessage({ text }: { text: string }) {
    const withLinks = text.replace(
        SOURCE_MARKER,
        (_m, id, page, quote) => `[source](source:${id}:${page}:${encodeURIComponent(quote ?? "")})`
    );

    return (
        <Box className="chat-markdown whitespace-normal break-words">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                // Keep default URL sanitizing, but let our custom `source:` scheme
                // through (react-markdown strips unknown schemes by default, which
                // was blanking the citation links).
                urlTransform={(url) => url.startsWith("source:") ? url : defaultUrlTransform(url)}
                components={{
                    a({ href, children }) {
                        if (href && href.startsWith("source:")) {
                            const parts = href.split(":");
                            const item: Entity = {
                                type: EntityType.POPOVER,
                                text: "",
                                source_id: parts[1],
                                page_number: parts[2],
                                // Verbatim quote to highlight in the PDF (optional).
                                content: parts[3] ? decodeURIComponent(parts[3]) : undefined,
                            };
                            return <HoverPopover item={item} />;
                        }
                        return (
                            <a href={href} target="_blank" rel="noreferrer">
                                {children}
                            </a>
                        );
                    },
                    img({ src, alt }) {
                        return (
                            <img
                                src={typeof src === "string" ? src : ""}
                                alt={alt ?? ""}
                                className="max-w-full rounded-lg"
                            />
                        );
                    },
                }}
            >
                {withLinks}
            </ReactMarkdown>
        </Box>
    );
}


function ChatMessage({ message, alignRight, isStreaming = false }: ChatMessageProps) {

    function safeParseJson(input: string) {
        try {
            return JSON.parse(input);
        } catch {
            try {
                return JSON.parse(jsonrepair(input));
            } catch {
                return null;
            }
        }
    }

    function parseLLMJson(message: string) {
        const cleaned = message
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const parsed = safeParseJson(cleaned);
        // Only treat it as our structured format when it's a JSON ARRAY of typed
        // objects (user/tiptap messages, legacy assistant replies). Anything else
        // — including plain prose — is rendered as Markdown.
        return Array.isArray(parsed) ? parsed : null;
    }

    const lastValidData = useRef<any[] | null>(null);

    const data = useMemo<any[] | null>(() => {
        const parsed = parseLLMJson(message);

        if (parsed) {
            lastValidData.current = parsed;
            return parsed;
        }

        // While streaming, a message may not be valid JSON yet — keep showing the
        // last good structured render instead of flashing raw text.
        if (isStreaming && lastValidData.current) {
            return lastValidData.current;
        }

        // Not structured JSON -> Markdown message.
        return null;
    }, [message, isStreaming]);

    const base =
        "flex flex-col gap-1.5 px-4 py-3 text-[15px] leading-relaxed break-words rounded-3xl"
    const alignEnd = "bg-[#5B8C7B] text-white self-end rounded-tr-md"
    const alignStart =
        "bg-white text-[#1F2933] self-start rounded-tl-md shadow-sm ring-1 ring-[#ECEAE4]"

    const renderedMessage = useMemo(() => {
        if (!data) {
            return <MarkdownMessage text={message} />;
        }

        return data.map((item, index) => {
            const key = `${index}-${item?.type ?? "text"}`;
            switch (item.type) {
                case EntityType.TEXT:
                    return <p key={key} className="whitespace-pre-line">{item.text}</p>;

                case EntityType.HARD_BREAK:
                    return <br key={key} />;

                case EntityType.IMAGE:
                    return <ImageComponent key={key} src={item.attrs?.src ?? item.src} alt={item.attrs?.alt} />;

                case EntityType.BUTTON:
                    return (
                        <Button key={key}>
                            {item.text}
                        </Button>
                    );
                case EntityType.SKILL_MENTION:
                    return (<SkillMentionComponent key={key} label={item?.attrs?.label} />)

                case EntityType.USER_MENTION:
                    return (<UserMentionComponent key={key} label={item?.attrs?.label} />)

                case EntityType.URL:
                    return (<UrlComponent key={key} text={item.text} url={item.url} />)

                case EntityType.POPOVER:
                    return <HoverPopover key={key} item={item} />

                case EntityType.ERROR:
                    return (
                        <Alert key={key} severity="error">
                            {item.text}
                        </Alert>
                    );

                default:
                    return <span key={key}>{typeof item === "string" ? item : (item?.text ?? "")}</span>
            }
        });
    }, [data, message]);

    return (
        <Box
            className={`${base} ${alignRight ? alignEnd : alignStart}`}
        >
            {renderedMessage}
        </Box>
    )
}

export default ChatMessage;
