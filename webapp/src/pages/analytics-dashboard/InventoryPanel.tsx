import { Box, Paper, Typography, alpha, Stack } from "@mui/material";
import BasicInfoView from "./components/BasicInfoView";
import ProductView from "./components/TopSellingProductsView";
import TotalOrderView from "./components/TotalOrderview";
import React from "react";
import SuppliersOverview from "./components/SuppliersOverview";
import RevenueOverview from "./components/RevenueOverview";
import BasicInfoCard from "./components/BasicInfoCard";

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
        flex={4}
        gap={3}
        sx={{
          height: "100%",
        }}
      >
        <Stack
          flexDirection={"row"}
          flex={1.05}
          gap={2}
          sx={{
            height: "100%",
            overflow: "auto",
          }}
        >
          <BasicInfoCard />
          <ProductView />
        </Stack>

        <Stack
          flexDirection={"row"}
          flex={1}
          gap={2}
          sx={{
            height: "100%",
            overflow: "hidden",
          }}
        >
          <RevenueOverview />
          <BasicInfoCard />
        </Stack>
      </Stack>

      <Stack
        flex={2}
        gap={3}
        sx={{
          height: "100%",
        }}
      >
        <TotalOrderView />
        <SuppliersOverview />
      </Stack>
    </Stack>
  );
};

export default CashierPanel;
