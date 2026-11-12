import { Alert, Box, Button, Chip, CircularProgress, DialogContentText, Divider, IconButton, Popover, Tooltip, Typography } from '@mui/material'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { dialog } from '../../../components/Dialog/dialogStore'
import { useDeleteEmbeddedDocument } from '../../../api/hooks/tanstack/upload/useDeleteEmbeddedDocument'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { translations } from '../../../../i18n'
import useGetEmbeddedDocumentChunks from '../../../api/hooks/tanstack/upload/useGetEmbeddedDocumentChunks'
import type { EmbeddedDocument } from '../../../api/uploadApi'

// How many vector values to show before the "show all" toggle.
const VECTOR_PREVIEW = 8

function formatVector(values: number[]) {
    return `[${values.map((v) => v.toFixed(4)).join(', ')}]`
}

// A file name in the embedded-documents list. Clicking it opens a popover with
// every stored chunk of that document and its embedding vector.
function EmbeddedDocumentItem({ document }: { document: EmbeddedDocument }) {
    const { t } = useTranslation()
    const [anchor, setAnchor] = useState<HTMLElement | null>(null)
    const open = Boolean(anchor)
    const { data, isLoading, isError } = useGetEmbeddedDocumentChunks(document.document_id, open)

    const { mutateAsync: deleteDocument, isPending: deleting } = useDeleteEmbeddedDocument()

    // Documents stored before filenames were recorded have none; fall back to the id.
    const name = document.filename ?? document.document_id

    const handleDelete = () => {
        dialog.show({
            title: t(translations.uploadPage.deleteTitle),
            content: (
                <DialogContentText>
                    {t(translations.uploadPage.deleteConfirm, { name })}
                </DialogContentText>
            ),
            submitLabel: t(translations.uploadPage.delete),
            submitColor: "error",
            onSubmit: async () => {
                setAnchor(null)
                await deleteDocument(document.document_id)
            },
        })
    }

    return (
        <>
            <Box className="flex items-center gap-1">
                <Button
                    startIcon={<DescriptionOutlinedIcon />}
                    onClick={(e) => setAnchor(e.currentTarget)}
                    className="normal-case! justify-start!"
                >
                    {name}
                </Button>
                <Tooltip title={t(translations.uploadPage.delete)}>
                    <span>
                        <IconButton
                            size="small"
                            onClick={handleDelete}
                            disabled={deleting}
                            aria-label={t(translations.uploadPage.delete)}
                        >
                            {deleting ? <CircularProgress size={16} /> : <DeleteOutlineIcon fontSize="small" />}
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>

            <Popover
                open={open}
                anchorEl={anchor}
                onClose={() => setAnchor(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                slotProps={{ paper: { sx: { width: 640, maxWidth: '90vw', maxHeight: '70vh' } } }}
            >
                <Box className="p-4 flex flex-col gap-3">
                    <Typography variant="subtitle1" className="break-all">{name}</Typography>
                    {data && <MetadataList data={data.document_metadata} />}

                    {isLoading && <CircularProgress size={24} />}
                    {isError && <Alert severity="error">{t(translations.errors.unknownError)}</Alert>}

                    {data?.chunks.map((chunk, i) => (
                        <Box key={chunk.id} className="flex flex-col gap-1">
                            {i > 0 && <Divider className="mb-2!" />}
                            <Box className="flex items-center gap-2">
                                <Typography variant="caption" color="text.secondary">
                                    #{i + 1} · {t(translations.uploadPage.page)} {chunk.page_number || '—'}
                                </Typography>
                                {chunk.kind && <Chip size="small" label={chunk.kind} />}
                            </Box>
                            <Typography variant="body2" className="whitespace-pre-wrap">
                                {chunk.content}
                            </Typography>
                            <MetadataList data={chunk.metadata} />
                            <ChunkVector values={chunk.vector} dim={chunk.vector_dim} />
                        </Box>
                    ))}
                </Box>
            </Popover>
        </>
    )
}

// Keys already shown elsewhere in the popover.
const HIDDEN_METADATA = new Set(['filename', 'file_type', 'document', 'kind'])

// Key/value pairs of a metadata object, as small chips.
function MetadataList({ data }: { data: Record<string, unknown> }) {
    const { t } = useTranslation()
    const entries = Object.entries(data ?? {}).filter(([k]) => !HIDDEN_METADATA.has(k))
    if (entries.length === 0) return null

    return (
        <Box className="flex flex-wrap items-center gap-1">
            <Typography variant="caption" color="text.secondary">
                {t(translations.uploadPage.metadata)}:
            </Typography>
            {entries.map(([k, v]) => (
                <Chip
                    key={k}
                    size="small"
                    variant="outlined"
                    label={`${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`}
                />
            ))}
        </Box>
    )
}

function ChunkVector({ values, dim }: { values: number[]; dim: number }) {
    const { t } = useTranslation()
    const [expanded, setExpanded] = useState(false)
    const shown = expanded ? values : values.slice(0, VECTOR_PREVIEW)

    return (
        <Box className="rounded bg-gray-50 p-2">
            <Typography variant="caption" color="text.secondary">
                {t(translations.uploadPage.embeddingVector)} · {dim}d
            </Typography>
            <Box component="pre" className="m-0 max-h-48 overflow-auto whitespace-pre-wrap break-all text-xs">
                {formatVector(shown)}{!expanded && values.length > VECTOR_PREVIEW ? ' …' : ''}
            </Box>
            {values.length > VECTOR_PREVIEW && (
                <Button size="small" onClick={() => setExpanded((v) => !v)}>
                    {expanded ? t(translations.uploadPage.showLess) : t(translations.uploadPage.showAll)}
                </Button>
            )}
        </Box>
    )
}

export default EmbeddedDocumentItem
