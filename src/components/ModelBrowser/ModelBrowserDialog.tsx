import { useEffect, useRef, useState } from 'react'
import {
    Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle,
    IconButton, List, ListItem, TextField, Tooltip, Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getPullStatus, pullModel, searchHfModels, type PullStatus } from '../../api/chatApi'
import { queryKeys } from '../../enums/queryKeys'
import type { LlmProvider } from '../../enums/providers'

type Props = {
    open: boolean
    onClose: () => void
    provider: LlmProvider
    onInstalled: (modelId: string) => void
}

// How often to poll the backend for a pull's status. The backend reports a
// coarse downloading/ready/error (no %), so a slow-ish poll is plenty.
const POLL_MS = 2500

type ActivePull = ({ model: string } & PullStatus) | null

export default function ModelBrowserDialog({ open, onClose, provider, onInstalled }: Props) {
    const queryClient = useQueryClient()
    const [search, setSearch] = useState('')
    const [query, setQuery] = useState('')
    // One active pull tracked at a time, keyed by model id.
    const [pull, setPull] = useState<ActivePull>(null)
    const pollRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Debounce the search box so we don't hit HF on every keystroke.
    useEffect(() => {
        const t = setTimeout(() => setQuery(search.trim()), 400)
        return () => clearTimeout(t)
    }, [search])

    const { data: results = [], isFetching } = useQuery({
        queryKey: queryKeys.hfModels(query),
        queryFn: () => searchHfModels(query),
        enabled: open && provider === 'mlx',
    })

    // Stop polling on unmount.
    useEffect(() => () => { if (pollRef.current) clearTimeout(pollRef.current) }, [])

    // Stop polling when the dialog closes.
    useEffect(() => {
        if (!open && pollRef.current) {
            clearTimeout(pollRef.current)
            pollRef.current = null
        }
    }, [open])

    const poll = (model: string) => {
        pollRef.current = setTimeout(async () => {
            try {
                const status = await getPullStatus(model)
                setPull({ model, ...status })
                if (status.status === 'downloading') {
                    poll(model)
                } else if (status.status === 'ready') {
                    // New model is in the MLX cache — refresh the chat model list.
                    queryClient.invalidateQueries({ queryKey: queryKeys.models(provider) })
                    onInstalled(model)
                }
            } catch (e) {
                setPull({ model, status: 'error', error: String(e) })
            }
        }, POLL_MS)
    }

    const handlePull = async (model: string) => {
        if (pollRef.current) clearTimeout(pollRef.current)
        setPull({ model, status: 'downloading', error: null })
        try {
            await pullModel(model)
            poll(model)
        } catch (e) {
            setPull({ model, status: 'error', error: String(e) })
        }
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle className="flex items-center justify-between">
                <span>Browse MLX models</span>
                <IconButton size="small" onClick={onClose} aria-label="Close">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {provider !== 'mlx' ? (
                    <Typography variant="body2" color="text.secondary">
                        Model download is only available for the MLX provider.
                    </Typography>
                ) : (
                    <>
                        <TextField
                            fullWidth size="small" autoFocus
                            placeholder="Search Hugging Face (mlx-community)…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Box className="mt-3 h-[320px] overflow-y-auto">
                            {isFetching ? (
                                <Box className="flex justify-center py-6"><CircularProgress size={28} /></Box>
                            ) : results.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" className="py-4 block">
                                    No models found.
                                </Typography>
                            ) : (
                                <List dense>
                                    {results.map((m) => {
                                        const active = pull?.model === m.id
                                        const downloading = active && pull?.status === 'downloading'
                                        const ready = active && pull?.status === 'ready'
                                        const errored = active && pull?.status === 'error'
                                        return (
                                            <ListItem
                                                key={m.id}
                                                secondaryAction={
                                                    ready ? (
                                                        <Tooltip title="Installed">
                                                            <CheckCircleIcon color="success" fontSize="small" />
                                                        </Tooltip>
                                                    ) : (
                                                        <Button
                                                            size="small"
                                                            startIcon={downloading ? <CircularProgress size={14} /> : <CloudDownloadIcon fontSize="small" />}
                                                            disabled={downloading}
                                                            onClick={() => handlePull(m.id)}
                                                        >
                                                            {downloading ? 'Pulling…' : 'Download'}
                                                        </Button>
                                                    )
                                                }
                                            >
                                                <Box className="min-w-0 pr-2">
                                                    <Typography variant="body2" className="truncate">{m.id}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        ↓ {m.downloads.toLocaleString()} · ♥ {m.likes}
                                                        {errored ? ` · error: ${pull?.error ?? ''}` : ''}
                                                    </Typography>
                                                </Box>
                                            </ListItem>
                                        )
                                    })}
                                </List>
                            )}
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                            Downloads land on the machine running mlx_lm.server. Large models can take a while.
                        </Typography>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
