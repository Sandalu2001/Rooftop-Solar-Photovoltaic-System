import { Box, Paper, Typography, alpha, Stack } from "@mui/material";
import BasicInfoCard from "./BasicInfoCard";
import React from "react";

const BasicInfoView = () => {
  return (
    <Stack
      flexDirection={"row"}
      sx={{
        flex: 1,
        gap: 3,
        width: "100%",
        height: "100%",
        border: "none",
      }}
    >
      <BasicInfoCard />
      <BasicInfoCard />
      <BasicInfoCard />
      <BasicInfoCard />
    </Stack>
  );
};

export default BasicInfoView;
