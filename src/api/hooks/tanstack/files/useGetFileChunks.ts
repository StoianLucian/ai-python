import { useQuery } from "@tanstack/react-query";
import { getFileChunks, type FileChunk } from "../../../fileApi";
import { queryKeys } from "../../../../enums/queryKeys";

// `enabled` lets callers defer the fetch until the file's chunk dialog opens.
const useGetFileChunks = (id: string, enabled: boolean) => {
  return useQuery<FileChunk[], any>({
    queryFn: () => getFileChunks(id),
    queryKey: queryKeys.fileChunks(id),
    enabled,
  });
};

export default useGetFileChunks;
