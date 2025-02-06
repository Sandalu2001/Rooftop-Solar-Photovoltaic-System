import * as React from "react";
import { LineChart, lineElementClasses } from "@mui/x-charts/LineChart";
import {
  alpha,
  Chip,
  InputAdornment,
  Paper,
  Popper,
  PopperProps,
  Stack,
  styled,
  Theme,
  Tooltip,
  TooltipProps,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import { ChartsItemContentProps } from "@mui/x-charts";
import { worldElectricityProduction } from "../../../utils/datasets";

const RevenueOverView = () => {
  const [revenue, setRevenue] = React.useState(10343.34);
  const [revenuePrec, setRevenuePrec] = React.useState(5);
  const theme = useTheme();
  const myGradient1Color = theme.palette.primary.main;
  const myGradient2Color = theme.palette.success.main;
  const stackStrategy = {
    stack: "total",
    area: true,
    stackOffset: "none",
  } as const;

  const customize = {
    legend: { hidden: true },
    margin: { top: 5 },
    stackingOrder: "descending",
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        width: "100%",
        height: "100%",
        border: "none",
        pt: 2,
        paddingX: 2,
        pb: 0,
        flex: 4,
        borderRadius: 3,
      }}
    >
      <Stack sx={{ pb: 2 }} gap={1}>
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }} color={"GrayText"}>
            Revenue Overview
          </Typography>
          <Paper
            variant="outlined"
            sx={{ borderRadius: 2, width: 200, height: 30 }}
          ></Paper>
        </Stack>
        <Stack gap={0.4}>
          <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
            <Typography variant="h4">Rs {revenue}</Typography>
            <Chip
              sx={{
                borderRadius: 1.5,
                bgcolor: (theme) =>
                  alpha(
                    revenuePrec > 0
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    0.1
                  ),
              }}
              size="small"
              icon={
                revenuePrec > 0 ? (
                  <ArrowUpwardRoundedIcon fontSize="small" />
                ) : (
                  <ArrowDownwardRoundedIcon fontSize="small" />
                )
              }
              label={`${revenuePrec}%`}
              variant={"outlined"}
              color={revenuePrec > 0 ? "success" : "error"}
            />
          </Stack>
          <Typography variant="body1" color={"GrayText"}>
            VS RS {9055.23} last period
          </Typography>
        </Stack>
      </Stack>
      <LineChart
        height={195}
        xAxis={[
          {
            scaleType: "point",
            dataKey: "year",
            valueFormatter: (value) => {
              return value.toString();
            },
          },
        ]}
        grid={{ vertical: true }}
        series={[
          {
            id: "Germany",
            dataKey: "coal",
            color: "#3354F4",
            label: "Electricity from coal (TWh)",
            showMark: false,
            highlightScope: { highlight: "item", fade: "global" },
            ...stackStrategy,
          },
          {
            id: "France",
            dataKey: "gas",
            label: "Electricity from gas (TWh)",
            showMark: false,
            color: "#88D66C",
            highlightScope: { highlight: "item" },
            ...stackStrategy,
          },
        ]}
        dataset={worldElectricityProduction}
        {...customize}
        sx={{
          "& .MuiLineElement-root": {
            strokeWidth: 1,
          },
          "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel": {
            color: ["red"],
          },
          "& .MuiAreaElement-series-Germany": {
            fill: "url('#myGradient1')",
          },
          "& .MuiAreaElement-series-France": {
            fill: "url('#myGradient2')",
          },

          "& .MuiChartsAxis-root .MuiChartsAxis-line": {
            stroke: "GrayText",
            strokeWidth: 0.5,
          },
          "& .MuiChartsAxis-root .MuiChartsAxis-tickLabel": {
            fill: "GrayText",
          },

          " .MuiChartsAxis-root .MuiChartsAxis-tickContainer .MuiChartsAxis-tick":
            {
              display: "none",
            },
        }}
      >
        <defs>
          <linearGradient id="myGradient1" gradientTransform="rotate(70)">
            <stop offset="0%" stopColor={myGradient1Color} />
            <stop offset="70%" stopColor="#fff" />
          </linearGradient>

          <linearGradient id="myGradient2" gradientTransform="rotate(70)">
            <stop offset="0%" stopColor={myGradient2Color} />
            <stop offset="70%" stopColor="#fff" />
          </linearGradient>
        </defs>
      </LineChart>
    </Paper>
  );
};

export default RevenueOverView;

export const keyToLabel: { [key: string]: string } = {
  coal: "Electricity from coal (TWh)",
  gas: "Electricity from gas (TWh)",
};

const ChartsTooltipRoot = styled(Tooltip, {
  name: "MuiChartsTooltip",
  slot: "Root",
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  pointerEvents: "none",
  background: "red",
  zIndex: theme.zIndex.modal,
}));
