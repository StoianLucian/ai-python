import axios from "axios"

// const isDev = import.meta.env.VITE_IS_DEV;
// const apiUrl = import.meta.env.VITE_API_URL;

export const baseURL = "https://python-te51.onrender.com"

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
}

export const request = async ({ method, url, data, responseType = "json" }: RequestType) => {

  try {
    const response = await api.request({ method, url, data, responseType, withCredentials: true })

    return response.data
  } catch (error) {
    throw error
  }

}