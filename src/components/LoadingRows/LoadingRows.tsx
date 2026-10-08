import { Skeleton } from '@mui/material'

type LoadingRowsType = {
    rows?: number
    height?: number
}

export default function LoadingRows({ rows = 1, height = 20 }: LoadingRowsType) {
    return (
        <>
            {Array.from({ length: rows }).map((_, index) => (
                <Skeleton
                    key={index}
                    variant="rectangular"
                    height={height}
                    className='my-2.5 w-full'
                />
            ))}
        </>

    )
}
