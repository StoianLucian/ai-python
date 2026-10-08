import { IconsEnum } from "../../components/Icons/Icon";

export const options = [
    { name: "deepseek-r1:1.5b", id: "deepseek-r1:1.5b" },
    { name: "qwen3:8b", id: "qwen3:8b" },
];

export function toggleIcon(bool: boolean) {
    return bool ? IconsEnum.COG : IconsEnum.ARROW
}