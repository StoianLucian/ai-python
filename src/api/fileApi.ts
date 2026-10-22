import { request, ApiMethod } from "./axiosConfig";
import type { File as FileType } from "./hooks/tanstack/files/useGetFiles";

const FILE_ROUTES_ENUM = {
    FILES: "/files",
}

export const FILE_ROUTES = {
    FILES: FILE_ROUTES_ENUM.FILES,
    GET_FILE: (id: string) => `${FILE_ROUTES_ENUM.FILES}/${id}`,
    FILE_CHUNKS: (id: string) => `${FILE_ROUTES_ENUM.FILES}/${id}/chunks`,
    FILE_EXISTS: (id: string) => `${FILE_ROUTES_ENUM.FILES}/${id}/exists`,
}

export type FileChunk = {
    id: number
    page_number: number | null
    content: string
}

// The backend param is `files: list[UploadFile]`, so every file is appended
// under the same "files" field. Embedding runs in the background; this returns
// as soon as the files are saved (HTTP 202).
export async function uploadFiles(files: File[], onProgress?: (percent: number) => void) {
    const formData = new FormData();
    for (const file of files) {
        formData.append("files", file)
    }

    return await request({
        method: ApiMethod.POST,
        url: FILE_ROUTES.FILES,
        data: formData,
        // Report bytes-uploaded progress (0–100) for the whole batch.
        onUploadProgress: onProgress
            ? (e) => onProgress(Math.round((e.loaded / (e.total ?? e.loaded ?? 1)) * 100))
            : undefined,
    })
}

export async function getFIles(): Promise<FileType[]> {
    return await request({ method: ApiMethod.GET, url: FILE_ROUTES.FILES })
}

export async function getFileChunks(id: string): Promise<FileChunk[]> {
    return await request({ method: ApiMethod.GET, url: FILE_ROUTES.FILE_CHUNKS(id) })
}

export async function getFile(id: string, filename: string) {

    const downloadFile = (data: Blob, filename: string) => {
        const url = window.URL.createObjectURL(data)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    }

    const fileData = await request({
        method: ApiMethod.GET,
        url: FILE_ROUTES.GET_FILE(id),
        responseType: "blob"
    })

    downloadFile(fileData, filename)
}

export async function checkFileAccessible(id: string): Promise<boolean> {
    const data = await request({ method: ApiMethod.GET, url: FILE_ROUTES.FILE_EXISTS(id) })
    return !!data?.exists
}

export async function previewFile(id: string) {
    return await request({
        method: ApiMethod.GET,
        url: FILE_ROUTES.GET_FILE(id),
        responseType: "blob"
    })
}

export async function resetFiles() {
    return await request({ method: ApiMethod.DELETE, url: FILE_ROUTES.FILES })
}
