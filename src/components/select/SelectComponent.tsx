import { Box, CircularProgress, Input, MenuItem, Select } from "@mui/material";
import { type Dispatch, type ReactNode, type SetStateAction } from "react";

type Option = {
    name: string;
    thinking?: boolean;
    [key: string]: string | boolean | undefined;
};

type SelectProps<V extends string = string> = {
    options: Option[];
    onChange: Dispatch<SetStateAction<V>>;
    value: V;
    itemKey?: string;
    isLoading: boolean;
    label?: (option: Option) => ReactNode;
    renderValue?: (value: V) => ReactNode;
    variant?: "outlined" | "standard" | "filled";
    disableUnderline?: boolean;
    loadingSize?: number;
    className?: string;
};

export default function SelectComponent<V extends string = string>({ options, onChange, value, itemKey = "id", isLoading, label = (option) => option.name, renderValue, variant, disableUnderline, loadingSize = 50, className }: SelectProps<V>) {

    return (
        <Box className={className}>
            {isLoading
                ?
                <CircularProgress size={loadingSize} />
                :
                <Select
                    className="w-full"
                    variant={variant}
                    input={disableUnderline ? <Input disableUnderline /> : undefined}
                    renderValue={renderValue ? (v) => renderValue(v as V) : undefined}
                    value={value}
                    onChange={(e) => {
                        const newValue = e.target.value as V;
                        onChange(newValue);
                    }}
                >
                    {options.map((option) => (
                        <MenuItem key={option[itemKey] as string} value={option[itemKey] as string}>
                            {label(option)}
                        </MenuItem>
                    ))}
                </Select>}
        </Box>
    );
}