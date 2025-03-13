import { Box, Button, Stack, Typography } from "@mui/material";
import React from "react";
import City from "../../assets/images/city.jpg";
import LaunchIcon from "@mui/icons-material/Launch";

const Tool = () => {
  return (
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
