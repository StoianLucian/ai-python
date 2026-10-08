import { Box, Button, Collapse } from '@mui/material'
import type { ReactNode } from 'react'
import Icon, { IconsEnum } from '../Icons/Icon'

export type CollapseOrientation = 'horizontal' | 'vertical'

type CollapsiblePanelProps = {
    open: boolean
    onToggle: () => void
    orientation?: CollapseOrientation
    className?: string
    children: ReactNode
}

// Arrow points right at rotate-0. For each orientation the arrow shows the
// direction the toggle will move the panel: it points "closed" when expanded
// (click to collapse) and back toward "open" when collapsed (click to reveal).
const ARROW_ROTATION: Record<CollapseOrientation, { open: string; closed: string }> = {
    horizontal: { open: 'rotate-180', closed: 'rotate-0' },
    vertical: { open: 'rotate-90', closed: '-rotate-90' },
}

export default function CollapsiblePanel({
    open,
    onToggle,
    orientation = 'horizontal',
    className = '',
    children,
}: CollapsiblePanelProps) {
    const isVertical = orientation === 'vertical'
    const rotation = ARROW_ROTATION[orientation]

    return (
        <Box className={`flex items-start shrink-0 min-h-0 ${isVertical ? 'flex-col w-full' : 'flex-row'} ${className}`}>
            <Collapse in={open} orientation={orientation} className={isVertical ? 'w-full' : ''}>
                {children}
            </Collapse>
            <Box className={isVertical ? 'w-full' : 'w-0'}>
                <Button onClick={onToggle}>
                    <Icon
                        iconName={IconsEnum.ARROW}
                        className={`transition-transform duration-700 ${open ? rotation.open : rotation.closed}`}
                    />
                </Button>
            </Box>
        </Box>
    )
}
