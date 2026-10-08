import { useQuery } from "@tanstack/react-query";
import { getFIles } from "../../../fileApi";
import { queryKeys } from "../../../../enums/queryKeys";

export type File = {
  id: string,
  file_name: string,
  file_size: number,
  file_type: string,
  created_at: Date
}

const useGetFiles = () => {

  return useQuery<File[], any>({
    queryFn: () => getFIles(),
    queryKey: queryKeys.files,
  });
};

export default useGetFiles;
