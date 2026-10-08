import { Alert, Box, Button } from '@mui/material'
import HoverPopover from '../../HoverPopover/HoverPopover'
import { EntityType } from '../../../types/chat';
import { jsonrepair } from "jsonrepair";
import { useMemo, useRef } from 'react';
import { SkillMentionComponent } from '../../ChatEditor/components/SkillMention';
import { UserMentionComponent } from '../../ChatEditor/components/UserMention';
import { UrlComponent } from '../../ChatEditor/components/Url';
import { ImageComponent } from '../../ChatEditor/components/Image';


type ChatMessageProps = {
    message: string;
    alignRight: boolean;
    isStreaming?: boolean;
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

        return safeParseJson(cleaned);
    }

    const lastValidData = useRef<any[] | null>(null);

    const data = useMemo<any[]>(() => {
        const cleaned = parseLLMJson(message);

        if (cleaned) {
            const next = Array.isArray(cleaned) ? cleaned : [cleaned];
            lastValidData.current = next;
            return next;
        }

        if (isStreaming) {
            return lastValidData.current ?? [];
        }

        return [
            {
                type: "text",
                text: message,
            },
        ];
    }, [message, isStreaming]);

    const renderedMessage = useMemo(() => {

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
    }, [data]);

    const base =
        "flex flex-col gap-1.5 px-4 py-3 text-[15px] leading-relaxed break-words rounded-3xl"
    const alignEnd = "bg-[#5B8C7B] text-white self-end rounded-tr-md"
    const alignStart =
        "bg-white text-[#1F2933] self-start rounded-tl-md shadow-sm ring-1 ring-[#ECEAE4]"

    return (
        <Box
            className={`${base} ${alignRight ? alignEnd : alignStart}`}
        >
            {renderedMessage}
        </Box>
    )
}

export default ChatMessage;
