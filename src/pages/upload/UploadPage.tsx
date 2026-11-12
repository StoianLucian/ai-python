import { Box, Button, CircularProgress, LinearProgress, Paper, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { translations } from '../../../i18n'
import { useUpload } from '../../api/hooks/tanstack/upload/useUpload'
import useGetEmbeddedDocuments from '../../api/hooks/tanstack/upload/useGetEmbeddedDocuments'
import EmbeddedDocumentItem from './components/EmbeddedDocumentItem'
import type { UploadResponse } from '../../api/uploadApi'

// Formats a byte count into a human-readable string (B / KB / MB).
function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// Standalone page for a single-file upload forwarded to the external upload
// service (POST /upload/). Shows the service's response on success.
function UploadPage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const inputRef = useRef<HTMLInputElement>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [result, setResult] = useState<UploadResponse | null>(null)

    const { mutateAsync: upload, isPending, uploadProgress } = useUpload()
    const { data: documents = [], isLoading: loadingDocuments } = useGetEmbeddedDocuments()

    const handleFile = async (file: File) => {
        setResult(null)
        const response = await upload(file)
        setResult(response)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
        // Reset so selecting the same file again still fires onChange.
        e.target.value = ''
    }

    const toggleDrag = (toggle: boolean, e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsDragging(toggle)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        toggleDrag(false, e)
        const file = e.dataTransfer.files?.[0]
        if (file) handleFile(file)
    }

    return (
        <Box className="h-screen w-screen overflow-y-auto bg-white">
            <Box className="mx-auto max-w-3xl p-6 flex flex-col gap-4">
                <Box className="flex items-center gap-3">
                    <Button
                        startIcon={<ArrowBackIcon />}
                        className="normal-case!"
                        onClick={() => navigate(-1)}
                    >
                        {t(translations.uploadPage.back)}
                    </Button>
                    <Typography variant="h5">{t(translations.uploadPage.title)}</Typography>
                </Box>

                <Box
                    onDrop={handleDrop}
                    onDragOver={(e) => toggleDrag(true, e)}
                    onDragLeave={(e) => toggleDrag(false, e)}
                    className={`
                        h-60
                        transition-all duration-200
                        ${isDragging ? 'bg-blue-50 border-blue-400' : ''}
                        border-2 border-dashed rounded-lg
                        flex justify-center items-center
                        flex-col gap-2`}
                >
                    {isPending ? (
                        <Box className="w-2/3 flex flex-col items-center gap-2">
                            <Typography variant="caption" color="text.secondary">
                                {uploadProgress < 100
                                    ? t(translations.uploadPage.uploading, { percent: uploadProgress })
                                    : t(translations.uploadPage.embedding)}
                            </Typography>
                            <Box className="w-full">
                                {/* Bytes sent -> determinate; then the server embeds -> indeterminate. */}
                                <LinearProgress
                                    variant={uploadProgress < 100 ? "determinate" : "indeterminate"}
                                    value={uploadProgress}
                                />
                            </Box>
                        </Box>
                    ) : (
                        <>
                            <CloudUploadIcon sx={{ fontSize: 80 }} color="action" />
                            <Typography color="text.secondary">
                                {t(translations.uploadPage.dragFile)}
                            </Typography>
                            <input
                                ref={inputRef}
                                type="file"
                                className="hidden"
                                onChange={handleInputChange}
                            />
                            <Button variant="outlined" onClick={() => inputRef.current?.click()}>
                                {t(translations.uploadPage.chooseFile)}
                            </Button>
                        </>
                    )}
                </Box>

                {result && (
                    <Paper variant="outlined" className="p-4 flex flex-col gap-1">
                        <Typography variant="subtitle1">
                            {t(translations.uploadPage.uploaded)}
                        </Typography>
                        <Typography variant="body2">
                            {t(translations.uploadPage.filename)}: {result.filename}
                        </Typography>
                        <Typography variant="body2">
                            {t(translations.uploadPage.contentType)}: {result.content_type ?? '—'}
                        </Typography>
                        <Typography variant="body2">
                            {t(translations.uploadPage.size)}: {formatBytes(result.size_bytes)}
                        </Typography>
                        <Typography variant="body2">
                            {t(translations.uploadPage.documentId)}: <code>{result.document_id ?? '—'}</code>
                        </Typography>
                        <Typography variant="body2">
                            {t(translations.uploadPage.textChunks)}: {result.text_chunks}
                        </Typography>
                        {result.text && (
                            <Box className="mt-2 flex flex-col gap-1">
                                <Typography variant="subtitle2">
                                    {t(translations.uploadPage.extractedText)}
                                </Typography>
                                <Box
                                    component="pre"
                                    className="max-h-96 overflow-auto whitespace-pre-wrap rounded bg-gray-50 p-3 text-xs"
                                >
                                    {result.text}
                                </Box>
                            </Box>
                        )}
                    </Paper>
                )}

                {/* Persisted list from the vector store — survives refresh. */}
                <Paper variant="outlined" className="p-4 flex flex-col gap-2">
                    <Typography variant="subtitle1">
                        {t(translations.uploadPage.embeddedDocuments)}
                    </Typography>
                    {loadingDocuments ? (
                        <CircularProgress size={24} />
                    ) : documents.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            {t(translations.uploadPage.noEmbeddedDocuments)}
                        </Typography>
                    ) : (
                        <Box className="flex flex-col items-start">
                            {documents.map((d) => (
                                <EmbeddedDocumentItem key={d.document_id} document={d} />
                            ))}
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    )
}

export default UploadPage
