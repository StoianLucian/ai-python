import axios, { type AxiosProgressEvent } from "axios"

// const isDev = import.meta.env.VITE_IS_DEV;
const apiUrl = import.meta.env.VITE_BE_URL;

export const baseURL =  apiUrl

console.log(baseURL, "url");

export const api = axios.create({
  baseURL,
  withCredentials: true,
})

export const ApiMethod = {
  POST: "post",
  PUT: "put",
  DELETE: "delete",
  GET: "get"
}

export type ApiMethodTYpe = typeof ApiMethod[keyof typeof ApiMethod];


interface RequestType {
  method: ApiMethodTYpe,
  url: string
  data?: any
  responseType?: "arraybuffer" | "blob" | "document" | "json" | "text" | "stream"
  onUploadProgress?: (event: AxiosProgressEvent) => void
}

export const request = async ({ method, url, data, responseType = "json", onUploadProgress }: RequestType) => {

  try {
    const response = await api.request({ method, url, data, responseType, withCredentials: true, onUploadProgress })

    return response.data
  } catch (error) {
    throw error
  }

}