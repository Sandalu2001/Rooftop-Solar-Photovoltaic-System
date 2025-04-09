import { alpha, IconButton } from "@mui/material";
import { JSX } from "react";

interface CustomIconButtonProps {
  color: "inherit" | "error" | "success" | "clicked";
  action: () => void;
  icon: JSX.Element;
}

const CustomIconButton = ({
  color,
  action,
  icon: Icon,
}: CustomIconButtonProps) => {
  return (
    <>
      <IconButton
        size="large"
        sx={{
          p: 0.8,
          borderRadius: 10,
          border: color == "inherit" ? 0 : 1,
          color:
            color == "error"
              ? (theme) => theme.palette.error.main
              : color == "success"
              ? (theme) => theme.palette.success.main
              : color == "clicked"
              ? "black"
              : "white",
          borderColor:
            color == "error"
              ? (theme) => theme.palette.error.main
              : color == "success"
              ? (theme) => theme.palette.success.main
              : color == "clicked"
              ? "black"
              : "white",
          background: color == "clicked" ? "white" : "transparent",
          "&:hover": {
            color: "white",
            background:
              color == "error"
                ? (theme) => theme.palette.error.main
                : color == "success"
                ? (theme) => theme.palette.success.main
                : (theme) => alpha(theme.palette.common.white, 0.05),
          },
        }}
        onClick={action}
      >
        {Icon}
      </IconButton>
    </>
  );
};

export default CustomIconButton;
