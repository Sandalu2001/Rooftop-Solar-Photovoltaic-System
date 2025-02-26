import { Paper, Stack } from "@mui/material";
import React from "react";
import CustomIconButton from "./CustomIconButton";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/DeleteOutlineRounded";
import UndoIcon from "@mui/icons-material/UndoRounded";
import RedoIcon from "@mui/icons-material/RedoRounded";
import PolylineIcon from "@mui/icons-material/Polyline";

const ControlPanel = () => {
  return (
    <Stack
      sx={{
        gap: 1,
        flexDirection: "row",
        background: (theme) => theme.palette.secondary.main,
        borderRadius: 10,
        p: 0.3,
      }}
    >
      <CustomIconButton
        color="clicked"
        action={() => console.log("Done!")}
        icon={<PolylineIcon fontSize="large" />}
      />
      <CustomIconButton
        color="inherit"
        action={() => console.log("Done!")}
        icon={<UndoIcon fontSize="large" />}
      />
      <CustomIconButton
        color="inherit"
        action={() => console.log("Done!")}
        icon={<RedoIcon fontSize="large" />}
      />
      <CustomIconButton
        color="inherit"
        action={() => console.log("Done!")}
        icon={<DeleteIcon fontSize="large" />}
      />
    </Stack>
  );
};

export default ControlPanel;
