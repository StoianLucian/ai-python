import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../enums/queryKeys";
import { previewFile } from "../../../fileApi";

const usePreviewFile = (id?: string, enabled = true) => {
    const query = useQuery({
        queryKey: queryKeys.file(id!),
        queryFn: () => previewFile(id!),
        enabled: enabled && !!Number(id)
    });

    return query
};

export default usePreviewFile;
