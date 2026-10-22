import { Box, Drawer } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AiChat from '../../components/Chat/AiChat';
import ChatHistory from '../../components/Chat/ChatHistory/ChatHistory';

const HISTORY_DRAWER_WIDTH = 300;

function ChatPage() {
    const [historyOpen, setHistoryOpen] = useState(false)
    const { id } = useParams()

    // Close the drawer once a session is opened (the route param changes).
    useEffect(() => {
        setHistoryOpen(false)
    }, [id])

    return (
        <Box className="flex h-screen w-screen overflow-hidden">
            <Box className="flex flex-1 min-w-0 min-h-0">
                <AiChat onOpenHistory={() => setHistoryOpen(true)} />
            </Box>

            {/* Conversation history as a slide-in drawer (replaces the old tabbed side panel). */}
            <Drawer
                anchor="left"
                open={historyOpen}
                onClose={() => setHistoryOpen(false)}
                sx={{ "& .MuiDrawer-paper": { width: HISTORY_DRAWER_WIDTH, boxSizing: "border-box", p: 1 } }}
            >
                <ChatHistory />
            </Drawer>
        </Box>
    )
}

export default ChatPage
