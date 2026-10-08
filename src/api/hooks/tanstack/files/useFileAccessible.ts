import { useQuery } from "@tanstack/react-query";
import { checkFileAccessible } from "../../../fileApi";
import { queryKeys } from "../../../../enums/queryKeys";

const useFileAccessible = (id: string) => {
    return useQuery({
        queryKey: [...queryKeys.file(id), "accessible"],
        queryFn: () => checkFileAccessible(id),
        enabled: !!Number(id),
        retry: false,
        staleTime: 30_000,
    });
};

export default useFileAccessible;
