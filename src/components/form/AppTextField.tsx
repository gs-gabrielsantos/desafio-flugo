import { TextField, TextFieldProps } from "@mui/material";

type AppTextFieldProps = Omit<TextFieldProps, "variant"> & {
    height?: number;
    radius?: number | string;
    borderColor?: string;
    hoverBorderColor?: string;
    focusBorderColor?: string;
    borderWidth?: number;
};

export function AppTextField({
    sx,
    height = 64,
    radius = "10px",
    borderColor = "#D1D5DB",
    hoverBorderColor = "#9CA3AF",
    focusBorderColor = "#9CA3AF",
    borderWidth = 1,
    error,
    InputLabelProps,
    ...props
}: AppTextFieldProps) {
    const isError = Boolean(error);

    const finalBorder = isError ? "#DC2626" : borderColor;
    const finalHover = isError ? "#DC2626" : hoverBorderColor;
    const finalFocus = isError ? "#DC2626" : focusBorderColor;

    return (
        <TextField
            fullWidth
            variant="outlined"
            error={isError}
            InputLabelProps={{
                sx: { fontWeight: 600, ...(InputLabelProps?.sx as any) },
                ...InputLabelProps,
            }}
            {...props}
            sx={{
                "& .MuiOutlinedInput-root": {
                    height,
                    borderRadius: radius,
                    bgcolor: "#FFFFFF",
                    fontSize: 18,
                    "& fieldset": {
                        borderColor: finalBorder,
                        borderWidth,
                    },
                    "&:hover fieldset": {
                        borderColor: finalHover,
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: finalFocus,
                    },
                },
                "& .MuiFormHelperText-root": {
                    fontWeight: 600,
                },
                ...sx,
            }}
        />
    );
}