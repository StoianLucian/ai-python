import { ApiMethod, request } from "./axiosConfig";
import { getUrlParams } from "./helpers";

const CALORIES_ROUTES = {
    LOOKUP: "/calories/lookup",
    DAILY: "/calories/daily",
}

export type ProductLookup = {
    found: boolean
    name: string
    source?: string | null
    category?: string | null
    calories_per_100g?: number | null
    protein_per_100g?: number | null
    carbs_per_100g?: number | null
    fat_per_100g?: number | null
}

export async function lookupFood(name: string): Promise<ProductLookup> {
    const url = getUrlParams({ name }, CALORIES_ROUTES.LOOKUP)

    return await request({ method: ApiMethod.GET, url })
}

export type ExerciseSummary = {
    id: number
    name: string | null
    date: string
    repetition: number | null
    minutes: number | null
    calories: number
}

export type FoodSummary = {
    id: number
    name: string | null
    category: string | null
    date: string
    grams: number
    calories: number
    protein: number
    carbs: number
    fat: number
}

export type DailyRow = {
    date: string
    calories_consumed: number
    calories_burned: number
}

export type DailySummary = {
    start: string
    end: string
    rows: DailyRow[]
}

export type DailyTotals = {
    calories_consumed: number
    protein: number
    carbs: number
    fat: number
    food_entries: number
    calories_burned: number
    exercise_entries: number
}

export type DailyDetail = {
    date: string
    totals: DailyTotals
    foods: FoodSummary[]
    exercises: ExerciseSummary[]
}

// Filters (all inclusive, YYYY-MM-DD). Omit everything for today, pass `day`
// for a single day, or `start`/`end` for a range (either bound optional).
export type DailySummaryFilters = {
    day?: string
    start?: string
    end?: string
}

export async function getDailySummary(
    filters: DailySummaryFilters = {}
): Promise<DailySummary> {
    const url = getUrlParams({ ...filters }, CALORIES_ROUTES.DAILY)

    return await request({ method: ApiMethod.GET, url })
}

// Foods + exercises logged on a single day (YYYY-MM-DD). Backs the detail view
// shown when a day is selected in the table/chart.
export async function getDailyDetail(day: string): Promise<DailyDetail> {
    const url = `${CALORIES_ROUTES.DAILY}/${day}`

    return await request({ method: ApiMethod.GET, url })
}
