import {
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
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
      <Grid size={4}>
        <Typography variant="h6" color={"GrayText"}>
          {label}
        </Typography>
      </Grid>
      <Grid size={8}>
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
