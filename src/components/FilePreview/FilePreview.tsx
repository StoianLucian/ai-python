import { Badge, Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, Tooltip } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DownloadIcon from "@mui/icons-material/Download";
import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import usePreviewFile from "../../api/hooks/tanstack/files/usePreviewFile";
import useFileAccessible from "../../api/hooks/tanstack/files/useFileAccessible";
import type { Entity } from "../../types/chat";
import PdfPreview from "../PdfPreview/PdfPreview";
import { translations } from "../../../i18n";

export default function FilePreview({ item }: { item: Entity }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    console.log(item)
    const { data: files = "", isFetching } = usePreviewFile(item.source_id!, open)
    // isLoading (not isPending) so a disabled/idle query — e.g. a popover with no
    // numeric source_id — doesn't leave the spinner stuck forever.
    const { data: accessible, isLoading: checking, isError } = useFileAccessible(item.source_id ?? "");
    // Red X when the probe failed (network/auth) or the file is reported missing.
    const inaccessible = isError || accessible === false;

    // Accessibility status shown as a small badge on the file icon and in the
    // tooltip: spinner while probing, red X when missing/unreachable, green
    // check when the file can be opened.
    const status = checking ? "checking" : inaccessible ? "unavailable" : accessible ? "available" : null;

    const statusLabel = {
        checking: t(translations.filesPage.fileChecking),
        available: t(translations.filesPage.fileAvailable),
        unavailable: t(translations.filesPage.fileUnavailable),
    };

    function statusBadge() {
        switch (status) {
            case "checking":
                return <CircularProgress size={10} thickness={6} />;
            case "available":
                return <CheckCircleIcon sx={{ fontSize: 12, color: "success.main" }} />;
            case "unavailable":
                return <CancelIcon sx={{ fontSize: 12, color: "error.main" }} />;
            default:
                return null;
        }
    }

    const tooltip = status ? `${item.text} · ${statusLabel[status]}` : item.text;

    const pdfUrl = useMemo(() => {
        if (!files) return null;
        return URL.createObjectURL(files);
    }, [files]);

    // The download route serves the stored content-type, so the blob tells us
    // whether this source is an image (show/download it) or a PDF (preview it).
    const isImage = typeof files !== "string" && files.type?.startsWith("image/");

    useEffect(() => {
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [pdfUrl]);

    return (
        <>
            {/* Tooltip needs a non-disabled wrapper to show on a disabled button. */}
            <Tooltip title={tooltip}>
                <span>
                    <IconButton
                        size="small"
                        onClick={() => setOpen(true)}
                        disabled={inaccessible}
                        aria-label={tooltip}
                    >
                        <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                            badgeContent={statusBadge()}
                            // White backing so the status icon stays legible over the file icon.
                            sx={{ "& .MuiBadge-badge": { p: 0, minWidth: 0, height: "auto", bgcolor: "background.paper", borderRadius: "50%" } }}
                        >
                            <FileIcon
                                fontSize="small"
                                sx={{ color: inaccessible ? "text.disabled" : "primary.main" }}
                            />
                        </Badge>
                    </IconButton>
                </span>
            </Tooltip>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                maxWidth={false}
                slotProps={{
                    paper: {
                        sx: {
                            width: "95vw",
                            height: "92vh",
                            maxWidth: "none",
                            m: 0,
                            display: "flex",
                            flexDirection: "column",
                        },
                    },
                }}
            >
                <DialogTitle className="flex items-center justify-between gap-2 pr-2">
                    <span className="truncate">{item.text}</span>
                    <IconButton onClick={() => setOpen(false)} aria-label={t(translations.common.close)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers className="min-h-0 flex-1 p-0">
                    {isImage ? (
                        <Box className="h-full flex flex-col items-center justify-center gap-3 p-4">
                            {isFetching || !pdfUrl ? (
                                <CircularProgress />
                            ) : (
                                <>
                                    <img
                                        src={pdfUrl}
                                        alt={item.text}
                                        className="max-h-[75vh] max-w-full object-contain"
                                    />
                                    <Button
                                        component="a"
                                        href={pdfUrl}
                                        download={item.text || `image-${item.source_id}`}
                                        startIcon={<DownloadIcon />}
                                    >
                                        {t(translations.filesPage.downloadFile)}
                                    </Button>
                                </>
                            )}
                        </Box>
                    ) : (
                        <PdfPreview
                            pdfUrl={pdfUrl}
                            loading={isFetching}
                            pageNumber={item.page_number}
                            highlightText={item.content ?? item.text}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
