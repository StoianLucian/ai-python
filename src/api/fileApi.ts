import { request, ApiMethod } from "./axiosConfig";
import type { File as FileType } from "./hooks/tanstack/files/useGetFiles";

const FILE_ROUTES_ENUM = {
    FILES: "/files",
}

export const FILE_ROUTES = {
    FILES: FILE_ROUTES_ENUM.FILES,
    GET_FILE: (id: string) => `${FILE_ROUTES_ENUM.FILES}/${id}`,
    FILE_EXISTS: (id: string) => `${FILE_ROUTES_ENUM.FILES}/${id}/exists`,
}

export async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append("file", file)

    return await request({ method: ApiMethod.POST, url: FILE_ROUTES.FILES, data: formData })
}

export async function getFIles(): Promise<FileType[]> {
    return await request({ method: ApiMethod.GET, url: FILE_ROUTES.FILES })
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
