import { type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Avatar, Paper, Stack, Typography } from '@mui/material'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import RestaurantRoundedIcon from '@mui/icons-material/RestaurantRounded'
import { translations } from '../../../../i18n'

type DailyHighlightsProps = {
    consumed: number
    burned: number
}

function HighlightCard({ bg, accent, icon, label, value }: { bg: string; accent: string; icon: ReactNode; label: string; value: number }) {
    return (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: bg }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar sx={{ bgcolor: accent, width: 56, height: 56 }}>{icon}</Avatar>
                <div>
                    <Typography variant="body2" fontWeight={600} sx={{ color: accent }}>
                        {label}
                    </Typography>
                    <Typography variant="h5" fontWeight={800} component="span">
                        {value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 0.5 }}>
                        kcal
                    </Typography>
                </div>
            </Stack>
        </Paper>
    )
}

export default function DailyHighlights({ consumed, burned }: DailyHighlightsProps) {
    const { t } = useTranslation()

    return (
        <Stack spacing={2}>
            <HighlightCard
                bg="#e8f5ee"
                accent="#2e9e5b"
                icon={<LocalFireDepartmentRoundedIcon sx={{ fontSize: 32 }} />}
                label={t(translations.dailyPage.caloriesBurned)}
                value={burned}
            />
            <HighlightCard
                bg="#eaf1fe"
                accent="#4f6ef7"
                icon={<RestaurantRoundedIcon sx={{ fontSize: 32 }} />}
                label={t(translations.dailyPage.caloriesConsumed)}
                value={consumed}
            />
        </Stack>
    )
}
