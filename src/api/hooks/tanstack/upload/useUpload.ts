import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { uploadFile } from '../../../uploadApi';
import { translations } from '../../../../../i18n';
import { queryKeys } from '../../../../enums/queryKeys';

export function useUpload() {
    const { t } = useTranslation();
    const client = useQueryClient();
    // Bytes-uploaded percentage (0–100) for the in-flight upload.
    const [uploadProgress, setUploadProgress] = useState(0);
    const mutation = useMutation({
        mutationFn: async (file: File) => {
            setUploadProgress(0);
            const response = await uploadFile(file, setUploadProgress);
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
            toast(t(translations.uploadPage.uploaded), { type: "success" })
            // Refresh the embedded-documents list so the new file shows up.
            client.invalidateQueries({ queryKey: queryKeys.embeddedDocuments })
        }
    });

    return { ...mutation, uploadProgress };
}
