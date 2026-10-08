import {
    Box,
    IconButton,
    TextField,
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useCreateSkill } from '../../api/hooks/tanstack/skills/useCreateSkill';
import { dialog } from '../Dialog/dialogStore';
import { translations } from '../../../i18n';

function slugify(value: string) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
}

type SkillFormValues = {
    name: string;
    key: string;
    keyEdited: boolean;
};

export default function AddSkillDialog() {
    const { t } = useTranslation();
    const { mutateAsync } = useCreateSkill();

    const { control, handleSubmit, reset, setValue, getValues } = useForm<SkillFormValues>({
        defaultValues: { name: '', key: '', keyEdited: false },
        mode: 'onChange',
    });

    function openDialog() {
        reset({ name: '', key: '', keyEdited: false });
        dialog.show({
            title: t(translations.aiChat.addSkill),
            submitLabel: t(translations.common.add),
            content: (
                <Box>
                    <Controller
                        control={control}
                        name="name"
                        rules={{ validate: (value) => value.trim().length > 0 || t(translations.aiChat.skillNameRequired) }}
                        render={({ field, fieldState }) => (
                            <TextField
                                autoFocus
                                fullWidth
                                margin="dense"
                                label={t(translations.aiChat.skillName)}
                                value={field.value}
                                onChange={(e) => {
                                    field.onChange(e.target.value);
                                    if (!getValues('keyEdited')) {
                                        setValue('key', slugify(e.target.value), { shouldValidate: true });
                                    }
                                }}
                                onBlur={field.onBlur}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />
                    <Controller
                        control={control}
                        name="key"
                        rules={{ validate: (value) => value.trim().length > 0 || t(translations.aiChat.slugRequired) }}
                        render={({ field, fieldState }) => (
                            <TextField
                                fullWidth
                                margin="dense"
                                label={t(translations.aiChat.slug)}
                                value={field.value}
                                onChange={(e) => {
                                    setValue('keyEdited', true);
                                    field.onChange(slugify(e.target.value));
                                }}
                                onBlur={field.onBlur}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message ?? t(translations.aiChat.slugHelper)}
                            />
                        )}
                    />
                </Box>
            ),
            onSubmit: () =>
                // handleSubmit only invokes the callback when validation passes;
                // when it fails the returned promise resolves without running it,
                // so we reject to keep the dialog open.
                new Promise<void>((resolve, reject) => {
                    handleSubmit(
                        async (values) => {
                            await mutateAsync({ name: values.name.trim(), key: values.key });
                            resolve();
                        },
                        () => reject(new Error('Validation failed'))
                    )();
                }),
        });
    }

    return (
        <Tooltip title={t(translations.aiChat.addSkill)}>
            <IconButton onClick={openDialog} size="small">
                <AddIcon />
            </IconButton>
        </Tooltip>
    );
}
