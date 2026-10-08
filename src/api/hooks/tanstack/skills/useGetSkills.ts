import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../../../enums/queryKeys";
import { getSkills } from "../../../skillsApi";

export type Skill = {
    id: string,
    name: string
    key: string
}

const useGetSkills = (search: string) => {
    return useQuery<Skill[], any>({
        queryFn: () => getSkills(search),
        queryKey: queryKeys.skills(search)
    });
};

export default useGetSkills;

