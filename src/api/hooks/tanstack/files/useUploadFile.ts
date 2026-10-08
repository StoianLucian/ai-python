import { useMutation, useQueryClient } from '@tanstack/react-query';
// import type { LoginCredentials } from '../../../pages/LoginPage';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { uploadFile } from '../../../fileApi';
import { translations } from '../../../../../i18n';
import { queryKeys } from '../../../../enums/queryKeys';


export function useUploadFile() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (file: File) => {
            const response = await uploadFile(file);
            return response;
        },
        onError: (error: any) => {
            const errorCode = error.response?.data?.detail?.errorCode;
            if (errorCode) {
                toast(t(`errors.${errorCode}`), { type: 'error' });
            } else {
                toast(t(translations.errors.unknownError), { type: 'error' });
            }
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: queryKeys.files });
            toast(t(translations.filesPage.fileUploaded), { type: "success" })
        }
    });
}