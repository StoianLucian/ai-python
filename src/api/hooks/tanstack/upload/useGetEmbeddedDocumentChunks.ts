import { useQuery } from "@tanstack/react-query";
import { getEmbeddedDocumentChunks, type EmbeddedDocumentChunks } from "../../../uploadApi";
import { queryKeys } from "../../../../enums/queryKeys";

// Chunks + embedding vectors of one embedded document. Only fetched when
// `enabled` (i.e. while its popover is open); cached afterwards.
const useGetEmbeddedDocumentChunks = (documentId: number, enabled: boolean) => {
    return useQuery<EmbeddedDocumentChunks>({
        queryFn: () => getEmbeddedDocumentChunks(documentId),
        queryKey: queryKeys.embeddedDocumentChunks(documentId),
        enabled: enabled && !!documentId,
    });
};

export default useGetEmbeddedDocumentChunks;
