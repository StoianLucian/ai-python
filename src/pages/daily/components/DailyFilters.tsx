import { type FormEvent, type MouseEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Button, Popover, Stack, TextField, InputAdornment } from '@mui/material'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import { DayPicker, type DateRange } from 'react-day-picker'
import dayjs, { type Dayjs } from 'dayjs'
import 'react-day-picker/style.css'
import { translations } from '../../../../i18n'

type DailyFiltersProps = {
    start: Dayjs | null
    end: Dayjs | null
    onStartChange: (value: Dayjs | null) => void
    onEndChange: (value: Dayjs | null) => void
    onApply: () => void
    onClear: () => void
    isLoading: boolean
}

const DISPLAY_DATE = 'MMM D, YYYY'

export default function DailyFilters({
    start,
    end,
    onStartChange,
    onEndChange,
    onApply,
    onClear,
    isLoading,
}: DailyFiltersProps) {
    const { t } = useTranslation()

    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
    const open = Boolean(anchorEl)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        onApply()
    }

    // react-day-picker works in native Date; the parent keeps dayjs, so convert
    // at the boundary in both directions.
    const selected: DateRange | undefined = start
        ? { from: start.toDate(), to: end?.toDate() }
        : undefined

    const handleSelect = (range: DateRange | undefined) => {
        onStartChange(range?.from ? dayjs(range.from) : null)
        onEndChange(range?.to ? dayjs(range.to) : null)
        // Range complete: close the popover (the parent auto-applies here).
        if (range?.from && range?.to) setAnchorEl(null)
    }

    const label = start
        ? `${start.format(DISPLAY_DATE)} — ${end ? end.format(DISPLAY_DATE) : '…'}`
        : ''

    return (
        <Stack
            component="form"
            onSubmit={handleSubmit}
            direction="row"
            spacing={2}
            useFlexGap
            flexWrap="wrap"
            alignItems="flex-end"
        >
            <TextField
                label={t(translations.dailyPage.dateRange)}
                placeholder={t(translations.dailyPage.selectRange)}
                value={label}
                onClick={(e: MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
                InputProps={{
                    readOnly: true,
                    endAdornment: (
                        <InputAdornment position="end">
                            <CalendarMonthRoundedIcon color="action" />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    // Full width when the row wraps on small screens; fixed once
                    // there's room to sit inline with the buttons.
                    width: { xs: '100%', sm: 260 },
                    '& .MuiInputBase-root': { cursor: 'pointer' },
                    '& input': { cursor: 'pointer' },
                }}
            />

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Box sx={{ p: 1.5 }}>
                    <DayPicker
                        mode="range"
                        numberOfMonths={2}
                        selected={selected}
                        onSelect={handleSelect}
                        defaultMonth={start?.toDate()}
                    />
                </Box>
            </Popover>

            <Button type="submit" variant="contained" disabled={isLoading} sx={{ height: 56 }}>
                {t(translations.dailyPage.apply)}
            </Button>
            <Button
                type="button"
                variant="outlined"
                onClick={onClear}
                disabled={isLoading || (!start && !end)}
                sx={{ height: 56 }}
            >
                {t(translations.common.clear)}
            </Button>
        </Stack>
    )
}
