import { useMemo, useState } from "react";
import useGetUsers from "./tanstack/users/useGetUsers";
import useGetSkills from "./tanstack/skills/useGetSkills";
import { useDebounce } from "./debounce/useDebounce";

export const MENTION_TYPES = {
    USERS: "user-mention",
    SKILLS: "skill-mention",
} as const;



export type MentionType =
    (typeof MENTION_TYPES)[keyof typeof MENTION_TYPES];


export function useMentionItems() {
    const [search, setSearch] = useState("");
    const [mentionType, setMentionType] = useState<MentionType | null>(null)

    const debounce = useDebounce(search, 250)

    const { data: users = [], isPending: loadUsers } = useGetUsers(debounce);
    const { data: skills = [], isPending: loadSkills } = useGetSkills(debounce);

    const loading = loadUsers || loadSkills

    const items = useMemo(() => {
        switch (mentionType) {
            case MENTION_TYPES.USERS:
                return users.map(({ id, username, email }) => ({
                    id,
                    label: username,
                    slug: email
                }));

            case MENTION_TYPES.SKILLS:
                return skills.map(({ id, name, key }) => ({
                    id,
                    label: name,
                    slug: key
                }));

            default:
                return [];
        }
    }, [mentionType, users, skills,]);

    return { items, setSearch, setMentionType, mentionType, loading }
}