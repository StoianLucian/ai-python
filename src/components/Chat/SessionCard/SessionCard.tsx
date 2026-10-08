import { Stack, Button, Box } from "@mui/material";
import type { ChatSession } from "../../../api/hooks/tanstack/chat/useGetSessions";
import { useDeleteSession } from "../../../api/hooks/tanstack/chat/useDeleteSession";
import Icon, { IconsEnum } from "../../Icons/Icon";
import { useChatContext } from "../../../api/context/chatContext/ChatContext";
import Popover from "../../Popover/Popover";
import { useParams } from "react-router-dom";
import InputComponent, { InputComponentVariantsEnum } from "../../inputComponent/InputComponent";
import { useEffect, useRef, useState } from "react";
import { useSetSessionTitle } from "../../../api/hooks/tanstack/chat/useSetSessionTitle";
import { keyboardShortcuts } from "../../inputComponent/helper";
import { useTranslation } from "react-i18next";
import { translations } from "../../../../i18n";

type SessionCardProps = {
    session: ChatSession
}

export default function SessionCard({ session }: SessionCardProps) {
    const { t } = useTranslation();
    const { title, id } = session
    const { mutateAsync: deleteSession } = useDeleteSession(id)
    const { mutateAsync: changeSessionTitle } = useSetSessionTitle();
    const { changeSession } = useChatContext();
    const { id: sessionId } = useParams();
    const [sessionTitle, setSessionTitle] = useState(title);
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleChangeSession() {
        if (id == sessionId) return;
        changeSession(id);
    }

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing])

    async function handleChangeSessionTitle() {
        await changeSessionTitle({ id, title: sessionTitle });
        setIsEditing(false);
    }


    return (
        <Stack direction="row" className="items-center rounded-2xl p-2 bg-[#FAF9F6] ring-1 ring-[#ECEAE4] flex justify-between gap-2 my-2.5">
            {isEditing ?
                <InputComponent
                    inputRef={inputRef}
                    hotKey={keyboardShortcuts.submit}
                    onKeyDown={handleChangeSessionTitle}
                    value={sessionTitle}
                    onChange={(newValue) => setSessionTitle(newValue)}
                    variant={InputComponentVariantsEnum.OUTLINE}
                    onBlur={() => { setIsEditing(false) }}
                />
                :
                <>
                    <Button
                        variant="text"
                        className="w-75"
                        onClick={handleChangeSession}
                        onDoubleClick={() => { setIsEditing(true) }}
                    >
                        <span className="block truncate w-full">
                            {title}
                        </span>
                    </Button>
                    <Box>
                        <Popover trigger={<Icon iconName={IconsEnum.DOTS} />}
                            items={[
                                {
                                    label: t(translations.aiChat.deleteSession),
                                    onClick: async () => { await deleteSession(id) }
                                }
                            ]}
                        />
                    </Box>
                </>
            }
        </Stack>
    )
}
