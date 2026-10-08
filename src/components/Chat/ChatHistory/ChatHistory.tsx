import { Box, Button } from '@mui/material'
import useGetSessions, { type ChatSession } from '../../../api/hooks/tanstack/chat/useGetSessions'
import LoadingRows from '../../LoadingRows/LoadingRows'
import SessionCard from '../SessionCard/SessionCard'
import { useChatContext } from '../../../api/context/chatContext/ChatContext'
import { translations } from '../../../../i18n'
import { useTranslation } from 'react-i18next'

export type ChatHistoryProps = {
    // chatItems: ChatResponse[]
    // chatPending: boolean
}

export default function ChatHistory({ }: ChatHistoryProps) {

    const { t } = useTranslation()

    const { data: sessions = [], isLoading, isFetching } = useGetSessions();

    const { startSession } = useChatContext();

    function renderSessions(sessions: ChatSession[]) {

        if (isLoading || isFetching) return <LoadingRows rows={1 * sessions.length} />

        const sessionsData = sessions.map((session) => <SessionCard key={session.id} session={session} />)

        return sessionsData
    }

    return (
        <Box>
            <Button  className='normal-case!' onClick={startSession}>{t(translations.aiChat.newChat)}</Button>
            {renderSessions(sessions)}
        </Box>

    )
}
