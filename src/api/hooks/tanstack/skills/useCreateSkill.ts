import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { createSkill, type CreateSkillPayload } from '../../../skillsApi';
import { translations } from '../../../../../i18n';

export function useCreateSkill() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateSkillPayload) => createSkill(data),
        onSuccess: () => {
            // Refresh every cached skills list (keyed ["skills", search]) so the
            // new skill shows up in the mention picker immediately.
            queryClient.invalidateQueries({ queryKey: ['skills'] });
            toast(t(translations.success.skillAdded), { type: 'success' });
        },
        onError: (error: any) => {
            const detail = error.response?.data?.detail;
            toast(typeof detail === 'string' ? detail : t(translations.errors.skillAddFailed), { type: 'error' });
        },
    });
}
