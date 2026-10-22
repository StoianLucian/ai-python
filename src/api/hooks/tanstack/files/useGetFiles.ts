import { useQuery } from "@tanstack/react-query";
import { getFIles } from "../../../fileApi";
import { queryKeys } from "../../../../enums/queryKeys";

export type FileStatus = "pending" | "processing" | "done" | "failed"

export type File = {
  id: string,
  file_name: string,
  file_size: number,
  file_type: string,
  created_at: Date,
  status: FileStatus,
  chunks_done: number,
  chunks_total: number,
  eta_seconds: number | null,
  error: string | null
}

const useGetFiles = () => {

  return useQuery<File[], any>({
    queryFn: () => getFIles(),
    queryKey: queryKeys.files,
    // While any file is still embedding in the background, poll so the progress
    // bars advance; stop polling once everything has settled.
    refetchInterval: (query) => {
      const data = query.state.data
      const busy = data?.some((f) => f.status === "pending" || f.status === "processing")
      return busy ? 1500 : false
    },
  });
};

export default useGetFiles;
