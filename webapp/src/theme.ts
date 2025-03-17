import { Theme, alpha, createTheme } from "@mui/material/styles";
import { green } from "@mui/material/colors";
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
      fontSize: 59,
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
  },
});
