import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import React from 'react'


type AuthFormProps = {
    children: React.ReactNode,
    onSubmit: () => void,
    btnText: string,
    isPending: boolean,
    title?: string,
    subtitle?: string,
}
function AuthForm({ children, onSubmit, btnText, isPending, title, subtitle }: AuthFormProps) {

    return (
        <Box className="w-screen min-h-screen flex justify-center items-center bg-[#FAF9F6] p-6">
            <form onSubmit={onSubmit} className="w-full max-w-md">
                <Stack
                    spacing={3}
                    className="rounded-2xl bg-white ring-1 ring-[#ECEAE4] p-8 shadow-sm"
                >
                    {(title || subtitle) && (
                        <Stack spacing={0.5}>
                            {title && (
                                <Typography variant="h5" fontWeight={600}>
                                    {title}
                                </Typography>
                            )}
                            {subtitle && (
                                <Typography variant="body2" color="text.secondary">
                                    {subtitle}
                                </Typography>
                            )}
                        </Stack>
                    )}
                    {children}
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={isPending}
                        className="rounded-xl"
                    >
                        {isPending ? <CircularProgress size={25} color="inherit" /> : btnText}
                    </Button>
                </Stack>
            </form>
        </Box>
    )
}

export default AuthForm
