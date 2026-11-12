import { Alert, Box, Button } from '@mui/material'
import FilePreview from '../../FilePreview/FilePreview'
import { EntityType, type Entity } from '../../../types/chat';
import { jsonrepair } from "jsonrepair";
import { useMemo, useRef, type ReactElement, type ReactNode } from 'react';
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

// The assistant replies in Markdown. Components are written as ordinary Markdown
// links whose URL uses a custom scheme; the `a` renderer maps each scheme to a
// React component:
//
//   [Label](popover:<file_id>:<page>[:<quote>])  -> FilePreview
//   [Label](button:<action>)                     -> Button
//   [@Name](user:<user_id>)                      -> UserMentionComponent
//   [/name](skill:<skill_name>)                  -> SkillMentionComponent
//   [Label](https://...)                         -> UrlComponent
//   ![alt](https://...)                          -> ImageComponent
//
// Errors are a fenced code block with the `error` language:
//
//   ```error
//   Something went wrong.
//   ```                                          -> Alert severity="error"
//
// To add a component: add its scheme to COMPONENT_SCHEMES and a case in `a`.
const COMPONENT_SCHEMES = ["popover:", "source:", "button:", "user:", "skill:"];

// Legacy citation marker: [[source:<file_id>:<page>|<quote>]] (quote optional).
// Rewritten to the link form above so it goes through the same renderer.
const SOURCE_MARKER = /\[\[source:([^:|\]]+):([^:|\]]+)(?:\|([^\]]*))?\]\]/g;

// Flatten react-markdown children to plain text.
function childrenToText(children: ReactNode): string {
    if (children == null || typeof children === "boolean") return "";
    if (typeof children === "string" || typeof children === "number") return String(children);
    if (Array.isArray(children)) return children.map(childrenToText).join("");
    if (typeof children === "object" && "props" in children) {
        return childrenToText((children as ReactElement<{ children?: ReactNode }>).props.children);
    }
    return "";
}

// Split "scheme:a:b:rest..." into [scheme, a, b, rest] — the last part keeps any
// further ":" (quotes and actions may contain them once decoded).
function splitScheme(href: string, parts: number): string[] {
    const all = href.split(":");
    return [...all.slice(0, parts - 1), all.slice(parts - 1).join(":")];
}

function renderLink(href: string | undefined, children: ReactNode) {
    const label = childrenToText(children);
    const scheme = href?.split(":", 1)[0];

    switch (scheme) {
        case "popover":
        case "source": {
            const [, id, page, quote] = splitScheme(href!, 4);
            const item: Entity = {
                type: EntityType.POPOVER,
                text: label || "source",
                source_id: id,
                page_number: page,
                // Verbatim quote to highlight in the PDF (optional).
                content: quote ? decodeURIComponent(quote) : undefined,
            };
            return <FilePreview item={item} />;
        }
        case "button": {
            const [, action] = splitScheme(href!, 2);
            // TODO: map `action` to real behavior (keep it to a fixed allowlist).
            return (
                <Button size="small" variant="outlined" onClick={() => console.log("[chat button]", action)}>
                    {label}
                </Button>
            );
        }
        case "user":
            return <UserMentionComponent label={label.replace(/^@/, "")} />;
        case "skill":
            return <SkillMentionComponent label={label.replace(/^\//, "")} />;
        default:
            if (!href) return <>{children}</>;
            return <UrlComponent text={label || href} url={href} />;
    }
}

function MarkdownMessage({ text }: { text: string }) {
    const withLinks = text.replace(
        SOURCE_MARKER,
        (_m, id, page, quote) => `[source](popover:${id}:${page}:${encodeURIComponent(quote ?? "")})`
    );

    return (
        <Box className="chat-markdown whitespace-normal break-words">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                // Keep default URL sanitizing, but let our component schemes
                // through (react-markdown strips unknown schemes by default).
                urlTransform={(url) =>
                    COMPONENT_SCHEMES.some((s) => url.startsWith(s)) ? url : defaultUrlTransform(url)
                }
                components={{
                    a({ href, children }) {
                        return renderLink(href, children);
                    },
                    img({ src, alt }) {
                        return <ImageComponent src={typeof src === "string" ? src : ""} alt={alt ?? ""} />;
                    },
                    // Fenced ```error blocks render as an error Alert; other code
                    // blocks render normally.
                    pre({ children }) {
                        const code = Array.isArray(children) ? children[0] : children;
                        const className =
                            (code as ReactElement<{ className?: string }> | undefined)?.props?.className ?? "";
                        if (className.includes("language-error")) {
                            return <Alert severity="error">{childrenToText(children).trim()}</Alert>;
                        }
                        return <pre>{children}</pre>;
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
                    return <FilePreview key={key} item={item} />

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
