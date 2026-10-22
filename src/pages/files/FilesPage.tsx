import { Box, Button, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'
import { translations } from '../../../i18n'
import { queryKeys } from '../../enums/queryKeys'
import useGetFiles from '../../api/hooks/tanstack/files/useGetFiles'
import FileManagement from '../../components/fileManagement/FileManagement'

// Standalone upload page: full-width file management, no conversation sidebar.
// A back button returns to the previous view (the chat the user came from).
function FilesPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [isDragging, setIsDragging] = useState<boolean>(false)

    // Chunks only exist once a file finishes embedding in the background. The
    // files query polls while anything is busy; when it settles from busy → idle
    // we refetch the chunks so newly-embedded content shows up.
    const { data: files = [] } = useGetFiles()
    const busy = files.some((f) => f.status === 'pending' || f.status === 'processing')
    const wasBusy = useRef(false)
    useEffect(() => {
        if (wasBusy.current && !busy) {
            queryClient.invalidateQueries({ queryKey: queryKeys.chunks })
        }
        wasBusy.current = busy
    }, [busy, queryClient])

    const toggleDrag = (toggle: boolean, e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(toggle)
    }

    return (
        <Box
            className="h-screen w-screen overflow-y-auto bg-white"
            onDrop={(e) => toggleDrag(false, e)}
            onDragOver={(e) => toggleDrag(true, e)}
            onDragLeave={(e) => toggleDrag(false, e)}
        >
            <Box className="mx-auto max-w-3xl p-6 flex flex-col gap-4">
                <Box className="flex items-center gap-3">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        className="normal-case!"
                        onClick={() => navigate(-1)}
                    >
                        {t(translations.filesPage.backToChat)}
                    </Button>
                    <Typography variant="h5">{t(translations.filesPage.title)}</Typography>
                </Box>
                <FileManagement isDragging={isDragging} />
            </Box>
        </Box>
    )
}

export default FilesPage
