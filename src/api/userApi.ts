import type { RegisterCredentials } from "../pages/register/RegisterPage";
import { ApiMethod, request } from "./axiosConfig";
import { getUrlParams } from "./helpers";

const USER_ROUTES = {
    USERS: "/users",
}

export async function register(credentials: RegisterCredentials) {
    return await request({ method: ApiMethod.POST, url: USER_ROUTES.USERS, data: credentials })
}

export async function getUsers(search: string) {

    const urlParams = {
        search_term: search
    }

    const url = getUrlParams(urlParams, USER_ROUTES.USERS)

    return await request({ method: ApiMethod.GET, url: url })
}