import { Stack, Typography, alpha } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { useState } from "react";
import e from "express";

interface BasicDataCardInterface {
  color: "inherit" | "dark";
  title: string;
  subTitle: string;
}

const BasicDataCard = ({ color, title, subTitle }: BasicDataCardInterface) => {
  return (
    <Stack gap={2} flex={1}>
      <Stack
        sx={{
          background:
            color == "dark"
              ? (theme) => theme.palette.secondary.main
              : "inherit",
          height: "100%",
          borderRadius: 3,
          p: 3,
          minHeight: 250,
          border: 1,
          borderColor:
            color == "dark"
              ? (theme) => theme.palette.secondary.main
              : "GrayText",
        }}
      >
        <Stack gap={2}>
          <Typography
            variant="h5"
            fontWeight={600}
            color={color == "dark" ? "white" : "inherit"}
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

export default BasicDataCard;
