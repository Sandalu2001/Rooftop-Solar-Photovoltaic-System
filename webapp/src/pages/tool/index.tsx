import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import Intro from "../home/Intro";
import Customers from "../home/Customers";
import Tool from "./components/Tool";
import About from "../home/About";
import Upload from "./components/Upload";
import StepperComponent from "./components/Stepper";

const Home = () => {
  return (
    <Stack>
      <Intro />
      <Customers />
      <StepperComponent />
      <About />
    </Stack>
  );
};

export default Home;
