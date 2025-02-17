import React from "react";
import { BasicInfoPopperProps } from "../../types/componentInterfaces";
import {
  Box,
  Button,
  Divider,
  Fade,
  Paper,
  Popper,
  Stack,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const BasicInfoPopper = ({ anchorEl }: BasicInfoPopperProps) => {
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;
  return (
    <Popper
      id={id}
      open={open}
      anchorEl={anchorEl}
      sx={{ zIndex: 10000 }}
      transition
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={100}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              mt: 1,
              minWidth: 200,
              boxShadow: 3,
            }}
          >
            <Stack
              sx={{
                gap: 1.2,
                overflow: "auto",
                minHeight: 50,
                p: 1,
              }}
            >
              <Stack
                flexDirection={"row"}
                gap={1}
                sx={{
                  alignItems: "center",
                }}
              >
                <AccountCircleIcon fontSize="large" />
                <Typography variant="h6" fontWeight={600}>
                  Account
                </Typography>
              </Stack>

              <Divider />
              <Stack
                flexDirection={"row"}
                gap={1}
                sx={{
                  alignItems: "center",
                }}
              >
                <LogoutIcon fontSize="large" />
                <Typography variant="h6" fontWeight={600}>
                  Sign Out
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Fade>
      )}
    </Popper>
  );
};

export default BasicInfoPopper;
