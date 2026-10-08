import { Box, CircularProgress, Stack } from '@mui/material'
import CollapsableContainer from '../../CollapsableContainer/CollapsableContainer'
import { useTranslation } from 'react-i18next'
import { translations } from '../../../../i18n'
import { RoleEnum } from '../AiChat'
import type { ChatResponse } from '../../../api/context/chatContext/ChatContext'
import ChatMessage from '../ChatMessage/ChatMessage'

export type AiChatBoxProps = {
    chatItems: ChatResponse[]
    chatPending: boolean
    sessionFetching?: boolean
}

export default function ChatContainer({ chatItems, chatPending, sessionFetching }: AiChatBoxProps) {
    const { t } = useTranslation()

    return (
        <Box className="flex-1 min-h-0 overflow-y-auto bg-[#FAF9F6] ring-1 ring-[#ECEAE4] rounded-2xl my-4 p-6 flex flex-col gap-4">
            {sessionFetching ? (
                <CircularProgress />
            ) : (
                chatItems.map((chatItem, i) => {
                    const isUser = chatItem.role === RoleEnum.USER
                    const isStreaming = chatPending && !isUser && i === chatItems.length - 1

                    const test = { type: "text", text: chatItem.thinking}


                    return (
                        <Stack
                            key={i}
                            className={`max-w-[72%] gap-1.5 ${isUser
                                ? "self-end"
                                : "self-start"
                                }`}
                        >
                            {!isUser && chatItem.thinking && (
                                <CollapsableContainer
                                    loadingText={t(translations.aiChat.thinking)}
                                    isLoading={chatItem?.isThinking}
                                >
                                    <ChatMessage
                                        message={JSON.stringify(test)}
                                        alignRight={isUser}
                                    />
                                </CollapsableContainer>
                            )}

                            <ChatMessage
                                message={chatItem.content}
                                alignRight={isUser}
                                isStreaming={isStreaming}
                            />
                        </Stack>
                    )
                })
            )}
            <Box className="flex justify-center" >
                {chatPending && <CircularProgress />}
            </Box>
        </Box>
    )
}
