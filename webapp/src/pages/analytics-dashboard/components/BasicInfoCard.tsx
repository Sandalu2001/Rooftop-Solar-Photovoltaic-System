import { Stack, Typography, alpha } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { useState } from "react";
import BasicInfoPopper from "../../../components/popper/BasicInfoPopper";
import e from "express";

const DataCard = () => {
  const [monthlyScoreAnchorEl, setMonthlyScoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const [paymentMethodAnchorEl, setPaymentMethodAnchorEl] =
    useState<null | HTMLElement>(null);

  return (
    <Stack gap={2} flex={1}>
      <Stack
        sx={{
          background: (theme) => alpha(theme.palette.common.white, 1),
          height: "100%",
          borderRadius: 3,
          p: 2,
        }}
        onMouseMove={(event) => setMonthlyScoreAnchorEl(event.currentTarget)}
        onMouseOut={(event) => setMonthlyScoreAnchorEl(null)}
      >
        <Typography
          variant="body1"
          fontWeight={600}
          color={"GrayText"}
          textAlign={"center"}
        >
          Monthly Score
        </Typography>
        <Gauge
          value={75}
          startAngle={-110}
          endAngle={110}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 13,
              fontWeight: 600,
              transform: "translate(0px, -6px)",
            },
            [`& .${gaugeClasses.valueArc}`]: {
              ":hover": {
                fill: (theme) => theme.palette.success.dark,
                transition: "0.3s",
              },
              fill: (theme) => theme.palette.success.main,
            },
          }}
          text={({ value, valueMax }) => `${value} / ${valueMax}`}
        />
      </Stack>

      <Stack
        sx={{
          background: (theme) => theme.palette.common.white,

          height: "100%",
          borderRadius: 3,
          p: 2,
        }}
        onMouseMove={(event) => setPaymentMethodAnchorEl(event.currentTarget)}
        onMouseOut={(event) => setPaymentMethodAnchorEl(null)}
      >
        <Typography
          variant="body1"
          fontWeight={600}
          color={"GrayText"}
          textAlign={"center"}
        >
          Payment Method
        </Typography>
        <Gauge
          value={60}
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 12,
              fontWeight: 600,
            },
          }}
          text={({ value, valueMax }) => `${value} / ${valueMax}`}
        />
      </Stack>

      <BasicInfoPopper anchorEl={monthlyScoreAnchorEl} />

      <BasicInfoPopper anchorEl={paymentMethodAnchorEl} />
    </Stack>
  );
};

export default DataCard;
