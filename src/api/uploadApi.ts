import { request, ApiMethod } from "./axiosConfig";

const UPLOAD_ROUTES_ENUM = {
    UPLOAD: "/upload/",
}

export const UPLOAD_ROUTES = {
    UPLOAD: UPLOAD_ROUTES_ENUM.UPLOAD,
}

// Mirrors the backend UploadResponse (filename, content_type, size_bytes).
export type UploadResponse = {
    filename: string
    content_type: string | null
    size_bytes: number
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
