import { useTranslation } from 'react-i18next'
import { Avatar, Divider, Paper, Stack, Typography } from '@mui/material'
import type { SvgIconComponent } from '@mui/icons-material'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import GrassRoundedIcon from '@mui/icons-material/GrassRounded'
import SpaRoundedIcon from '@mui/icons-material/SpaRounded'
import KebabDiningRoundedIcon from '@mui/icons-material/KebabDiningRounded'
import SetMealRoundedIcon from '@mui/icons-material/SetMealRounded'
import EggRoundedIcon from '@mui/icons-material/EggRounded'
import GrainRoundedIcon from '@mui/icons-material/GrainRounded'
import RiceBowlRoundedIcon from '@mui/icons-material/RiceBowlRounded'
import CakeRoundedIcon from '@mui/icons-material/CakeRounded'
import LocalDrinkRoundedIcon from '@mui/icons-material/LocalDrinkRounded'
import FastfoodRoundedIcon from '@mui/icons-material/FastfoodRounded'
import OilBarrelRoundedIcon from '@mui/icons-material/OilBarrelRounded'
import dayjs from 'dayjs'
import { type FoodSummary, type ExerciseSummary } from '../../../api/caloriesApi'
import { translations } from '../../../../i18n'
import type { StatTone } from './palette'

// Icon + soft-tinted color tone per food category. Categories come from the
// fixed backend catalog; anything unknown or null falls back to the generic
// neutral restaurant icon (see `foodCategoryStyle`).
type FoodCategoryStyle = { icon: SvgIconComponent; tone: StatTone }

const NEUTRAL_TONE: StatTone = { bg: 'action.hover', accent: 'text.secondary' }

const FOOD_CATEGORY_STYLES: Record<string, FoodCategoryStyle> = {
    vegetable: { icon: GrassRoundedIcon, tone: { bg: '#e8f5ee', accent: '#2e9e5b' } },
    fruit: { icon: SpaRoundedIcon, tone: { bg: '#fdecec', accent: '#e5484d' } },
    meat: { icon: KebabDiningRoundedIcon, tone: { bg: '#f7e9e6', accent: '#b4442f' } },
    seafood: { icon: SetMealRoundedIcon, tone: { bg: '#e6f4fb', accent: '#1f8fb5' } },
    dairy: { icon: EggRoundedIcon, tone: { bg: '#eef0fb', accent: '#4f6ef7' } },
    grains: { icon: GrainRoundedIcon, tone: { bg: '#fdf3e0', accent: '#c98a1e' } },
    legumes: { icon: RiceBowlRoundedIcon, tone: { bg: '#f0efe2', accent: '#8a8a2e' } },
    sweets: { icon: CakeRoundedIcon, tone: { bg: '#f6e9f5', accent: '#b53fa0' } },
    beverages: { icon: LocalDrinkRoundedIcon, tone: { bg: '#e6f7f4', accent: '#199e8f' } },
    snacks: { icon: FastfoodRoundedIcon, tone: { bg: '#fdf0e6', accent: '#e8863b' } },
    fats_oils: { icon: OilBarrelRoundedIcon, tone: { bg: '#fef6e6', accent: '#f5a300' } },
}

function foodCategoryStyle(category: string | null): FoodCategoryStyle {
    const fallback = { icon: RestaurantRoundedIcon, tone: NEUTRAL_TONE }
    if (!category) return fallback
    return FOOD_CATEGORY_STYLES[category.toLowerCase()] ?? fallback
}

type DailySummaryProps = {
    foods: FoodSummary[]
    exercises: ExerciseSummary[]
}

type EntryRowProps = {
    icon: React.ReactNode
    primary: string
    secondary: string
    value: string
    tone?: StatTone
}

function EntryRow({ icon, primary, secondary, value, tone = NEUTRAL_TONE }: EntryRowProps) {
    return (
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ py: 1 }}>
            <Avatar sx={{ bgcolor: tone.bg, color: tone.accent }}>{icon}</Avatar>
            <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Typography fontWeight={600} noWrap>
                    {primary}
                </Typography>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {secondary}
                </Typography>
            </Stack>
            <Typography fontWeight={700} whiteSpace="nowrap">
                {value}
            </Typography>
            <ChevronRightRoundedIcon color="disabled" />
        </Stack>
    )
}

export default function DailySummary({ foods, exercises }: DailySummaryProps) {
    const { t } = useTranslation()

    return (
        <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <RestaurantRoundedIcon color="action" />
                    <Typography variant="h6" fontWeight={700}>
                        {t(translations.dailyPage.foodEntries)}
                    </Typography>
                </Stack>
                {foods.length === 0 ? (
                    <Typography color="text.secondary">—</Typography>
                ) : (
                    <Stack divider={<Divider flexItem />}>
                        {foods.map((food) => {
                            const { icon: CategoryIcon, tone } = foodCategoryStyle(food.category)
                            return (
                            <EntryRow
                                key={food.id}
                                icon={<CategoryIcon fontSize="small" />}
                                tone={tone}
                                primary={`${food.name ?? '—'} · ${food.grams} g`}
                                secondary={[
                                    `${t(translations.dailyPage.protein)} ${food.protein} g`,
                                    `${t(translations.dailyPage.carbs)} ${food.carbs} g`,
                                    `${t(translations.dailyPage.fat)} ${food.fat} g`,
                                ].join(' · ')}
                                value={`${food.calories} kcal`}
                            />
                            )
                        })}
                    </Stack>
                )}
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <FitnessCenterRoundedIcon color="action" />
                    <Typography variant="h6" fontWeight={700}>
                        {t(translations.dailyPage.exercises)}
                    </Typography>
                </Stack>
                {exercises.length === 0 ? (
                    <Typography color="text.secondary">{t(translations.dailyPage.noExercises)}</Typography>
                ) : (
                    <Stack divider={<Divider flexItem />}>
                        {exercises.map((exercise) => (
                            <EntryRow
                                key={exercise.id}
                                icon={<FitnessCenterRoundedIcon fontSize="small" />}
                                primary={exercise.name ?? '—'}
                                secondary={[
                                    exercise.repetition != null ? `${exercise.repetition} reps` : null,
                                    exercise.minutes != null ? `${exercise.minutes} min` : null,
                                    dayjs(exercise.date).format('MMM D'),
                                ]
                                    .filter(Boolean)
                                    .join(' · ')}
                                value={`${exercise.calories} kcal`}
                            />
                        ))}
                    </Stack>
                )}
            </Paper>
        </Stack>
    )
}
