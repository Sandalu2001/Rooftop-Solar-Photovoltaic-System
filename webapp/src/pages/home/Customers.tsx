import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Cover from "../../assets/images/login.jpg";
import DataCard from "../../components/common/DataCard";
import BasicDataCard from "../../components/common/BasicDataCard";

const Customers = () => {
  return (
    <Paper
      variant="outlined"
      sx={{
        background: (theme) => theme.palette.secondary.main,
        borderRadius: 8,
      }}
    >
      <Stack height={"100%"}>
        <Stack sx={{ p: 12, marginX: 8 }} gap={10}>
          <Stack gap={1}>
            <Typography variant="h2" color={"white"}>
              A Responsible
            </Typography>
            <Typography variant="h2" color={"white"}>
              Corporate Customers
            </Typography>
          </Stack>

          <Grid container rowSpacing={1} columnSpacing={4}>
            <Grid size={4}>
              <DataCard
                color={"inherit"}
                title="A Responsible Corparate"
                subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
              />
            </Grid>
            <Grid size={4}>
              <DataCard
                color={"fade"}
                title="A Responsible Corparate"
                subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
              />{" "}
            </Grid>
            <Grid size={4}>
              <DataCard
                color={"inherit"}
                title="A Responsible Corparate"
                subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
              />{" "}
            </Grid>
          </Grid>
        </Stack>
        <Stack
          sx={{
            borderRadius: 8,
            background: "white",
            marginX: 5,
            mb: 5,
          }}
        >
          <Stack sx={{ p: 12, marginX: 8 }} gap={10}>
            <Stack flexDirection={"row"}>
              <Stack gap={1} flex={5}>
                <Typography variant="h2">Electricity production </Typography>
                <Typography variant="h2"> in Sri Lanka </Typography>
              </Stack>
              <Stack gap={1} flex={3.5}>
                <Typography variant="h6" color={"primary"}>
                  SOLAR PANEL ENERGY{" "}
                </Typography>
                <Typography variant="body1">
                  {" "}
                  Renewable energy continues to contribute an increasing supply
                  of Sri Lanka’s electricity needs.In 2020,22.5% of Sri Lanka’s
                  electricity came from renewable sources{" "}
                </Typography>
              </Stack>
            </Stack>

            <Divider />

            <Grid container rowSpacing={1} columnSpacing={4}>
              <Grid size={3}>
                <BasicDataCard
                  color={"inherit"}
                  title="A Responsible Corparate"
                  subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
                />
              </Grid>
              <Grid size={3}>
                <BasicDataCard
                  color={"dark"}
                  title="A Responsible Corparate"
                  subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
                />{" "}
              </Grid>
              <Grid size={3}>
                <BasicDataCard
                  color={"inherit"}
                  title="A Responsible Corparate"
                  subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
                />{" "}
              </Grid>
              <Grid size={3}>
                <BasicDataCard
                  color={"inherit"}
                  title="A Responsible Corparate"
                  subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
                />{" "}
              </Grid>
            </Grid>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default Customers;
