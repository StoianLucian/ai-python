import { useTranslation } from "react-i18next";
import { translations } from "../../../i18n";

function HomePage() {
    const { t } = useTranslation();
    return (
        <div>{t(translations.homePage.title)}</div>
    )
}

export default HomePage
