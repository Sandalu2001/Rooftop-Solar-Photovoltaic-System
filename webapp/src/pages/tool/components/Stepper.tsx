import { useState } from "react";
import { Stepper, Step, StepLabel, Box } from "@mui/material";
import Upload from "./Upload";
import Tool from "./Tool";

const StepperComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Candidate Details",
    "Employment Details",
    "Organization Details",
  ];

  const elementHandler = (step: number) => {
    switch (step) {
      case 0:
        return <Upload setActiveStep={setActiveStep} />;
      case 1:
        return <Tool setActiveStep={setActiveStep} />;
      case 2:
        return <Upload setActiveStep={setActiveStep} />;
      default:
        return <Tool setActiveStep={setActiveStep} />;
    }
  };

  return (
    <Box sx={{ p: 12 }}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          "& .MuiStepConnector-root": {
            top: 20,
          },
          "& .MuiSvgIcon-root": {
            fontSize: 40,
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                fontSize: 5,
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <Box sx={{ height: "100%" }}>{elementHandler(activeStep)}</Box>
    </Box>
  );
};

export default StepperComponent;
