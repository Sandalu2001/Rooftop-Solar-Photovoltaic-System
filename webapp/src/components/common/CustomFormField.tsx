import { Grid, TextField, Typography } from "@mui/material";
import React from "react";
import { CustomFormFieldProps } from "../../types/componentInterfaces";

const CustomFormField = ({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  type,
}: CustomFormFieldProps) => {
  return (
    <>
      <Grid item xs={4}>
        <Typography variant="h6" color={"GrayText"}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <TextField
          required
          id={name}
          name={name}
          size="small"
          type={type}
          helperText={helperText}
          onChange={onChange}
          error={error}
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
