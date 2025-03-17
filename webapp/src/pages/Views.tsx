import React, { lazy } from "react";

const userAdminPanel = lazy(() => import("./tool/index"));
const mapIntegration = lazy(() => import("./tool/Map"));

export const View = {
  userAdminPanel,
  mapIntegration,
};
