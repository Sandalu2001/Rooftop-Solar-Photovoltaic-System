import {
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { CustomFormSelectFieldProps } from "../../types/componentInterfaces";

const CustomFormSelectField = ({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  startIcon,
  endIcon,
  type,
  itemArray,
}: CustomFormSelectFieldProps) => {
  return (
    <>
      <Grid item xs={4}>
        <Typography variant="h6" color={"GrayText"}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <FormControl size="small" fullWidth required>
          <Select
            id={name}
            name={name}
            sx={{
              borderRadius: 2,
              "& legend": { display: "none" },
              "& .MuiInputLabel-root": {
                display: "none",
              },
              borderSize: 2,
            }}
            value={value}
            onChange={onChange}
            fullWidth
            error={error}
          >
            {itemArray.map((item: any, key: any) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText sx={{ color: (theme) => theme.palette.error.main }}>
            {helperText}
          </FormHelperText>
        </FormControl>
      </Grid>
    </>
  );
};

export default CustomFormSelectField;
