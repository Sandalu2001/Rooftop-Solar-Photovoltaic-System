import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import Intro from "./Intro";
import Customers from "./Customers";
import Tool from "./Tool";
import About from "./About";

const Home = () => {
  return (
    <Stack>
      <Intro />
      <Customers />
      <About />
      <Tool />
    </Stack>
  );
};

export default Home;
