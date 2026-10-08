import { useTranslation } from "react-i18next";
import { translations } from "../../../i18n";

function VideoPage() {
    const { t } = useTranslation();
    return (
        <div>{t(translations.videoPage.title)}</div>
    )
}

export default VideoPage
