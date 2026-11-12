import { request, ApiMethod } from "./axiosConfig";

const UPLOAD_ROUTES_ENUM = {
    UPLOAD: "/upload/",
}

export const UPLOAD_ROUTES = {
    UPLOAD: UPLOAD_ROUTES_ENUM.UPLOAD,
}

// Mirrors the backend UploadResponse: file info plus the embedding result
// (the extracted text is embedded and stored in the vector DB).
export type UploadResponse = {
    filename: string
    content_type: string | null
    size_bytes: number
    file_type: string | null
    document_id: number      // the stored file's id
    text_chunks: number
    text: string
}

// One embedded document of the logged-in user (GET /upload/).
export type EmbeddedDocument = {
    document_id: number
    filename: string | null   // null for documents stored before filenames were recorded
    file_type: string | null
    created_at: string | null
    created_by: number | null // uploader's user id
    chunks: number
    pages: number
    document_metadata: Record<string, unknown> // e.g. a PDF's page_count, title, author
}

// One stored chunk of an embedded document, with its embedding vector.
export type EmbeddedChunk = {
    id: number
    page_number: number
    kind: string | null       // "text" / "table" / ...
    content: string
    metadata: Record<string, unknown>
    vector_dim: number
    vector: number[]
}

export type EmbeddedDocumentChunks = {
    document_id: number
    filename: string | null
    document_metadata: Record<string, unknown>
    chunks: EmbeddedChunk[]
}

export async function getEmbeddedDocumentChunks(documentId: number): Promise<EmbeddedDocumentChunks> {
    return await request({
        method: ApiMethod.GET,
        url: `${UPLOAD_ROUTES.UPLOAD}${documentId}/chunks`,
    })
}

export type DeletedDocument = {
    document_id: number
    removed: Record<string, number>   // rows removed per table
    removed_files: string[]
}

// Clear everything stored for one document (embeddings + screenshots).
export async function deleteEmbeddedDocument(documentId: number): Promise<DeletedDocument> {
    return await request({
        method: ApiMethod.DELETE,
        url: `${UPLOAD_ROUTES.UPLOAD}${documentId}`,
    })
}

export async function getEmbeddedDocuments(): Promise<EmbeddedDocument[]> {
    return await request({ method: ApiMethod.GET, url: UPLOAD_ROUTES.UPLOAD })
}

// The backend param is `file: UploadFile`, so a single file is appended under
// the "file" field. The file is forwarded to the external upload service and
// the service's response is returned.
export async function uploadFile(file: File, onProgress?: (percent: number) => void): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file)

    return await request({
        method: ApiMethod.POST,
        url: UPLOAD_ROUTES.UPLOAD,
        data: formData,
        // Report bytes-uploaded progress (0–100) for the file.
        onUploadProgress: onProgress
            ? (e) => onProgress(Math.round((e.loaded / (e.total ?? e.loaded ?? 1)) * 100))
            : undefined,
    })
}
