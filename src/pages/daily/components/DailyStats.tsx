import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Paper, Stack, Typography } from '@mui/material'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import EggAltRoundedIcon from '@mui/icons-material/EggAltRounded'
import BakeryDiningRoundedIcon from '@mui/icons-material/BakeryDiningRounded'
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded'
import ListAltRoundedIcon from '@mui/icons-material/ListAltRounded'
import { type DailyTotals } from '../../../api/caloriesApi'
import { translations } from '../../../../i18n'
import { STAT_TONES, type StatTone } from './palette'

type DailyStatsProps = {
    totals: DailyTotals
}

function StatCard({ tone, icon, label, value, unit }: { tone: StatTone; icon: ReactNode; label: string; value: number; unit?: string }) {
    return (
        <Paper elevation={0} sx={{ flex: '1 1 140px', p: 1.5, borderRadius: 3, bgcolor: tone.bg }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5, color: tone.accent }}>
                {icon}
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {label}
                </Typography>
            </Stack>
            <Typography variant="h6" fontWeight={800} component="span">
                {value}
            </Typography>
            {unit && (
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 0.5 }}>
                    {unit}
                </Typography>
            )}
        </Paper>
    )
}

export default function DailyStats({ totals }: DailyStatsProps) {
    const { t } = useTranslation()

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            <StatCard tone={STAT_TONES.consumed} icon={<LocalFireDepartmentRoundedIcon fontSize="small" />} label={t(translations.dailyPage.caloriesConsumed)} value={totals.calories_consumed} unit="kcal" />
            <StatCard tone={STAT_TONES.burned} icon={<LocalFireDepartmentRoundedIcon fontSize="small" />} label={t(translations.dailyPage.caloriesBurned)} value={totals.calories_burned} unit="kcal" />
            <StatCard tone={STAT_TONES.protein} icon={<EggAltRoundedIcon fontSize="small" />} label={t(translations.dailyPage.protein)} value={totals.protein} unit="g" />
            <StatCard tone={STAT_TONES.carbs} icon={<BakeryDiningRoundedIcon fontSize="small" />} label={t(translations.dailyPage.carbs)} value={totals.carbs} unit="g" />
            <StatCard tone={STAT_TONES.fat} icon={<WaterDropRoundedIcon fontSize="small" />} label={t(translations.dailyPage.fat)} value={totals.fat} unit="g" />
            <StatCard tone={STAT_TONES.entries} icon={<ListAltRoundedIcon fontSize="small" />} label={t(translations.dailyPage.foodEntries)} value={totals.food_entries} />
        </Box>
    )
}
