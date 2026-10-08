
import homeIcon from "../../assets/svgs/house_icon.svg";
import profileIcon from "../../assets/svgs/profile_icon.png";
import pdfIcon from "../../assets/svgs/pdf_icon.png";
import CogIcon from "../../assets/svgs/cogwheel_icon.png";
import ArrowIcon from "../../assets/svgs/arrow_icon.png";
import ChevronIcon from "../../assets/svgs/chevron_icon.png";
import DownloadIcon from "../../assets/svgs/download_icon.png";
import DotsIcon from "../../assets/svgs/three_dots_icon.png";
import RobotIcon from "../../assets/svgs/robot_icon.svg";


export const IconsEnum = {
    HOME: "home_icon",
    PROFILE: "profile_icon",
    PDF: "pdf_icon",
    COG: "cogwheel_icon",
    ARROW: "arrow_icon",
    CHEVRON: "chevron_icon",
    DOWNLOAD: "download_icon",
    DOTS: "three_dots_icon",
    ROBOT: "robot_icon"
}

export type IconsType = typeof IconsEnum[keyof typeof IconsEnum];

const srcMap: Record<IconsType, string> = {
    [IconsEnum.HOME]: homeIcon,
    [IconsEnum.PROFILE]: profileIcon,
    [IconsEnum.PDF]: pdfIcon,
    [IconsEnum.COG]: CogIcon,
    [IconsEnum.ARROW]: ArrowIcon,
    [IconsEnum.CHEVRON]: ChevronIcon,
    [IconsEnum.DOWNLOAD]: DownloadIcon,
    [IconsEnum.DOTS]: DotsIcon,
    [IconsEnum.ROBOT]: RobotIcon
};

type IconsProps = {
    iconName: IconsType
    size?: number
    className?: string
}

function Icon({ iconName = IconsEnum.HOME, size = 30, className }: IconsProps) {

    return <img className={`${className}`} style={{ height: size + "px", width: size + "px" }} src={srcMap[iconName]} alt={iconName} />;
}

export default Icon