import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { deleteEmbeddedDocument } from '../../../uploadApi';
import { translations } from '../../../../../i18n';
import { queryKeys } from '../../../../enums/queryKeys';

// Clear one embedded document (all its embeddings + stored files), then
// refresh the list.
export function useDeleteEmbeddedDocument() {
    const { t } = useTranslation();
    const client = useQueryClient();

    return useMutation({
        mutationFn: (documentId: number) => deleteEmbeddedDocument(documentId),
        onError: () => {
            toast(t(translations.errors.unknownError), { type: 'error' });
        },
        onSuccess(_data, documentId) {
            toast(t(translations.uploadPage.deleted), { type: 'success' });
            client.removeQueries({ queryKey: queryKeys.embeddedDocumentChunks(documentId) });
            client.invalidateQueries({ queryKey: queryKeys.embeddedDocuments });
        },
    });
}
