import {
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CashierTable from "../../../components/table/CashierDashboardTable";
import SearchIcon from "@mui/icons-material/Search";

const ProductOverView = () => {
  return (
    <Paper
      variant="outlined"
      sx={{
        flex: 4,
        width: "100%",
        height: "100%",
        border: "none",
        p: 4,
        borderRadius: 3,
      }}
    >
      <Stack sx={{ height: "100%" }}>
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Product Overview
          </Typography>
          <TextField
            variant="outlined"
            label="Search Product"
            sx={{
              width: "60%",
            }}
            InputProps={{
              sx: { borderRadius: 15, bgcolor: "background.default" },
              endAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        {/* <CashierTable /> */}
      </Stack>
    </Paper>
  );
};

export default ProductOverView;
