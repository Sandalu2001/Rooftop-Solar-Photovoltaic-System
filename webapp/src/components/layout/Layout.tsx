import React, { Suspense, useEffect } from "react";
import { Box } from "@mui/material";
import NavBar from "../NavBar";
import { Outlet } from "react-router-dom";
import { APIService } from "../../utils/apiService";

const Layout = () => {
  useEffect(() => {
    new APIService();
  }, []);

  return (
    <Box className="Layout" sx={{ height: "100%" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Box sx={{ height: "100vh", paddingY: 8 }}>
          <NavBar />
          <Box sx={{ mt: 1 }}>
            <Outlet />
          </Box>
        </Box>
      </Suspense>
    </Box>
  );
};

export default Layout;
