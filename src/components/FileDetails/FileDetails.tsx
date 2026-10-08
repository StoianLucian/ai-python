import { Box, Button, Stack } from '@mui/material'
import useGetFile from '../../api/hooks/tanstack/files/useGetFile';
import Icon, { IconsEnum } from '../Icons/Icon';
import type { File } from '../../api/hooks/tanstack/files/useGetFiles';

type FileProps = {
    file: File
}

export default function FileDetails({ file }: FileProps) {

    const { mutateAsync: getFile } = useGetFile();
    const size = (file.file_size / 1000000).toFixed(2)
    return (
        <Stack direction="row" className="items-center rounded-2xl p-1.5 bg-[#FAF9F6] ring-1 ring-[#ECEAE4] m-2">
            <Icon iconName={IconsEnum.PDF} size={60} />
            <Box>
                <Box className="max-w-40 truncate" title={file.file_name}>
                    {file.file_name}
                </Box>
                <Stack direction="row">
                    <Box className="border-r-2 border-[#ECEAE4] pr-2 mr-2">{size} MB</Box>
                    <Box>{file.created_at.toString()}</Box>
                </Stack>

            </Box>

            <Button onClick={() => getFile({ id: file.id, filename: file.file_name })} >
                <Icon iconName={IconsEnum.DOWNLOAD} />
            </Button>
        </Stack>
    )
}
