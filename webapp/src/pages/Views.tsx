import React, { lazy } from "react";
const cashierPanel = lazy(() => import("./cashier-dashboard/CashierPanel"));
const inventoryPanel = lazy(() => import("./product-inventory/InventoryPanel"));
const analyticsPanel = lazy(
  () => import("./analytics-dashboard/InventoryPanel")
);
const userAdminPanel = lazy(() => import("./tool/Tool"));

export const View = {
  cashierPanel,
  inventoryPanel,
  analyticsPanel,
  userAdminPanel,
};
