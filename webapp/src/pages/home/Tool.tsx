import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import City from "../../assets/images/city.jpg";
import TotalOrderview from "../analytics-dashboard/components/TotalOrderview";
import DataCard from "../../components/common/DataCard";
import BasicDataCard from "../../components/common/BasicDataCard";
import LaunchIcon from "@mui/icons-material/Launch";

const Tool = () => {
  return (
    // <Paper
    //   variant="outlined"
    //   sx={{
    //     background: (theme) => theme.palette.primary.main,
    //     borderRadius: 8,
    //   }}
    // >
    //   <Stack height={"100%"}>
    //     <Stack sx={{ p: 12, marginX: 8 }} gap={10}>
    //       <Stack gap={1}>
    //         <Typography variant="h2" color={"white"}>
    //           A Responsible
    //         </Typography>
    //         <Typography variant="h2" color={"white"}>
    //           Corporate Customers
    //         </Typography>
    //       </Stack>

    //       <Grid container rowSpacing={1} columnSpacing={4}>
    //         <Grid item sm={4}>
    //           <DataCard
    //             color={"inherit"}
    //             title="A Responsible Corparate"
    //             subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
    //           />
    //         </Grid>
    //         <Grid item sm={4}>
    //           <DataCard
    //             color={"fade"}
    //             title="A Responsible Corparate"
    //             subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
    //           />{" "}
    //         </Grid>
    //         <Grid item sm={4}>
    //           <DataCard
    //             color={"inherit"}
    //             title="A Responsible Corparate"
    //             subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
    //           />{" "}
    //         </Grid>
    //       </Grid>
    //     </Stack>
    //     <Stack
    //       sx={{
    //         borderRadius: 8,
    //         background: "white",
    //         marginX: 5,
    //         mb: 5,
    //       }}
    //     >
    //       <Stack sx={{ p: 12, marginX: 8 }} gap={10}>
    //         <Stack flexDirection={"row"}>
    //           <Stack gap={1} flex={5}>
    //             <Typography variant="h2">Electricity production </Typography>
    //             <Typography variant="h2"> in Sri Lanka </Typography>
    //           </Stack>
    //           <Stack gap={1} flex={3.5}>
    //             <Typography variant="h6" color={"primary"}>
    //               SOLAR PANEL ENERGY{" "}
    //             </Typography>
    //             <Typography variant="body1">
    //               {" "}
    //               Renewable energy continues to contribute an increasing supply
    //               of Sri Lanka’s electricity needs.In 2020,22.5% of Sri Lanka’s
    //               electricity came from renewable sources{" "}
    //             </Typography>
    //           </Stack>
    //         </Stack>

    //         <Divider />

    //         <Grid container rowSpacing={1} columnSpacing={4}>
    //           <Grid item sm={3}>
    //             <BasicDataCard
    //               color={"inherit"}
    //               title="A Responsible Corparate"
    //               subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
    //             />
    //           </Grid>
    //           <Grid item sm={3}>
    //             <BasicDataCard
    //               color={"dark"}
    //               title="A Responsible Corparate"
    //               subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
    //             />{" "}
    //           </Grid>
    //           <Grid item sm={3}>
    //             <BasicDataCard
    //               color={"inherit"}
    //               title="A Responsible Corparate"
    //               subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
    //             />{" "}
    //           </Grid>
    //           <Grid item sm={3}>
    //             <BasicDataCard
    //               color={"inherit"}
    //               title="A Responsible Corparate"
    //               subTitle="Save on your electricity bills, reduce your carbon footprint and increase the value of your home"
    //             />{" "}
    //           </Grid>
    //         </Grid>
    //       </Stack>
    //     </Stack>
    //   </Stack>
    // </Paper>
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      <img
        src={City}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          objectFit: "contain",
          borderRadius: 50,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: 10,
          background: `linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(1,25,30,0.8421962535014006) 46%, rgba(60,101,21,0) 80%)`,
          p: 15,
        }}
      >
        <Stack
          height={"100%"}
          justifyContent={"center"}
          flexDirection={"column"}
          alignItems={"flex-start"}
          gap={8}
        >
          <Stack flexDirection={"column"} gap={4}>
            <Stack gap={2}>
              <Typography variant="h2" color="white" fontWeight={500}>
                Harnessing Solar{" "}
              </Typography>

              <Typography variant="h1" color="primary.main" fontWeight={500}>
                Power The Future{" "}
              </Typography>

              <Typography variant="h2" color="white" fontWeight={500}>
                Of Sustainable{" "}
              </Typography>
              <Typography variant="h2" color="white" fontWeight={500}>
                Energy
              </Typography>
            </Stack>
          </Stack>
          <Stack gap={2}>
            <Typography variant="h5" color="white">
              Are you tired of high electricity bills and wondering if solar
              energy is right for your home?{" "}
            </Typography>
            <Typography variant="h5" color="white">
              Discover how much power your rooftop can generate with SolarSync.
            </Typography>
          </Stack>
          <Stack
            sx={{
              alignItems: "start",
            }}
          >
            <Button
              startIcon={<LaunchIcon />}
              variant="contained"
              href="/services"
              size="large"
              sx={{ borderRadius: 2 }}
            >
              Try Solar Sync
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Tool;
