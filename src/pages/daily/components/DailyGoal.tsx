import { useTranslation } from 'react-i18next'
import { Paper, Stack, Typography } from '@mui/material'
import { translations } from '../../../../i18n'
import ProgressCircle from './ProgressCircle'

type DailyGoalProps = {
    value: number
    target: number
}

const RING_COLOR = '#2e9e5b'
const OVER_COLOR = '#e5484d'

export default function DailyGoal({ value, target }: DailyGoalProps) {
    const { t } = useTranslation()

    const percent = target > 0 ? Math.round((value / target) * 100) : 0
    // Over target: turn the ring (and percentage) red as a warning.
    const isOver = percent > 100
    const ringColor = isOver ? OVER_COLOR : RING_COLOR

    return (
        <Paper elevation={0} sx={{ p: 2, borderRadius: 3, bgcolor: '#f4f7f5' }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <ProgressCircle value={value} max={target} color={ringColor} size={56}>
                    <Typography variant="subtitle2" fontWeight={800} sx={{ color: isOver ? OVER_COLOR : 'text.primary' }}>
                        {percent}%
                    </Typography>
                </ProgressCircle>
                <div>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {t(translations.dailyPage.dailyGoal)}
                    </Typography>
                    <Typography variant="h6" fontWeight={800} component="span">
                        {value}
                    </Typography>
                    <Typography color="text.secondary" component="span" sx={{ mx: 0.5 }}>
                        / {target.toLocaleString()}  kcal
                    </Typography>

                </div>
            </Stack>
        </Paper>
    )
}
