import { Box, Button, CircularProgress, DialogContentText, LinearProgress, Stack, Typography } from '@mui/material'
import { dialog } from '../Dialog/dialogStore'
import { translations } from '../../../i18n'
import Icon, { IconsEnum } from '../Icons/Icon'
import InputComponent from '../inputComponent/InputComponent'
import { useRef, useState } from 'react'
import useGetFiles from '../../api/hooks/tanstack/files/useGetFiles'
import { useUploadFile } from '../../api/hooks/tanstack/files/useUploadFile'
import { useTranslation } from 'react-i18next'
import { Files } from './Files'
import useResetFiles from '../../api/hooks/tanstack/files/useResetFiles'

// PDF plus the image formats the backend accepts.
const ACCEPTED_FILE_TYPES = "application/pdf,image/png,image/jpeg,image/gif,image/webp"

type FileManagementProps = {
    isDragging: boolean
}

type DropZoneProps = {
    isDragging: boolean,
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void,
    onFilesSelected: (files: File[]) => void,
    isPending: boolean,
    uploadProgress: number
}
function DropZone({ isDragging, handleDrop, onFilesSelected, isPending, uploadProgress }: DropZoneProps) {
    const { t } = useTranslation()
    const inputRef = useRef<HTMLInputElement>(null)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? [])
        if (selected.length > 0) {
            onFilesSelected(selected)
        }
        // Reset so selecting the same file again still fires onChange.
        e.target.value = ""
    }

    return <Box
        onDrop={handleDrop}
        className={`
            h-60
            transition-all duration-200
            ${isDragging ? "bg-blue-50 border-blue-400" : ""}
            border-2 border-dashed rounded-lg
            flex justify-center items-center
            flex-col gap-2`}>
        {isPending
            ?
            <Box className="w-2/3 flex flex-col items-center gap-2">
                <Typography variant="caption" color="text.secondary">
                    {t(translations.filesPage.uploading, { percent: uploadProgress })}
                </Typography>
                <Box className="w-full">
                    <LinearProgress variant="determinate" value={uploadProgress} />
                </Box>
            </Box>
            :
            <>
                <Icon iconName={IconsEnum.PDF} size={100} />
                {t(translations.filesPage.dragFile)}
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={ACCEPTED_FILE_TYPES}
                    className="hidden"
                    onChange={handleInputChange}
                />
                <Button variant="outlined" onClick={() => inputRef.current?.click()}>
                    {t(translations.filesPage.addDocuments)}
                </Button>
            </>
        }
    </Box>
}

export default function FileManagement({ isDragging }: FileManagementProps) {
    const { t } = useTranslation()
    const [search, setSearch] = useState("")

    const handleSearch = (value: string) => {
        setSearch(value)
    }

    const { data: files = [], isLoading, isPending: filesPending } = useGetFiles();
    const { mutateAsync: uploadFilesMutation, isPending, uploadProgress } = useUploadFile();
    const { mutateAsync: resetFiles, isPending: resetFilesPending } = useResetFiles();

    const handleClearFiles = () => {
        dialog.show({
            title: t(translations.filesPage.clearAllTitle),
            content: (
                <DialogContentText>
                    {t(translations.filesPage.clearAllConfirm)}
                </DialogContentText>
            ),
            submitLabel: t(translations.filesPage.clearFiles),
            submitColor: "error",
            onSubmit: () => resetFiles(),
        });
    };
    // Send the whole selection in one request; the backend embeds each file in
    // the background.
    const uploadFiles = async (files: File[]) => {
        await uploadFilesMutation(files);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await uploadFiles(files);
        }
    };

    return (
        <Box className="flex flex-col gap-5">
            <InputComponent
                value={search}
                onChange={(value) => handleSearch(value)}
            />
            <Button
                disabled={resetFilesPending}
                onClick={handleClearFiles}
            >
                {resetFilesPending ? <CircularProgress /> : t(translations.filesPage.clearFiles)}
            </Button>
            <DropZone
                isPending={isPending}
                uploadProgress={uploadProgress}
                isDragging={isDragging}
                handleDrop={(e: React.DragEvent<HTMLDivElement>) => { handleDrop(e) }}
                onFilesSelected={uploadFiles} />
            <Stack
                direction="column"
            >
                <Typography variant="h6" className='text-center' >{t(translations.filesPage.recentFiles)}</Typography>
                <Stack direction="column" className='h-80 overflow-y-auto'>
                    <Files files={files} isLoading={isLoading || filesPending} />
                </Stack>
            </Stack>
        </Box>
    )
}
