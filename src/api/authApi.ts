
import type { LoginCredentials } from "../pages/login/LoginPage";
import { ApiMethod, request } from "./axiosConfig"


const AUTH_ROUTES = {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout"
}

export async function login(credentials: LoginCredentials) {
    return await request({ method: ApiMethod.POST, url: AUTH_ROUTES.LOGIN, data: credentials })
}


export async function logout() {
    return await request({ method: ApiMethod.POST, url: AUTH_ROUTES.LOGOUT })
}