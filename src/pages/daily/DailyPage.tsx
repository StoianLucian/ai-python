import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, CircularProgress, Container, Paper, Stack, Typography } from '@mui/material'
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded'
import { type Dayjs } from 'dayjs'
import useGetDailySummary from '../../api/hooks/tanstack/calories/useGetDailySummary'
import useGetDailyDetail from '../../api/hooks/tanstack/calories/useGetDailyDetail'
import { translations } from '../../../i18n'
import DailyFilters from './components/DailyFilters'
import DailyChart from './components/DailyChart'
import DailyStats from './components/DailyStats'
import DailyHighlights from './components/DailyHighlights'
import DailyGoal from './components/DailyGoal'
import DailySummary from './components/DailySummary'
import { type DailyTotals } from '../../api/caloriesApi'

const API_DATE = 'YYYY-MM-DD'

// Mock daily calorie target until a real goal is stored on the user profile.
const MOCK_CALORIE_TARGET = 1700

// Shown in the fixed stats card while a day's detail is still loading, so the
// card keeps its height instead of unmounting and snapping the layout.
const ZERO_TOTALS: DailyTotals = {
    calories_consumed: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    food_entries: 0,
    calories_burned: 0,
    exercise_entries: 0,
}

function DailyPage() {
    const { t } = useTranslation()

    // Draft picker values, promoted to `filters` on Apply.
    const [range, setRange] = useState<{ start: Dayjs | null; end: Dayjs | null }>({ start: null, end: null })
    const [filters, setFilters] = useState<{ start: string; end: string }>({ start: '', end: '' })

    const [selectedDate, setSelectedDate] = useState<string | null>(null)

    // Empty strings are dropped by getUrlParams, so with no dates the endpoint
    // defaults to today; providing start/end filters by that inclusive range.
    const { data, isLoading, isError } = useGetDailySummary(filters)


    console.log(data)

    // Promote a range to the applied filters that drive the query.
    const applyRange = (start: Dayjs | null, end: Dayjs | null) => {
        setSelectedDate(null)
        setFilters({
            start: start?.isValid() ? start.format(API_DATE) : '',
            end: end?.isValid() ? end.format(API_DATE) : '',
        })
    }

    const handleApply = () => applyRange(range.start, range.end)

    // Auto-apply as soon as the end date is picked, provided a start is set.
    const handleEndChange = (end: Dayjs | null) => {
        setRange((r) => ({ ...r, end }))
        if (end?.isValid() && range.start?.isValid()) {
            applyRange(range.start, end)
        }
    }

    // Reset the pickers and the applied filters, so the query falls back to
    // its no-filter default (today).
    const handleClear = () => {
        setRange({ start: null, end: null })
        setSelectedDate(null)
        setFilters({ start: '', end: '' })
    }

    // Default to the last row in range until the user picks one on the chart.
    const rows = data?.rows ?? []
    const activeDate = selectedDate ?? rows[0]?.date ?? null
    const activeDay = rows.find((r) => r.date === activeDate) ?? null
    const activeBurned = activeDay?.calories_burned ?? 0

    const total = (activeDay?.calories_consumed ?? 0) - (activeDay?.calories_burned ?? 0)

    // Foods/exercises for the selected row, fetched on demand by its date when a
    // chart bar is clicked.
    const { data: detail } = useGetDailyDetail(activeDate)

    return (
        <Container maxWidth={false} sx={{ maxWidth: 1400, mb: 4 }}>
            <Stack spacing={3}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ md: 'flex-start' }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={800}>
                            {t(translations.dailyPage.title)}
                        </Typography>
                        <Typography color="text.secondary">{t(translations.dailyPage.subtitle)}</Typography>
                    </Box>
                    <DailyFilters
                        start={range.start}
                        end={range.end}
                        onStartChange={(start) => setRange((r) => ({ ...r, start }))}
                        onEndChange={handleEndChange}
                        onApply={handleApply}
                        onClear={handleClear}
                        isLoading={isLoading}
                    />
                </Stack>

                {isLoading && <CircularProgress />}
                {isError && <Typography color="error">{t(translations.dailyPage.error)}</Typography>}

                {data && !isLoading && !isError && (
                    <Stack spacing={3}>
                        {/* Chart + highlights/goal: side-by-side on md+, stacked
                            (highlights/goal directly under the chart) below md. */}
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
                            <Box sx={{ flex: 1, minWidth: 0, width: '100%' }}>
                                <DailyChart data={data} activeDate={activeDate} onSelectDate={setSelectedDate} />
                            </Box>
                            <Stack spacing={2} sx={{ width: '100%', flex: { md: '0 1 300px' }, minWidth: 0 }}>
                                <DailyHighlights consumed={activeDay?.calories_consumed ?? 0} burned={activeBurned} />
                                <DailyGoal value={total} target={MOCK_CALORIE_TARGET} />
                            </Stack>
                        </Stack>

                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                                <ShowChartRoundedIcon color="action" />
                                <Typography variant="h6" fontWeight={700}>
                                    {t(translations.dailyPage.dailyTotals)}
                                </Typography>
                            </Stack>
                            <DailyStats totals={detail?.totals ?? ZERO_TOTALS} />
                        </Paper>
                        <DailySummary foods={detail?.foods ?? []} exercises={detail?.exercises ?? []} />
                    </Stack>
                )}
            </Stack>
        </Container>
    )
}

export default DailyPage
