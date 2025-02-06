import { Box, Paper, Typography, alpha, Stack } from "@mui/material";
import React from "react";
import ProductOverView from "./components/ProductOverView";
import CustomerOrderView from "./components/CustomerOrderView";

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
      <ProductOverView />
      {/* <CustomerOrderView /> */}
    </Stack>
  );
};

export default CashierPanel;
