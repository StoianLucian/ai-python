import { useMutation, useQueryClient } from '@tanstack/react-query';
// import type { LoginCredentials } from '../../../pages/LoginPage';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { uploadFiles } from '../../../fileApi';
import { translations } from '../../../../../i18n';
import { queryKeys } from '../../../../enums/queryKeys';


export function useUploadFile() {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    // Bytes-uploaded percentage (0–100) for the in-flight upload.
    const [uploadProgress, setUploadProgress] = useState(0);
    const mutation = useMutation({
        mutationFn: async (files: File[]) => {
            setUploadProgress(0);
            const response = await uploadFiles(files, setUploadProgress);
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
            queryClient.invalidateQueries({ queryKey: queryKeys.chunks });
            toast(t(translations.filesPage.fileUploaded), { type: "success" })
        }
    });

    return { ...mutation, uploadProgress };
}