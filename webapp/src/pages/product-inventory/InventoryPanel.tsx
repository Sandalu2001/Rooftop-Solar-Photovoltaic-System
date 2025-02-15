import { Box, Paper, Typography, alpha, Stack } from "@mui/material";
import BasicInfoView from "./components/basic-info/BasicInfoView";
import ProductView from "./components/product-info/ProductsView";
import SuppliersView from "./components/supplier-order-info/SuppliersView";
import React from "react";
import EmployeesView from "./components/EmployeeView";

const CashierPanel = () => {
  return (
    <Stack
      flexDirection={"row"}
      gap={3}
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <Stack
        flex={3}
        gap={3}
        sx={{
          height: "100%",
        }}
      >
        {/* <BasicInfoView /> */}
        <ProductView />
      </Stack>
      <Stack
        flex={1.5}
        gap={3}
        sx={{
          height: "100%",
        }}
      >
        <SuppliersView />
        {/* <EmployeesView /> */}
      </Stack>
    </Stack>
  );
};

export default CashierPanel;
