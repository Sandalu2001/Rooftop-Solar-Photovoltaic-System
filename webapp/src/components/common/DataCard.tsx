import { Stack, Typography, alpha } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { useState } from "react";
import e from "express";

interface DataCardInterface {
  color: "inherit" | "fade";
  title: string;
  subTitle: string;
}

const DataCard = ({ color, title, subTitle }: DataCardInterface) => {
  return (
    <Stack gap={2} flex={1}>
      <Stack
        sx={{
          background:
            color == "fade"
              ? (theme) => alpha(theme.palette.primary.main, 0.3)
              : "inherit",
          height: "100%",
          borderRadius: 3,
          p: 2,
          minHeight: 250,
        }}
      >
        <Stack gap={2}>
          <Typography
            variant="h5"
            fontWeight={600}
            color={"white"}
            textAlign={"left"}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            fontWeight={600}
            color={"GrayText"}
            textAlign={"left"}
          >
            {subTitle}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default DataCard;
