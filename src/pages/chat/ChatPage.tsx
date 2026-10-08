import { Box, useMediaQuery } from '@mui/material'
import { useMemo, useState } from 'react'
import { translations } from '../../../i18n';
import { useTranslation } from 'react-i18next';
import AiChat from '../../components/Chat/AiChat';
import ComponentTabs from '../../components/componentTabs/ComponentTabs';
import FileManagement from '../../components/fileManagement/FileManagement';
import ChatHistory from '../../components/Chat/ChatHistory/ChatHistory';
import CollapsiblePanel from '../../components/CollapsiblePanel/CollapsiblePanel';

function ChatPage() {
    const { t } = useTranslation()
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [open, setOpen] = useState(true)
    // Below Tailwind's `lg` breakpoint the panel sits under the chat and collapses
    // vertically; at/above it sits beside the chat and collapses horizontally.
    const isDesktop = useMediaQuery('(min-width:1024px)')

    const toggleDrag = (toggle: boolean, e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(toggle);
    }

    const items = useMemo(
        () => [
            {
                label: t(translations.filesPage.files),
                element: <FileManagement isDragging={isDragging} />
            },
            {
                label: t(translations.aiChat.chatHistory),
                element: <ChatHistory />
            }
        ],
        [t, isDragging]
    );

    return (
        <Box
            className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden"
            onDrop={(e) => toggleDrag(false, e)}
            onDragOver={(e) => toggleDrag(true, e)}
            onDragLeave={(e) => toggleDrag(false, e)}
        >
            {/* Chat conversation: on top on small screens, on the right on large screens */}
            <Box className="order-1 lg:order-2 flex flex-1 min-w-0 min-h-0">
                <AiChat />
            </Box>

            {/* Files / chat history panel: reflows below the conversation on small screens */}
            <CollapsiblePanel
                open={open}
                onToggle={() => setOpen(!open)}
                orientation={isDesktop ? 'horizontal' : 'vertical'}
                className="order-2 lg:order-1 w-full lg:w-auto"
            >
                <ComponentTabs items={items} />
            </CollapsiblePanel>
        </Box>
    )
}

export default ChatPage