import {
  Box,
  Paper,
  Typography,
  alpha,
  Stack,
  TextField,
  InputAdornment,
} from "@mui/material";
import React from "react";
import EmployeeInfoCard from "./EmployeeInfoCard";
import SearchIcon from "@mui/icons-material/Search";

const EmployeesView = () => {
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
          Employee Overview
        </Typography>
        <TextField
          variant="outlined"
          label="Search"
          size="small"
          sx={{
            width: 180,
          }}
          InputProps={{
            sx: { borderRadius: 15, bgcolor: "background.default" },
            endAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack
        sx={{
          maxHeight: 220,
          overflow: "auto",
        }}
      >
        <Stack sx={{ gap: 2, overflow: "auto" }}>
          <EmployeeInfoCard
            userName={"Sandalu De Silva"}
            userEmail={"exsample123@gmail.com"}
            userPhoneNumber={"07135845345"}
            branch={"Matara, Sri Lanka"}
          />

          <EmployeeInfoCard
            userName={"Sandalu De Silva"}
            userEmail={"exsample123@gmail.com"}
            userPhoneNumber={"07135845345"}
            branch={"Matara, Sri Lanka"}
          />

          <EmployeeInfoCard
            userName={"Sandalu De Silva"}
            userEmail={"exsample123@gmail.com"}
            userPhoneNumber={"07135845345"}
            branch={"Matara, Sri Lanka"}
          />

          <EmployeeInfoCard
            userName={"Sandalu De Silva"}
            userEmail={"exsample123@gmail.com"}
            userPhoneNumber={"07135845345"}
            branch={"Matara, Sri Lanka"}
          />
        </Stack>
      </Stack>
    </Paper>
  );
};

export default EmployeesView;
