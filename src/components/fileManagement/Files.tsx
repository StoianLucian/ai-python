import { useTranslation } from "react-i18next";
import LoadingRows from "../LoadingRows/LoadingRows";
import { translations } from "../../../i18n";
import FileDetails from "../FileDetails/FileDetails";

import { type File } from '../../api/hooks/tanstack/files/useGetFiles'

type FileProps = {
    files: File[]
    isLoading: boolean
}
export function Files({ files, isLoading }: FileProps) {

    const { t } = useTranslation()
    if (isLoading) {
        return <LoadingRows rows={2 * files.length} />;
    }

    if (!files || files.length === 0) {
        return <p className="text-gray-500 text-center py-4">{t(translations.filesPage.noAvailableFiles)}</p>;
    }

    return (
        <>
            {files.map((file) => (
                <FileDetails key={file.id} file={file} />
            ))}
        </>
    );
}