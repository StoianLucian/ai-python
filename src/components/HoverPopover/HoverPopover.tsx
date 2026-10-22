import { Box, Button, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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

export default function HoverPopover({ item }: { item: Entity }) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    console.log(item)
    const { data: files = "", isFetching } = usePreviewFile(item.source_id!, open)
    // isLoading (not isPending) so a disabled/idle query — e.g. a popover with no
    // numeric source_id — doesn't leave the spinner stuck forever.
    const { data: accessible, isLoading: checking, isError } = useFileAccessible(item.source_id ?? "");
    // Red X when the probe failed (network/auth) or the file is reported missing.
    const inaccessible = isError || accessible === false;

    function accessibilityIcon() {
        if (checking) return <CircularProgress size={16} />;
        if (inaccessible) return <CancelIcon fontSize="small" sx={{ color: "error.main" }} />;
        if (accessible) return <CheckCircleIcon fontSize="small" sx={{ color: "success.main" }} />;
        return null;
    }

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
            <Button
                onClick={() => setOpen(true)}
                disabled={inaccessible}
                startIcon={accessibilityIcon()}
            >
                {item.text}
            </Button>

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
