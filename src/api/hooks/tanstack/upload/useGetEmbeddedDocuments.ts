import { useQuery } from "@tanstack/react-query";
import { getEmbeddedDocuments, type EmbeddedDocument } from "../../../uploadApi";
import { queryKeys } from "../../../../enums/queryKeys";

// The logged-in user's embedded documents, from the vector store.
const useGetEmbeddedDocuments = () => {
    return useQuery<EmbeddedDocument[]>({
        queryFn: getEmbeddedDocuments,
        queryKey: queryKeys.embeddedDocuments,
    });
};

export default useGetEmbeddedDocuments;
