import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Cover from "../../assets/images/about.jpg";
import FactCard from "../../components/common/FactCard";

const About = () => {
  return (
    <Stack
      height="100%"
      sx={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginX: 8,
        paddingY: 12,
        gap: 10,
        paddingX: 12,
      }}
    >
      <Stack
        sx={{
          height: "100%",
          width: "80%",
          borderRadius: 3,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <img
          src={Cover}
          style={{
            height: 300,
            width: "80%",
            borderRadius: 20,
            objectFit: "cover",
            objectPosition: "top",
          }}
        />
        <img
          src={Cover}
          style={{
            height: 300,
            width: "80%",
            borderRadius: 20,
            objectFit: "cover",
            objectPosition: "bottom",
          }}
        />
      </Stack>

      <Stack height="100%" maxWidth={550}>
        <Stack
          sx={{
            flexDirection: "column",
            gap: 4,
            height: "100%",
          }}
        >
          <Box>
            <Chip
              icon={<FiberManualRecordIcon />}
              label="SOLAR PANEL ENERGY"
              variant="outlined"
              color="primary"
              sx={{ width: "auto" }}
            />
          </Box>
          <Stack gap={1}>
            <Typography variant="h2">Our Solutions Reach</Typography>
            <Typography variant="h2">100% Renewable</Typography>
          </Stack>
          <Stack sx={{ color: "GrayText" }}>
            <Typography variant="body2">
              So how to begin? Our unparalleled data and deep insights across
              the energy
            </Typography>
            <Typography variant="body2">
              economy, commodities and financial markets help you navigate the
              path from net-zero
            </Typography>
            <Typography variant="body2">
              commitment to net-zero action, creating long-term sustainable
              value.
            </Typography>
          </Stack>

          <Stack gap={3}>
            <FactCard
              description="Talk to our experts and read their research and analysis reports"
              color="primary"
            />
            <FactCard
              description="Understand the costs and advantages of switching to renewable energy, Uncover what your peers are doing in the region"
              color="inherit"
            />
            <FactCard
              description="Get standardized views of data and insight across borders and
languages to more easily compare and strategize"
              color="inherit"
            />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default About;
