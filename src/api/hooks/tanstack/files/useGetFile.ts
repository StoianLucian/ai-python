import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getFile } from "../../../fileApi";
import { queryKeys } from "../../../../enums/queryKeys";



const useGetFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, filename }: { id: string; filename: string }) => getFile(id, filename),
    // The backend deletes the file record when it can't be found on disk, so a
    // failed download means the list is stale — refetch it to drop the ghost.
    onError: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.files });
    },
  });
};

export default useGetFile;
