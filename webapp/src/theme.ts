import { Theme, alpha, createTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import type {} from "@mui/x-data-grid-pro/themeAugmentation";
import { borderRadius, lineHeight } from "@mui/system";
// import "./App.css";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0F6A58",
    },
    secondary: {
      main: "#01191E",
    },
    info: {
      main: "#FFF",
    },
    error: {
      main: "#D35D6E",
    },
    success: {
      main: "#4caf50",
    },
    warning: {
      main: "#EFB495",
    },
    background: {
      paper: "#F1F2F6",
      default: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: ["Montserrat", "Poppins", "MuseoModerno"].join(","),
    fontSize: 10,
    h1: {
      fontSize: 70,
    },
    h2: {
      fontSize: 50,
    },

    body1: {
      fontWeight: 500,
      fontSize: 14,
    },
    body2: {
      fontWeight: 500,
      fontSize: 12,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          background: "#E55800",
          "&:hover": {
            backgroundColor: "#db5807",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": {
            size: "small",
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(5px)",
        },
        paper: {
          width: "90vw",
          borderRadius: 4,
          maxHeight: "90vh",
          "& .MuiDialogTitle-root": {
            fontWeight: "bold",
          },
        },
      },
    },

    MuiDataGrid: {
      styleOverrides: {
        root: {
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
        },
        columnHeader: {
          mb: 2,
          minHeight: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      },
    },
  },
});
