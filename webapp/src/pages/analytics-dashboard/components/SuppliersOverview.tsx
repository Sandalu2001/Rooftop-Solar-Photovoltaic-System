import {
  Box,
  Paper,
  Typography,
  alpha,
  Stack,
  TextField,
  InputAdornment,
  useTheme,
} from "@mui/material";
import React from "react";
import EmployeeInfoCard from "./EmployeeInfoCard";
import SearchIcon from "@mui/icons-material/Search";
import { BarChart, ChartsReferenceLine, PieChart } from "@mui/x-charts";
import { suppliersData } from "../../../utils/datasets";

const SuppliersView = () => {
  const theme = useTheme();
  const barChartColor = alpha(theme.palette.primary.main, 0.5);
  const valueFormatter = (value: number | null) => `${value}`;
  const chartSetting = {
    // xAxis: [
    //   {
    //     dataKey: "totalSpent",
    //   },
    // ],
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        flex: 1,
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: 3,
        p: 1,
      }}
    >
      <Stack
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ mt: 2, marginX: 2 }}
      >
        <Typography variant="h6" fontWeight={600} color={"GrayText"}>
          Suppliers Overview
        </Typography>
      </Stack>

      <PieChart
        series={[
          {
            data: [...suppliersData],
            innerRadius: 60,
            outerRadius: 100,
            paddingAngle: 3,
            cornerRadius: 5,
          },
        ]}
      />

      {/* <BarChart
        borderRadius={6}
        dataset={suppliersData}
        layout="horizontal"
        yAxis={[
          {
            scaleType: "band",
            dataKey: "supplierName",
            tickPlacement: "middle",

            colorMap: {
              type: "ordinal",
              colors: [barChartColor],
            },
          },
        ]}
        axisHighlight={{
          x: "none",
          y: "line",
        }}
        series={[
          {
            highlightScope: { highlight: "item", fade: "global" },
            dataKey: "totalSpent",
            valueFormatter,
          },
        ]}
        sx={{
          display: "flex",
          position: "relative",
          left: 10,
          width: "100%", // Responsive width
          maxWidth: "800px", // Optional: max width
          paddingRight: "20px",
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
            ml: 300,
            textAnchor: "end", // Adjust label anchor
            alignmentBaseline: "middle",
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
      ></BarChart> */}
    </Paper>
  );
};

export default SuppliersView;
