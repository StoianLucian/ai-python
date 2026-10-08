import { Box, Button, CircularProgress, DialogContentText, Stack, Typography } from '@mui/material'
import { dialog } from '../Dialog/dialogStore'
import { translations } from '../../../i18n'
import Icon, { IconsEnum } from '../Icons/Icon'
import InputComponent from '../inputComponent/InputComponent'
import { useState } from 'react'
import useGetFiles from '../../api/hooks/tanstack/files/useGetFiles'
import { useUploadFile } from '../../api/hooks/tanstack/files/useUploadFile'
import { useTranslation } from 'react-i18next'
import { Files } from './Files'
import useResetFiles from '../../api/hooks/tanstack/files/useResetFiles'

type FileManagementProps = {
    isDragging: boolean
}

type DropZoneProps = {
    isDragging: boolean,
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void,
    isPending: boolean
}
function DropZone({ isDragging, handleDrop, isPending }: DropZoneProps) {
    const { t } = useTranslation()
    return <Box
        onDrop={handleDrop}
        className={`
            h-60
            transition-all duration-200
            ${isDragging ? "bg-blue-50 border-blue-400" : ""}
            border-2 border-dashed rounded-lg
            flex justify-center items-center
            flex-col`}>
        {isPending
            ?
            <CircularProgress />
            :
            <>
                <Icon iconName={IconsEnum.PDF} size={100} />
                {t(translations.filesPage.dragFile)}
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
    const { mutateAsync: uploadFile, isPending } = useUploadFile();
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
    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            const response = await uploadFile(files[0]);
            console.log(response);
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
                isDragging={isDragging}
                handleDrop={(e: React.DragEvent<HTMLDivElement>) => { handleDrop(e) }} />
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
