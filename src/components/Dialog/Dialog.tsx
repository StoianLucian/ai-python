import type { ReactNode } from 'react';
import {
    Button,
    CircularProgress,
    Dialog as MuiDialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { translations } from '../../../i18n';

type DialogProps = {
    open: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title?: ReactNode;
    content: ReactNode;
    cancelLabel?: string;
    submitLabel?: string;
    submitColor?: 'primary' | 'error' | 'success' | 'warning' | 'info' | 'secondary';
    isPending?: boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export default function Dialog({
    open,
    onClose,
    onSubmit,
    title,
    content,
    cancelLabel,
    submitLabel,
    submitColor = 'primary',
    isPending = false,
    maxWidth = 'xs',
}: DialogProps) {
    const { t } = useTranslation();
    return (
        <MuiDialog
            open={open}
            onClose={() => !isPending && onClose()}
            maxWidth={maxWidth}
            fullWidth
        >
            {title && <DialogTitle className="px-8 pt-6">{title}</DialogTitle>}
            <DialogContent className="px-8 py-4">
                {content}
            </DialogContent>
            <DialogActions className="px-8 pb-6 gap-2">
                <Button onClick={onClose} disabled={isPending}>
                    {cancelLabel ?? t(translations.common.cancel)}
                </Button>
                <Button
                    onClick={onSubmit}
                    color={submitColor}
                    variant="contained"
                    disabled={isPending}
                >
                    {isPending ? <CircularProgress size={20} /> : (submitLabel ?? t(translations.common.confirm))}
                </Button>
            </DialogActions>
        </MuiDialog>
    );
}
