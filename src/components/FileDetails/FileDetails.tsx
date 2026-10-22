import { useState } from 'react'
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    LinearProgress,
    Stack,
    Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import useGetFile from '../../api/hooks/tanstack/files/useGetFile';
import useGetFileChunks from '../../api/hooks/tanstack/files/useGetFileChunks';
import Icon, { IconsEnum } from '../Icons/Icon';
import LoadingRows from '../LoadingRows/LoadingRows';
import type { File } from '../../api/hooks/tanstack/files/useGetFiles';
import { translations } from '../../../i18n';

type FileProps = {
    file: File
}

function formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds}s`
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return s ? `${m}m ${s}s` : `${m}m`
}

function EmbeddingStatus({ file }: FileProps) {
    const { t } = useTranslation()

    if (file.status === 'done') return null

    if (file.status === 'failed') {
        return (
            <Typography variant="caption" color="error" title={file.error ?? undefined}>
                {t(translations.filesPage.statusFailed)}
            </Typography>
        )
    }

    // pending = queued (no totals yet) → indeterminate; processing → determinate.
    const isProcessing = file.status === 'processing' && file.chunks_total > 0
    const pct = isProcessing ? Math.round((file.chunks_done / file.chunks_total) * 100) : 0
    const eta = isProcessing && file.eta_seconds != null
        ? t(translations.filesPage.etaLeft, { value: formatDuration(file.eta_seconds) })
        : null

    return (
        <Box className="mt-1">
            <Stack direction="row" className="justify-between">
                <Typography variant="caption" color="text.secondary">
                    {t(translations.filesPage.statusProcessing)}
                    {eta ? ` · ${eta}` : ''}
                </Typography>
                {isProcessing && (
                    <Typography variant="caption" color="text.secondary">
                        {pct}% ({file.chunks_done}/{file.chunks_total})
                    </Typography>
                )}
            </Stack>
            <LinearProgress
                variant={isProcessing ? 'determinate' : 'indeterminate'}
                value={pct}
            />
        </Box>
    )
}

function ChunksDialog({ file, open, onClose }: FileProps & { open: boolean; onClose: () => void }) {
    const { t } = useTranslation()
    const { data: chunks = [], isLoading, isFetching } = useGetFileChunks(file.id, open)

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle className="truncate">{file.file_name}</DialogTitle>
            <DialogContent dividers>
                {isLoading || isFetching ? (
                    <LoadingRows rows={4} />
                ) : chunks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                        {t(translations.filesPage.noChunks)}
                    </p>
                ) : (
                    <Stack direction="column" className="gap-2">
                        {chunks.map((chunk) => (
                            <Box
                                key={chunk.id}
                                className="rounded-2xl p-3 bg-[#FAF9F6] ring-1 ring-[#ECEAE4]"
                            >
                                {chunk.page_number != null && (
                                    <Chip size="small" variant="outlined" label={`p. ${chunk.page_number}`} className="mb-1" />
                                )}
                                <Typography variant="body2" className="whitespace-pre-wrap break-words">
                                    {chunk.content}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default function FileDetails({ file }: FileProps) {

    const { mutateAsync: getFile } = useGetFile();
    const [open, setOpen] = useState(false)
    const size = (file.file_size / 1000000).toFixed(2)
    const isImage = file.file_type?.startsWith("image/")

    return (
        <>
            <Stack
                direction="row"
                className="items-center rounded-2xl p-1.5 bg-[#FAF9F6] ring-1 ring-[#ECEAE4] m-2 cursor-pointer hover:ring-[#d9d6cc]"
                onClick={() => setOpen(true)}
            >
                <Icon iconName={isImage ? IconsEnum.IMAGE : IconsEnum.PDF} size={60} />
                <Box className="min-w-0 flex-1">
                    <Box className="max-w-40 truncate" title={file.file_name}>
                        {file.file_name}
                    </Box>
                    <Stack direction="row">
                        <Box className="border-r-2 border-[#ECEAE4] pr-2 mr-2">{size} MB</Box>
                        <Box>{file.created_at.toString()}</Box>
                    </Stack>
                    <EmbeddingStatus file={file} />
                </Box>

                <Button
                    onClick={(e) => {
                        e.stopPropagation()
                        getFile({ id: file.id, filename: file.file_name })
                    }}
                >
                    <Icon iconName={IconsEnum.DOWNLOAD} />
                </Button>
            </Stack>

            <ChunksDialog file={file} open={open} onClose={() => setOpen(false)} />
        </>
    )
}
