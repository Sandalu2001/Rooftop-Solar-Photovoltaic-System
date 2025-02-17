import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import React, { useState } from "react";
import ItemCounter from "../../../components/common/ItemCounter";
import { EmployeeInfoCardProps } from "../../../types/componentInterfaces";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EmailIcon from "@mui/icons-material/Email";
import CallIcon from "@mui/icons-material/Call";
import WorkIcon from "@mui/icons-material/Work";
import CloseIcon from "@mui/icons-material/Close";
import StackedLineChartRoundedIcon from "@mui/icons-material/StackedLineChartRounded";

const EmployeeInfoCard = ({
  userName,
  userEmail,
  userPhoneNumber,
  branch,
}: EmployeeInfoCardProps) => {
  const [expand, setExpand] = useState(false);
  const toggleAccordion = () => {
    setExpand((prev) => !prev);
  };
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        "&.MuiAccordion-root:before": {
          backgroundColor: "transparent",
        },
        marginX: 1.5,
        p: 1.5,
        background: (theme) =>
          alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
          ),
      }}
    >
      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"flex-start"}
      >
        <Stack gap={2} flexDirection={"row"} alignItems={"center"}>
          <Avatar
            alt={userName.charAt(0)}
            sx={{ bgcolor: "primary.main", width: 50, height: 50 }}
          >
            {userName.charAt(0)}{" "}
          </Avatar>
          <Stack gap={0.4}>
            <Stack flexDirection={"row"} alignItems={"center"} gap={0.5}>
              <AccountCircleIcon fontSize="small" />
              <Typography fontWeight={600} variant={"body1"} fontSize={14}>
                {userName}
              </Typography>
            </Stack>

            <Stack flexDirection={"row"} alignItems={"center"} gap={0.5}>
              <EmailIcon fontSize="small" color={"primary"} />
              <Typography
                fontWeight={500}
                variant={"body2"}
                color={"primary.main"}
              >
                {userEmail}
              </Typography>
            </Stack>

            <Stack flexDirection={"row"} alignItems={"center"} gap={0.5}>
              <CallIcon fontSize="small" />
              <Typography variant={"body1"}>{userPhoneNumber}</Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack gap={1} flexDirection={"row"}>
          <IconButton
            size="small"
            sx={{
              borderRadius: 2,
              p: 0.3,
              border: 1,
              borderColor: "warning.main",
            }}
          >
            <EditIcon fontSize="small" color="warning" />
          </IconButton>

          <IconButton
            size="small"
            color="primary"
            sx={{
              border: 1,
              borderColor: "primary.main",
              borderRadius: 2,
              p: 0.3,
            }}
          >
            <StackedLineChartRoundedIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            color="error"
            sx={{
              borderRadius: 2,
              p: 0.3,
              border: 1,
              borderColor: "error.main",
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default EmployeeInfoCard;
