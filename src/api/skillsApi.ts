import { ApiMethod, request } from "./axiosConfig";
import { getUrlParams } from "./helpers";

const SKILL_ROUTES = {
    SKILLS: "/skills",
}

export async function getSkills(search: string) {

    const urlParams = {
        search_term: search
    }

    const url = getUrlParams(urlParams, SKILL_ROUTES.SKILLS)

    return await request({ method: ApiMethod.GET, url: url })
}

export async function triggerSkills() {
    return await request({ method: ApiMethod.GET, url: SKILL_ROUTES.SKILLS })
}

export type CreateSkillPayload = {
    name: string
    key: string
}

export async function createSkill(data: CreateSkillPayload) {
    return await request({ method: ApiMethod.POST, url: SKILL_ROUTES.SKILLS, data })
}