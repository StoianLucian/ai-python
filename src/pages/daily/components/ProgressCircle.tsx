import { type ReactNode } from 'react'
import { Box, CircularProgress } from '@mui/material'

type ProgressCircleProps = {
    /** Current value; clamped against `max` to compute the fill. */
    value: number
    /** Value that represents a full ring. */
    max: number
    color: string
    size?: number
    thickness?: number
    /** Rendered in the middle of the ring (percentage, icon, …). */
    children?: ReactNode
}

export default function ProgressCircle({
    value,
    max,
    color,
    size = 72,
    thickness = 5,
    children,
}: ProgressCircleProps) {
    const fill = max > 0 ? Math.min((value / max) * 100, 100) : 0

    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" value={100} thickness={thickness} size={size} sx={{ color: 'divider' }} />
            <CircularProgress
                variant="determinate"
                value={fill}
                thickness={thickness}
                size={size}
                sx={{ color, position: 'absolute', left: 0, zIndex: 1 }}
            />
            <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {children}
            </Box>
        </Box>
    )
}
