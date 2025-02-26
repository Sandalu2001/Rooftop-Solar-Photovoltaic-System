import React, { lazy } from "react";

const userAdminPanel = lazy(() => import("./tool/Tool"));

export const View = {
  userAdminPanel,
};
