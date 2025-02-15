import { IconButton, Paper } from "@mui/material";
import { Box, alpha } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import React from "react";
import { ItemCounterProps } from "../../types/componentInterfaces";

const ItemCounter = ({
  noOfItems,
  addItems,
  removeItems,
}: ItemCounterProps) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        border: "none",
        p: 0.2,
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1.5,
        background: "none",
        borderRadius: 10,
      }}
    >
      <IconButton
        size="small"
        sx={{
          background: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity
            ),
          borderRadius: 2,
        }}
        onClick={removeItems}
      >
        <RemoveIcon />
      </IconButton>
      {noOfItems}
      <IconButton
        size="small"
        sx={{
          background: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity
            ),
          borderRadius: 2,
        }}
        onClick={addItems}
      >
        <AddIcon />
      </IconButton>
    </Paper>
  );
};

export default ItemCounter;
