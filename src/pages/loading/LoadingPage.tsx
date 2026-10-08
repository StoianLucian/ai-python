import { CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { translations } from '../../../i18n'

type LoadingPageType = {
    label?: string
}

function LoadingPage({ label }: LoadingPageType) {
    const { t } = useTranslation()

    return (
        <div
            role="status"
            aria-live="polite"
            className="flex min-h-screen w-full flex-col items-center justify-center gap-4"
        >
            <CircularProgress size={48} thickness={4} />
            <p className="text-sm text-gray-500">{label ?? t(translations.common.loading)}</p>
        </div>
    )
}

export default LoadingPage
