import { useMemo } from "react";
import { Box, CircularProgress } from "@mui/material";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.js?url";

const SHORT_PHRASE_WORDS = 12;
const WINDOW_SIZE = 5;
const WINDOW_STEP = 3;
const MAX_KEYWORDS = 80;

// Turn a response excerpt into whitespace-tolerant regexes the search plugin can
// match across the PDF's line breaks (`\s+` between words spans line wraps).
function buildKeywords(text?: string): RegExp[] {
    const normalized = text?.replace(/\s+/g, " ").trim();
    if (!normalized) return [];

    const toRegExp = (phrase: string) =>
        // Escape regex specials, then let any whitespace match runs/line breaks.
        // The "g" flag is REQUIRED: the search plugin execs a RegExp keyword in a
        // while-loop, and a non-global regex never advances lastIndex — it hangs
        // the search on "loading" forever.
        new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+"), "gi");

    const words = normalized.split(" ");

    // Short, focused excerpt (the expected case): match it exactly, once.
    if (words.length <= SHORT_PHRASE_WORDS) return [toRegExp(normalized)];

    // Long blob fallback: overlapping word-windows for best-effort partial hits.
    const phrases = new Set<string>();
    for (let i = 0; i < words.length && phrases.size < MAX_KEYWORDS; i += WINDOW_STEP) {
        const phrase = words.slice(i, i + WINDOW_SIZE).join(" ");
        if (phrase.length >= 8) phrases.add(phrase);
    }

    return [...phrases].map(toRegExp);
}

type PdfPreviewProps = {
    pdfUrl?: string | null;
    loading: boolean;
    /** 1-based page to open on. */
    pageNumber?: string;
    /** Text from the response to highlight and scroll to inside the PDF. */
    highlightText?: string;
};

export default function PdfPreview({ pdfUrl, loading, pageNumber, highlightText }: PdfPreviewProps) {
    // The backend returns the whole excerpt, but the PDF text layer wraps it
    // across lines with irregular spacing, so an exact-string search misses.
    // Build one whitespace-tolerant regex per sentence: `\s+` between words
    // matches across line breaks, and searching sentences independently gives
    // partial matching — if the full passage isn't contiguous, the sentences
    // that are present still highlight.
    const keywords = useMemo(() => buildKeywords(highlightText), [highlightText]);

    // The default layout adds the toolbar (page navigation + zoom + manual search)
    // and the sidebar (page thumbnails). We seed its search plugin with the
    // response snippet so it highlights on load; the user can then search freely.
    // NOTE: plugin factories call hooks internally, so they must run at the top
    // level every render — never inside useMemo/useEffect (rules of hooks).
    const layoutPlugin = defaultLayoutPlugin(
        keywords.length ? { toolbarPlugin: { searchPlugin: { keyword: keywords } } } : {}
    );

    const initialPage = pageNumber ? Math.max(Number(pageNumber) - 1, 0) : 0;

    return (
        <Box className="flex h-full w-full items-center justify-center overflow-hidden rounded">
            {loading || !pdfUrl ? (
                <CircularProgress />
            ) : (
                <Worker workerUrl={workerUrl}>
                    <Viewer
                        // Remount when the file or highlight changes so the plugin
                        // re-runs its search against the new document.
                        key={`${pdfUrl}-${highlightText ?? ""}`}
                        fileUrl={pdfUrl}
                        initialPage={initialPage}
                        plugins={[layoutPlugin]}
                    />
                </Worker>
            )}
        </Box>
    );
}
