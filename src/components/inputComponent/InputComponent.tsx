import { TextField, type TextFieldVariants } from '@mui/material'
import React, { useState } from 'react'
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { matchHotkey } from './helper';

type InputComponentProps = {
    value: string
    onChange: (value: string) => void
    label?: string
    type?: string
    helperText?: string
    variant?: InputComponentVariantType
    error?: boolean
    frontIcon?: React.ReactNode,
    endIcon?: React.ReactNode,
    classNames?: string,
    isDisabled?: boolean
    isTextAria?: boolean
    onKeyDown?: () => void
    hotKey?: string
    onDropHandler?: (e: React.DragEvent<HTMLDivElement>) => void
    placeholder?: string
    onBlur?: () => void,
    inputRef?: React.Ref<HTMLInputElement>
}

export const InputComponentEnum = {
    TEXT: "text",
    PASSWORD: "password",
    EMAIL: "email"
}

export type InputComponentType = typeof InputComponentEnum[keyof typeof InputComponentEnum]

export const InputComponentVariantsEnum = {
    FILLED: "filled",
    OUTLINE: "outlined",
    STANDARD: "standard"
}

export type InputComponentVariantType = typeof InputComponentVariantsEnum[keyof typeof InputComponentVariantsEnum]

function InputComponent({
    value,
    onChange,
    label,
    type = InputComponentEnum.TEXT,
    helperText,
    variant = InputComponentVariantsEnum.OUTLINE,
    error,
    frontIcon,
    endIcon,
    classNames,
    isDisabled,
    isTextAria = false,
    onKeyDown,
    hotKey,
    onDropHandler,
    placeholder,
    onBlur,
    inputRef
}: InputComponentProps) {
    const [inputType, setInputType] = useState(type)

    function handleInputType(type: InputComponentType) {
        setInputType(type)
    }

    return (

        <TextField
            inputRef={inputRef}
            onKeyDown={(e) => {
                if (matchHotkey(e, hotKey!)) {
                    e.preventDefault();
                    onKeyDown?.()
                }
            }}
            onDrop={(e) => { onDropHandler?.(e) }}
            multiline={isTextAria}
            disabled={isDisabled}
            className={`w-full ${classNames}`}
            label={label}
            type={inputType}
            onChange={(e) => onChange(e.target.value)}
            value={value}
            helperText={helperText}
            variant={variant as TextFieldVariants}
            error={!!error}
            placeholder={placeholder}
            onBlur={onBlur}
            slotProps={{
                formHelperText: {
                    sx: {
                        color: error ? 'red' : 'gray',
                        fontSize: '0.875rem',
                        fontWeight: error ? 600 : 400,
                    },
                },
                ...(type === InputComponentEnum.PASSWORD && {
                    input: {
                        endAdornment:
                            inputType === InputComponentEnum.PASSWORD ? (
                                <BsEye
                                    tabIndex={0}
                                    cursor="pointer"
                                    onClick={() => handleInputType(InputComponentEnum.TEXT)}
                                />
                            ) : (
                                <BsEyeSlash
                                    tabIndex={0}
                                    cursor="pointer"
                                    onClick={() => handleInputType(InputComponentEnum.PASSWORD)}
                                />
                            ),
                        "aria-current": "true"
                    },
                }
                ),
                ...(frontIcon || endIcon) && {
                    input: {
                        ...(frontIcon && { startAdornment: frontIcon }),
                        ...(endIcon && { endAdornment: endIcon }),
                    }
                },
            }}
        />
    )
}

export default InputComponent