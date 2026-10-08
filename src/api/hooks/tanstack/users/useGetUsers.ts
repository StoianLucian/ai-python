import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../enums/queryKeys";
import { getUsers } from "../../../userApi";

export type User = {
    id: string,
    username: string
    email: string
}

const useGetUsers = (search: string) => {

    return useQuery<User[], any>({
        queryFn: () => getUsers(search),
        queryKey: queryKeys.users(search),
    });
};

export default useGetUsers;
