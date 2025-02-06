import React from "react";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import StackedLineChartRoundedIcon from "@mui/icons-material/StackedLineChartRounded";
import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Typography } from "@mui/material";
import { View } from "./pages/Views";

export const routes = [
  {
    tabTitle: "Cashier Dashboard",
    tabPath: "cashier-dashboard",
    icon: <HomeRoundedIcon fontSize="large" />,
    component: React.createElement(View.cashierPanel),
  },
  {
    tabTitle: "Sales History",
    tabPath: "history",
    icon: <RestoreRoundedIcon fontSize="large" />,
    component: <Typography>Sales History</Typography>,
  },
  {
    tabTitle: "Product Inventory",
    tabPath: "products",
    icon: <Inventory2RoundedIcon fontSize="large" />,
    component: React.createElement(View.inventoryPanel),
  },
  {
    tabTitle: "Analytics",
    tabPath: "analytics",
    icon: <StackedLineChartRoundedIcon fontSize="large" />,
    component: React.createElement(View.analyticsPanel),
  },
  {
    tabTitle: "User Admin",
    tabPath: "user-admin",
    icon: <AdminPanelSettingsIcon fontSize="large" />,
    component: React.createElement(View.userAdminPanel),
  },
];
