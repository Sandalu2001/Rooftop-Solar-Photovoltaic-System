import {
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  alpha,
} from "@mui/material";
import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import { CustomTextFieldProps } from "../../types/componentInterfaces";
import { useField } from "formik";

const CustomTextField = ({
  label,
  name,
  value,
  helperText,
  error,
  id,
  type,
  onChange,
  startIcon,
  endIcon,
}: CustomTextFieldProps) => {
  return (
    <Stack gap={2}>
      <Typography variant="h6" color={"GrayText"}>
        {label}
      </Typography>

      <TextField
        label={label}
        name={name}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        id={id}
        type={type}
        fullWidth
        sx={{
          "& legend": { display: "none" },
          "& .MuiInputLabel-root": {
            display: "none",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            p: 0,
            background: (theme) => alpha(theme.palette.grey[500], 0.1),
          },
        }}
        InputProps={{
          sx: {
            borderRadius: 3,
          },
          startAdornment: (
            <InputAdornment position="start">{startIcon}</InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">{endIcon}</InputAdornment>
          ),
        }}
      />
    </Stack>
  );
};

export default CustomTextField;
