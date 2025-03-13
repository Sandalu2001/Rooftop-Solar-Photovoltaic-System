import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Cover from "../../assets/images/login.jpg";

const Intro = () => {
  return (
    <Stack
      height={"100%"}
      sx={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignContent: "center",
        marginX: 8,
        pb: 8,
        gap: 10,
        paddingX: 12,
      }}
    >
      <Stack height={"100%"}>
        <Stack
          height={"100%"}
          sx={{
            flexDirection: "column",
            gap: 4,
          }}
        >
          <Box>
            <Chip
              icon={<FiberManualRecordIcon />}
              label="UTILITY PRICES HAVE STEADILY INCREASED"
              variant="outlined"
              color="primary"
              sx={{ width: "auto" }}
            />
          </Box>
          <Stack gap={1}>
            <Typography variant="h1">Solar energy.</Typography>
            <Typography variant="h1">the smartest way</Typography>
          </Stack>
        </Stack>
      </Stack>
      <Stack
        sx={{
          position: "relative",
          borderRadius: 3,
          height: "80vh",
          overflow: "hidden",
        }}
      >
        {/* Image */}
        <img
          src={Cover}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
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
            background: `linear-gradient(180deg, rgba(24,242,245,0) 0%, rgba(1,25,30,1) 99%)`,
          }}
        />

        {/* Explore More Button */}
        <Stack
          sx={{
            position: "absolute",
            bottom: 15,
            left: "50%",
            transform: "translateX(-50%)",
            width: "92%",
            borderRadius: 8,
            bgcolor: "#E55800",
            color: "white",
            height: 100,
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Typography variant="h5">Explore more</Typography>
        </Stack>

        {/* Installations Count */}
        <Stack
          sx={{
            position: "absolute",
            bottom: 300,
            left: "50%",
            transform: "translateX(-50%)",
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: 300 }}>
            132,454
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 300 }}>
            installations
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Intro;
