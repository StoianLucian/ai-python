import { Box, Button, Collapse, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Icon, { IconsEnum, type IconsType } from '../Icons/Icon'

type CollapsableContainerProps = {
    children: React.ReactNode
    isLoading?: boolean
    icon?: IconsType
    loadingText?: string
    text?: string
}

export default function CollapsableContainer({ children, loadingText, text, icon = IconsEnum.ARROW, isLoading }: CollapsableContainerProps) {
    const [open, setOpen] = useState(false)
    const loading = Boolean(isLoading && loadingText)

    useEffect(() => {
        setOpen(Boolean(isLoading))
    }, [isLoading])
    return (
        <Stack direction="column">
            <Box className="flex items-center">
                <Button onClick={() => setOpen((prev) => !prev)}>
                    <Icon iconName={icon} size={20} className={`
                            transition-transform duration-700
                             ${open ? "-rotate-90" : "rotate-90"}`
                    } />

                </Button>
                {loading &&
                    <Typography className={`overflow-hidden ${isLoading ? "animate-loading" : ""} `}>
                        {loadingText}
                    </Typography>
                }
                {(text && !loading) && <Typography >
                    {text}
                </Typography>
                }
            </Box>
            <Collapse in={open} orientation="vertical">
                {children}
            </Collapse>
        </Stack >

    )
}
