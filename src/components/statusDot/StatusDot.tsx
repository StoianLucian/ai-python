import { Box, CircularProgress, Typography } from '@mui/material'
import { BsCircleFill } from 'react-icons/bs'
import { usePingModel } from '../../api/hooks/tanstack/chat/usePingChat';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LlmProvider } from '../../enums/providers';
import { translations } from '../../../i18n';


type StatusDotProps = {
    model: string;
    provider: LlmProvider;
}
export default function StatusDot({ model, provider }: StatusDotProps) {
    const { t } = useTranslation();
    const [status, setStatus] = useState(false);

    useEffect(() => {
        if (model)
            pingModel({ model, provider })
    }, [model, provider])

    const { mutateAsync: pingModel, isSuccess } = usePingModel(setStatus);
    const color = status ? "green" : "red"
    const text = status ? t(translations.aiChat.statusActive) : t(translations.aiChat.statusInactive)

    return (
        <Box className="flex justify-start items-center gap-2">
            {!isSuccess
                ?
                <>
                    <CircularProgress size={20} />
                    <Typography className={`overflow-hidden ${!isSuccess ? "animate-loading" : ""} `}>
                        {t(translations.common.loading)}
                    </Typography>
                </>
                :
                (<>
                    <BsCircleFill color={color} />
                    <Typography variant="caption">
                        {text}
                    </Typography></>)}
        </Box>
    )
}
