// Chart series colors, matching the two legend swatches in the design.
export const CONSUMED_COLOR = '#4f6ef7'
export const BURNED_COLOR = '#f5b400'
export const TARGET_COLOR = '#2e9e5b'
export const OVER_TARGET_COLOR = '#e5484d'

// Soft tinted backgrounds + accent colors for the per-day stat cards.
export type StatTone = {
    bg: string
    accent: string
}

export const STAT_TONES = {
    consumed: { bg: '#fdecec', accent: '#e5484d' },
    burned: { bg: '#fef6e6', accent: '#f5a300' },
    protein: { bg: '#e8f5ee', accent: '#2e9e5b' },
    carbs: { bg: '#eef0fb', accent: '#4f6ef7' },
    fat: { bg: '#fdf0e6', accent: '#e8863b' },
    entries: { bg: '#e6f7f4', accent: '#199e8f' },
} as const satisfies Record<string, StatTone>
