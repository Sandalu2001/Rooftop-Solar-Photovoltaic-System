import { Grid, TextField, Typography } from "@mui/material";
import { CustomFormFieldProps } from "../../types/componentInterfaces";

const CustomFormField = ({
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  type,
  disabled,
}: CustomFormFieldProps) => {
  return (
    <>
      <Grid size={4}>
        <Typography variant="h6" color={"GrayText"}>
          {label}
        </Typography>
      </Grid>
      <Grid size={8}>
        <TextField
          required
          id={name}
          name={name}
          size="small"
          type={type}
          helperText={helperText}
          onChange={onChange}
          onBlur={onBlur}
          error={error}
          disabled={disabled}
          value={value}
          fullWidth
          sx={{
            "& legend": { display: "none" },
            "& .MuiInputLabel-root": {
              display: "none",
            },
            borderSize: 2,
          }}
          InputProps={{
            sx: { borderRadius: 2 },
          }}
        />
      </Grid>
    </>
  );
};

export default CustomFormField;
