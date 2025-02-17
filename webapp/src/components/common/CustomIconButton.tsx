import { IconButton, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconComponent } from "@mui/icons-material";
import React from "react";

interface CustomIconButtonProps {
  color: "inhert" | "error" | "success";
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
        aria-label="delete"
        size="large"
        color={
          color == "error"
            ? "error"
            : color == "success"
            ? "success"
            : "inherit"
        }
        sx={{
          p: 0.8,
          borderRadius: 3,
          border: 1,
          borderColor:
            color == "error"
              ? (theme) => theme.palette.error.main
              : color == "success"
              ? (theme) => theme.palette.success.main
              : "inherit",
          "&:hover": {
            color: "white",
            background:
              color == "error"
                ? (theme) => theme.palette.error.main
                : color == "success"
                ? (theme) => theme.palette.success.main
                : "inherit",
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
