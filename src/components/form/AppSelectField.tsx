import {
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    SelectChangeEvent,
    SxProps,
    Theme,
} from "@mui/material";

type Option = { value: string; label: string };

type AppSelectFieldProps = {
    value: string;
    onChange: (value: string) => void;

    placeholder: string;
    options: Option[];

    error?: boolean;
    helperText?: string;

    height?: number;
    radius?: number | string;

    borderColor?: string;
    hoverBorderColor?: string;
    focusBorderColor?: string;

    sx?: SxProps<Theme>;
};

export function AppSelectField({
    value,
    onChange,
    placeholder,
    options,
    error,
    helperText = " ",
    height = 64,
    radius = "10px",
    borderColor = "#D1D5DB",
    hoverBorderColor = "#9CA3AF",
    focusBorderColor = "#9CA3AF",
    sx,
}: AppSelectFieldProps) {
    const isError = Boolean(error);

    const errorColor = "#DC2626";
    const textColor = "#111827";
    const placeholderColor = "#9CA3AF"; // <- igual ao placeholder do TextField
    const bgColor = "#FFFFFF";

    const finalBorder = isError ? errorColor : borderColor;
    const finalHover = isError ? errorColor : hoverBorderColor;
    const finalFocus = isError ? errorColor : focusBorderColor;

    function handleChange(e: SelectChangeEvent) {
        onChange(e.target.value as string);
    }

    return (
        <FormControl fullWidth error={isError} sx={sx}>
            <Select
                displayEmpty
                value={value}
                onChange={handleChange}
                renderValue={(selected) => {
                    if (!selected) {
                        return <span style={{ color: placeholderColor }}>{placeholder}</span>;
                    }
                    const item = options.find((o) => o.value === selected);
                    return item?.label ?? placeholder;
                }}
                sx={{
                    height,
                    borderRadius: radius,
                    bgcolor: bgColor,
                    "& .MuiSelect-select": {
                        color: value ? textColor : placeholderColor,
                        fontSize: 18,
                        display: "flex",
                        alignItems: "center",
                    },
                    "& .MuiSelect-icon": {
                        color: placeholderColor, // seta igual ao placeholder
                    },
                    "& fieldset": { borderColor: finalBorder },
                    "&:hover fieldset": { borderColor: finalHover },
                    "&.Mui-focused fieldset": { borderColor: finalFocus },
                }}
            >
                <MenuItem value="" disabled>
                    {placeholder}
                </MenuItem>

                {options.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                        {o.label}
                    </MenuItem>
                ))}
            </Select>

            <FormHelperText sx={{ fontWeight: 600 }}>{helperText}</FormHelperText>
        </FormControl>
    );
}