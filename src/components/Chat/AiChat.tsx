import { Box, Button, Grid, IconButton, Switch, Tooltip, } from '@mui/material'
import PsychologyIcon from '@mui/icons-material/Psychology'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import { useEffect, useRef, useState } from 'react'
import StopIcon from '@mui/icons-material/Stop'
import SelectComponent from '../select/SelectComponent'
import StatusDot from '../statusDot/StatusDot'
import AddSkillDialog from '../AddSkill/AddSkillDialog'
import Icon, { IconsEnum } from '../Icons/Icon'
import { useModelSelection } from '../../api/hooks/tanstack/chat/useModelSelection'
import { useChatSession } from '../../api/hooks/tanstack/chat/useChatSession'
import { useChatContext, type ChatResponse } from '../../api/context/chatContext/ChatContext'
import { useParams } from 'react-router-dom'
import ChatContainer from './ChatContainer/ChatContainer'
import MentionContainer from '../MentionContainer/MentionContainer'
import { useChatEditor } from '../../api/hooks/useChatEditor'
import { EditorContent } from '@tiptap/react'
import { MENTION_TYPES, useMentionItems } from '../../api/hooks/useMentionItems'
import { LLM_PROVIDERS } from '../../enums/providers'
import { useTranslation } from 'react-i18next'
import { translations } from '../../../i18n'

export const RoleEnum = {
    AGENT: "assistant",
    USER: "user",
}

export type Role = typeof RoleEnum[keyof typeof RoleEnum];

export type History = Pick<ChatResponse, "role" | "content">

export default function AiChat() {
    const { t } = useTranslation()
    const { editor, clearText, focusInput, getJson, insertContent } = useChatEditor()
    const { items, setSearch, setMentionType, mentionType } = useMentionItems()
    const { changeSession } = useChatContext()

    const {
        provider, setProvider,
        model, setModel,
        thinking, setThinking,
        options, loadingOptions,
        supportsThinking,
        supportsVision,
    } = useModelSelection()

    const [version, setVersion] = useState<"v1" | "v2" | "v3">("v2")
    const [virtualAnchor, setVirtualAnchor] = useState<any>(null)
    const [multiline, setMultiline] = useState(false)
    const singleLineHeightRef = useRef<number | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const firstItemRef = useRef(null)

    const { id } = useParams();

    const {
        chatResponse,
        sendMessage,
        stopChat,
        chatPending,
        isSessionFetching,
        setFile,
        loading
    } = useChatSession(model, provider, thinking, version)

    useEffect(() => {
        if (id && id !== "new") {
            changeSession(id)
        }
    }, [])

    function handleButton(bool: boolean) {
        if (bool) {
            stopChat()
        } else {
            sendMessage(JSON.stringify(getJson().content[0].content))
            clearText()
            focusInput()
        }
    }

    function closeMention() {
        setVirtualAnchor(null);
        setMentionType(null);
        focusInput();
    }


    function handleMention(item: { id: string; label: string, slug: string }) {
        if (!editor) return;

        setVirtualAnchor(null);

        const { from } = editor.state.selection;
        const textBefore = editor.state.doc.textBetween(0, from, "\n");

        const match = textBefore.match(/([@/])(\w*)$/);

        if (!match) return;

        const query = match[2];
        if (mentionType) {
            editor
                .chain()
                .focus()
                .deleteRange({
                    from: from - query.length - 1,
                    to: from,
                })
                .insertContent({
                    type: mentionType, // or whatever your node name is
                    attrs: {
                        id: item.id,
                        label: item.slug,
                    },
                })
                .run();
        }
    }

    useEffect(() => {
        if (!editor) return;

        const openMention = () => {

            const { from } = editor.state.selection;

            const textBefore = editor.state.doc.textBetween(0, from, "\n");

            const match = textBefore.match(/([@/])(\w*)$/);

            if (!match) {
                setMentionType(null);
                setVirtualAnchor(null);
                return;
            }

            const trigger = match[1];
            const query = match[2];

            setSearch(query)

            setMentionType(trigger === "@" ? MENTION_TYPES.USERS : MENTION_TYPES.SKILLS);

            if (match) {
                const coords = editor.view.coordsAtPos(from);

                setVirtualAnchor({
                    getBoundingClientRect: () => ({
                        x: coords.left,
                        y: coords.bottom,
                        top: coords.bottom,
                        left: coords.left,
                        right: coords.left,
                        bottom: coords.bottom,
                        width: 0,
                        height: 0,
                    }),
                });
            } else {
                setVirtualAnchor(null);
            }
        };

        editor.on("update", openMention);

        return () => {
            editor.off("update", openMention);
        };
    }, [editor])

    // While the mention popover is open, ArrowUp moves focus from the editor
    // into the list (the popover is rendered above the input).
    useEffect(() => {
        if (!editor) return;

        const dom = editor.view.dom;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (!virtualAnchor) return;

            if (event.key === "ArrowUp") {
                event.preventDefault();
                (firstItemRef.current as HTMLElement | null)?.focus();
            } else if (event.key === "Escape") {
                event.preventDefault();
                closeMention();
            }
        };

        dom.addEventListener("keydown", handleKeyDown);

        return () => {
            dom.removeEventListener("keydown", handleKeyDown);
        };
    }, [editor, virtualAnchor])

    // Reflow the composer once the editor grows past a single line: the content
    // moves to its own row on top and the controls drop to a bottom bar.
    useEffect(() => {
        if (!editor) return;

        const dom = editor.view.dom as HTMLElement;

        const check = () => {
            if (singleLineHeightRef.current == null && dom.clientHeight > 0) {
                singleLineHeightRef.current = dom.clientHeight;
            }
            const baseline = singleLineHeightRef.current ?? dom.clientHeight;
            setMultiline(dom.clientHeight > baseline + 5);
        };

        check();
        const observer = new ResizeObserver(check);
        observer.observe(dom);
        return () => observer.disconnect();
    }, [editor])


    console.log(chatResponse)
    return (
        <Box className='flex-1 min-w-0 flex flex-col bg-white border-l border-[#ECEAE4] p-10 h-full'>
            <Box className="flex items-center gap-4">
                <SelectComponent
                    onChange={setProvider}
                    value={provider}
                    options={LLM_PROVIDERS.map((p) => ({ id: p.id, name: p.name }))}
                    isLoading={false}
                />
                <StatusDot
                    model={model}
                    provider={provider}
                />
                <AddSkillDialog />

            </Box>
            <Box className="relative flex-1 min-h-0 flex flex-col pb-15">
            <ChatContainer
                chatItems={chatResponse}
                chatPending={loading}
                sessionFetching={isSessionFetching}
            />
            <Box className="absolute bottom-0 left-0 right-0">
            <Grid className={`shrink-0 flex gap-1 min-w-0 rounded-2xl ring-1 ring-[#ECEAE4] bg-white px-2 py-1 ${multiline ? "flex-wrap items-center" : "items-end"}`}>
                <Box className={`flex items-center gap-1 shrink-0 ${multiline ? "order-2" : ""}`}>
                    <SelectComponent
                        className="shrink-0"
                        variant="standard"
                        disableUnderline
                        loadingSize={24}
                        onChange={setModel}
                        value={model}
                        options={options}
                        isLoading={loadingOptions}
                        renderValue={(value) => (
                            <Tooltip title={options.find((o) => o.id === value)?.name ?? t(translations.aiChat.selectModel)}>
                                <span className="flex items-center">
                                    <Icon iconName={IconsEnum.ROBOT} size={24} />
                                </span>
                            </Tooltip>
                        )}
                        label={(option) => (
                            <Box className="flex items-center gap-2 min-w-0">
                                {option.thinking && (
                                    <Tooltip title={t(translations.aiChat.thinkingTooltip)}>
                                        <PsychologyIcon fontSize="small" color="primary" className="shrink-0" />
                                    </Tooltip>
                                )}
                                {option.vision && (
                                    <Tooltip title={t(translations.aiChat.vision)}>
                                        <VisibilityIcon fontSize="small" color="action" className="shrink-0" />
                                    </Tooltip>
                                )}
                                <span className="truncate">{option.name}</span>
                            </Box>
                        )}
                    />
                    <SelectComponent<"v1" | "v2" | "v3">
                        className="shrink-0"
                        variant="standard"
                        disableUnderline
                        onChange={setVersion}
                        value={version}
                        options={[{ id: "v1", name: "v1" }, { id: "v2", name: "v2" }, { id: "v3", name: "v3" }]}
                        isLoading={false}
                        renderValue={(v) => (
                            <Tooltip title="Endpoint version">
                                <span className="px-1 text-sm font-medium">{v.toUpperCase()}</span>
                            </Tooltip>
                        )}
                    />
                    <Tooltip title={supportsThinking ? t(translations.aiChat.thinkingTooltip) : t(translations.aiChat.thinkingNotSupported)}>
                        <span className="shrink-0">
                            <Switch
                                checked={thinking}
                                onChange={(e) => setThinking(e.target.checked)}
                                disabled={!supportsThinking}
                            />
                        </span>
                    </Tooltip>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                            const selected = e.target.files?.[0];
                            if (selected) {
                                setFile(selected);
                                const reader = new FileReader();
                                reader.onload = () => {
                                    insertContent({
                                        type: "image",
                                        attrs: { src: reader.result as string, alt: selected.name },
                                    });
                                    focusInput();
                                };
                                reader.readAsDataURL(selected);
                            }
                            e.target.value = "";
                        }}
                    />
                    <Tooltip title={supportsVision ? t(translations.aiChat.attachImage) : t(translations.aiChat.visionNotSupported)}>
                        <span className="shrink-0">
                            <IconButton
                                size="small"
                                disabled={!supportsVision}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <AttachFileIcon fontSize="small" />
                            </IconButton>
                        </span>
                    </Tooltip>
                </Box>
                <Box className={`flex items-center min-w-0 ${multiline ? "order-first w-full" : "flex-1"}`}>
                    <MentionContainer
                        anchor={virtualAnchor}
                        items={items}
                        onSelect={(item) => handleMention(item)}
                        firstItemRef={firstItemRef}
                        onEscape={closeMention}
                    />
                    <EditorContent ref={editorRef} className="flex-1 min-w-0" editor={editor} />
                </Box>
                <Box className={`shrink-0 ${multiline ? "order-3 ml-auto" : ""}`}>
                    <Button onClick={() => handleButton(chatPending)}>
                        {chatPending
                            ? <StopIcon className="mx-1" />
                            : <Icon iconName={IconsEnum.ARROW} className="mx-1" />}
                    </Button>
                </Box>
            </Grid>
            </Box>
            </Box>
        </Box>
    )
}



