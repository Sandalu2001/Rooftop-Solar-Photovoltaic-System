import {
  Box,
  Paper,
  Typography,
  alpha,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import TopSellingProductsTable from "../../../components/table/AnalyticsDashboardTable";
import SearchIcon from "@mui/icons-material/Search";
import React from "react";

const TopSellingProductsView = () => {
  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        height: "100%",
        border: "none",
        overflow: "auto",
        p: 3,
        flex: 4,
        borderRadius: 3,
      }}
    >
      <Stack sx={{ height: "100%" }}>
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Top Selling Products
          </Typography>
          <TextField
            variant="outlined"
            label="Search Product"
            size="small"
            sx={{
              width: "30%",
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
        <TopSellingProductsTable />
      </Stack>
    </Paper>
  );
};

export default TopSellingProductsView;
