import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resetFiles } from "../../../fileApi";
import { queryKeys } from "../../../../enums/queryKeys";



const useResetFiles = () => {
    const client = useQueryClient();
    return useMutation({
        mutationFn: () => resetFiles(),
        onSuccess() {
            client.invalidateQueries({ queryKey: queryKeys.files })
        }
    });
};

export default useResetFiles;
