import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";

const AnalyticsTable = () => {
  const columns: GridColDef[] = [
    {
      field: "productName",
      headerName: "ProductName",
      flex: 1,
      headerAlign: "left",
      align: "left",
    },

    {
      field: "sellingPrice",
      headerName: "Selling Price",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "stocks",
      headerName: "Stocks",
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      headerAlign: "center",
      align: "center",
      width: 150,
      editable: false,
      renderCell: (params) => {
        const isRejected = params.value === "Rejected";
        return (
          <Chip
            sx={{
              minWidth: 80,
              border: "none",
              borderRadius: 2,
              bgcolor: (theme) =>
                alpha(
                  params.value === "Low"
                    ? theme.palette.warning.main
                    : params.value === "Out of Stock"
                    ? theme.palette.error.main
                    : theme.palette.success.main,
                  0.3
                ),
            }}
            size="small"
            icon={
              params.value === "Low" ? (
                <WarningIcon />
              ) : params.value === "Out of Stock" ? (
                <ErrorIcon />
              ) : (
                <CheckIcon />
              )
            }
            label={params.value}
            variant={"outlined"}
            color={
              params.value === "Low"
                ? "warning"
                : params.value === "Out of Stock"
                ? "error"
                : "success"
            }
          />
        );
      },
    },
    {
      field: "earnings",
      headerName: "Earnings",
      flex: 1,
      headerAlign: "center",
      align: "center",
      width: 200,
      editable: false,
      renderCell: (params) => {
        return (
          <>
            <Stack
              flexDirection={"row"}
              gap={1.5}
              height={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Typography fontSize={12} fontWeight={600}>
                {params.value
                  ? params.value.totalEarnings
                      .toFixed(2)
                      .toString()
                      .padStart(5, "0")
                  : "0".toString().padStart(5, "0")}
              </Typography>
              <Typography
                variant="body1"
                fontWeight={600}
                color={
                  params.value
                    ? params.value.precentage > 0
                      ? "success.main"
                      : "error.main"
                    : "primary.main"
                }
              >
                {params.value
                  ? params.value.precentage > 0
                    ? "+ "
                    : "- "
                  : "+ "}
                {params.value ? params.value.precentage : 0}%
              </Typography>
            </Stack>
          </>
        );
      },
    },
  ];

  const rows = [
    {
      id: 134343,
      productName: "Coca Cola",
      buyingPrice: 33,
      sellingPrice: 35,
      status: "Low",
      stocks: 54,
      earnings: { totalEarnings: 1000, precentage: 10 },
    },
    {
      id: 134344,
      productName: "Pepsi",
      buyingPrice: 31,
      sellingPrice: 34,
      status: "In Stock",
      stocks: 120,
      earnings: { totalEarnings: 1200, precentage: -5 },
    },
    {
      id: 134345,
      productName: "Sprite",
      buyingPrice: 29,
      sellingPrice: 32,
      status: "Low",
      stocks: 45,
      earnings: { totalEarnings: 800, precentage: 5 },
    },
    {
      id: 134346,
      productName: "Mountain Dew",
      buyingPrice: 30,
      sellingPrice: 33,
      status: "Out of Stock",
      stocks: 0,
      earnings: { totalEarnings: 0, precentage: 0 },
    },
    {
      id: 134347,
      productName: "Fanta",
      buyingPrice: 32,
      sellingPrice: 36,
      status: "In Stock",
      stocks: 78,
      earnings: { totalEarnings: 1500, precentage: 15 },
    },
    {
      id: 134348,
      productName: "Dr Pepper",
      buyingPrice: 35,
      sellingPrice: 38,
      status: "In Stock",
      stocks: 60,
      earnings: { totalEarnings: 2000, precentage: 20 },
    },
    {
      id: 134349,
      productName: "7 Up",
      buyingPrice: 28,
      sellingPrice: 30,
      status: "Low",
      stocks: 25,
      earnings: { totalEarnings: 500, precentage: -10 },
    },
    {
      id: 134350,
      productName: "Ginger Ale",
      buyingPrice: 34,
      sellingPrice: 37,
      status: "In Stock",
      stocks: 88,
      earnings: { totalEarnings: 2500, precentage: 25 },
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%", mt: 2, overflow: "auto" }}>
      <DataGrid
        sx={{
          "& .MuiDataGrid-cell": {
            fontSize: 12,
          },
          ".MuiDataGrid-columnHeaderTitle": {
            fontSize: 12,
            fontWeight: "bold",
          },
          "& .MuiDataGrid-columnHeader": {
            background: "none",
            fontWeight: "bold",
            borderRadius: 0,
            minHeight: 0,
          },
          ".MuiDataGrid-columnHeaders ": {
            p: 0,
          },
        }}
        rows={rows}
        columns={columns}
        autosizeOnMount
        disableRowSelectionOnClick
        hideFooter
      />
    </Box>
  );
};

export default AnalyticsTable;
