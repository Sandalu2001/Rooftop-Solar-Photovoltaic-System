import { alpha, Stack, Typography } from "@mui/material";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useAppSelector } from "../../../slices/store";

const DataTable = () => {
  const buildingAreas = useAppSelector((state) => state.solar.buildingAreas);

  const columns: GridColDef[] = [
    { field: "categoryId", headerName: "Building ID", flex: 1 },
    { field: "totalRooftopArea", headerName: "Total Area (m²)", flex: 1 },
    {
      field: "sunlitRooftopArea",
      headerName: "Sunlit Area (m²)",
      flex: 1,
      renderCell: (params: GridCellParams) => {
        const totalArea = params.row.totalRooftopArea as number;
        const sunLitPrecentage = params.row.sunLitPrecentage as number;
        return `${(totalArea * (sunLitPrecentage / 100)).toFixed(2)}`;
      },
    },
    {
      field: "shadowedRooftopArea",
      headerName: "Shadowed Area (m²)",
      flex: 1,
      renderCell: (params: GridCellParams) => {
        const totalArea = params.row.totalRooftopArea as number;
        const sunLitPrecentage = params.row.sunLitPrecentage as number;
        return `${(totalArea * ((100 - sunLitPrecentage) / 100)).toFixed(2)}`;
      },
    },
    {
      field: "sunLitPrecentage",
      headerName: "Sunlit Area (%)",
      flex: 1,
    },
    {
      field: "shadowedPercentage",
      headerName: "Shadowed Area (%)",
      flex: 1,
      renderCell: (params: GridCellParams) => {
        // Use valueGetter to calculate percentage
        const totalArea = params.row.totalRooftopArea as number;
        const sunLitPrecentage = params.row.sunLitPrecentage as number;
        if (totalArea === 0) return "0%";
        return `${(100 - sunLitPrecentage).toFixed(1)}%`;
      },
    },
  ];

  const rows = useMemo(
    () =>
      buildingAreas.map((area) => ({
        id: area.objectId,
        categoryId: area.objectId,
        totalRooftopArea: area.totalRooftopArea.toFixed(2),
        sunLitPrecentage: area.sunLitPrecentage.toFixed(2),
      })),
    [buildingAreas]
  );

  return (
    <Stack
      sx={{
        gap: 3,
        width: "100%",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        justifyItems: "center",
        mt: 10,
      }}
    >
      <Typography variant="h5" color={"GrayText"} sx={{ fontWeight: 600 }}>
        Building Areas
      </Typography>
      <div style={{ height: 300, width: "80%" }}>
        <DataGrid
          sx={{
            columnHeader: {
              mb: 2,
              minHeight: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            fontSize: 13,
            pb: 0,
            width: "100%",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "none",
            color: alpha("#000", 0.55),
            borderRadius: 0,
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "none",
            },
            ".MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader-within": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
            ".MuiDataGrid-row:focus": {
              borderRadius: 0,
            },
            ".MuiDataGrid-row:focus-within": {
              borderRadius: 0,
            },
            "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer":
              {
                display: "none",
              },
            ".MuiDataGrid-columnHeaderTitle": {
              fontSize: 13,
              fontWeight: "bold",
            },
            "& .MuiDataGrid-columnHeader": {
              background: "none",
              fontWeight: "bold",
              borderRadius: 0,
            },
            "& .MuiDataGrid-columnHeaderRow": {
              background: "none",
              fontWeight: "bold",
              borderRadius: 0,
            },
            "& .MuiDataGrid-columnHeader--withLeftBorder": {
              borderRadius: 10,
            },
            "& .MuiChartsContainer-root": {
              padding: 0, // Reduce chart container padding
              margin: 0, // Reduce chart container margin
            },
            "& .MuiChartsAxis-root": {
              padding: 0, // Reduce axis padding
            },
            "& .MuiChartsAxis-tickContainer": {
              margin: 0, // Reduce tick container margin
            },
          }}
          rows={rows}
          columns={columns}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      </div>
    </Stack>
  );
};

export default DataTable;
