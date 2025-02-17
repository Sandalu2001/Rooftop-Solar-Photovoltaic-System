import {
  Box,
  Paper,
  Typography,
  alpha,
  Stack,
  Theme,
  useTheme,
  Chip,
} from "@mui/material";
import React from "react";
import SupplierInfoCard from "./SupplierInfoCard";
import { BarChart, ChartsReferenceLine } from "@mui/x-charts";
import {
  nuclearConsumptionData,
  worldElectricityProduction,
} from "../../../utils/datasets";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";

const TotalOrderview = () => {
  const theme = useTheme();
  const barChartColor = theme.palette.primary.main;
  const valueFormatter = (value: number | null) => `${value}`;
  const [order, setorder] = React.useState(1034);
  const [orderPrec, setorderPrec] = React.useState(5);

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        background: (theme) => theme.palette.background.default,
        flexGrow: 1, // Takes available space
        minHeight: "400px",
        border: "none",
      }}
    >
      <Stack
        sx={{ mt: 0 }}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Typography variant="h6" fontWeight={600} color={"GrayText"}>
          Total Orders
        </Typography>
        <Typography variant="body1" fontWeight={600} color={"GrayText"}>
          Last 30 days
        </Typography>
      </Stack>

      <BarChart
        borderRadius={6}
        dataset={nuclearConsumptionData}
        xAxis={[
          {
            scaleType: "band",
            dataKey: "date",
            tickPlacement: "middle",

            colorMap: {
              type: "ordinal",
              colors: [barChartColor],
            },
          },
        ]}
        axisHighlight={{
          x: "line",
          y: "none",
        }}
        yAxis={[{ max: 4000 }]}
        series={[
          {
            highlightScope: { highlight: "item", fade: "global" },
            dataKey: "nuclear",
            valueFormatter,
          },
        ]}
        sx={{
          "& .MuiLineElement-root": {
            strokeWidth: 2,
          },
          "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel": {
            color: ["red"],
          },
          "& .MuiAreaElement-series-Germany": {
            fill: "url('#myGradient')",
          },
          "& .MuiAreaElement-series-France": {
            fill: "url('#myGradient2')",
          },

          "& .MuiChartsAxis-root .MuiChartsAxis-line": {
            stroke: "GrayText",
            strokeWidth: 0,
          },
          "& .MuiChartsAxis-root .MuiChartsAxis-tickLabel": {
            fill: "GrayText",
          },
          "& .MuiChartsAxis-root .MuiChartsAxis-tickContainer .MuiChartsAxis-tick":
            {
              display: "none",
            },
          "& .MuiChartsAxisHighlight-root": {
            stroke: "GrayText",
            strokeWidth: 0.5,
          },
        }}
      >
        {" "}
        <ChartsReferenceLine
          x={
            nuclearConsumptionData[
              nuclearConsumptionData
                .map((d) => d.nuclear)
                .indexOf(
                  Math.max(...nuclearConsumptionData.map((d) => d.nuclear))
                )
            ].date
          }
          labelAlign="start"
          lineStyle={{ stroke: "red", strokeWidth: 1 }}
        />
        <ChartsReferenceLine
          y={Math.max(...nuclearConsumptionData.map((d) => d.nuclear))}
          lineStyle={{ stroke: "red" }}
          label="Max Order"
        />
      </BarChart>
    </Paper>
  );
};

export default TotalOrderview;
