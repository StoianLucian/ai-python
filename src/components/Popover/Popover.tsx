import { Box, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react'

type PopoverProps = {
    trigger: React.ReactNode
    items: { label: string, onClick: () => void }[]
}

function Popover({ trigger, items }: PopoverProps) {
    const [anchorEl, setAnchorEl] = useState(null);

    function handleClick(event: any) {
        setAnchorEl(event.currentTarget);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    return (
        <>
            <Box className='min-w-7.5 cursor-pointer' onClick={handleClick}>
                {trigger}
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                {items.map((item, index) => (
                    <MenuItem key={index} onClick={() => { handleClose(); item.onClick(); }}>
                        {item.label}
                    </MenuItem>
                ))}
            </Menu>
        </>



    )
}

export default Popover