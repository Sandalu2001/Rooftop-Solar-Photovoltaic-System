import { alpha, Button, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FactCard from "../../../components/common/FactCard";
import CustomFormField from "../../../components/common/CustomFormField";
import { StepperInterface } from "../../../types/componentInterfaces";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const Upload = ({ setActiveStep }: StepperInterface) => {
  return (
    <Stack
      height={"100%"}
      sx={{
        alignContent: "center",
        paddingY: 8,
        gap: 2,
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Stack
          flex={1}
          sx={{
            gap: 2,
          }}
        >
          <FactCard
            description="Understand the costs and advantages of switching to renewable energy, Uncover what your peers are doing in the region"
            color="inherit"
          />
          <FactCard
            description="Get standardized views of data and insight across borders and
languages to more easily compare and strategize"
            color="inherit"
          />
          <FactCard
            description="Talk to our experts and read their research and analysis reports"
            color="primary"
          />
          <FactCard
            description="Understand the costs and advantages of switching to renewable energy, Uncover what your peers are doing in the region"
            color="inherit"
          />
        </Stack>
        <Paper
          variant="outlined"
          sx={{
            flex: 1.2,
            borderRadius: 3,
            p: 5,
            background: "none",
            display: "flex",
            gap: 4,
            flexDirection: "column",
          }}
        >
          <Stack>
            <Typography variant="h6" fontWeight={"500"}>
              Upload satellite image
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderStyle: "dashed",
                borderColor: (theme) => alpha(theme.palette.primary.main, 1),
                p: 1,
                marginY: 1.5,
                background: (theme) =>
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.action.activatedOpacity
                  ),
              }}
            >
              <label htmlFor="select-image">
                <Stack
                  justifyContent={"center"}
                  alignItems={"center"}
                  sx={{ position: "relative", m: 5, cursor: "pointer" }}
                >
                  <UploadFileIcon
                    fontSize="large"
                    color="disabled"
                    sx={{ fontSize: 60 }}
                  />
                  <Typography variant="h5" sx={{ m: 1 }}>
                    Drop your image here or Browse
                  </Typography>
                  <Typography
                    fontWeight={400}
                    variant={"body2"}
                    sx={{ m: 1, color: "GrayText" }}
                  >
                    Supports: PNG, JPG, JPEG,WEBP
                  </Typography>
                  <input
                    accept=".png,.jpg,.jpeg,.webp"
                    type="file"
                    id="select-image"
                    style={{ display: "none" }}
                    // onChange={handleAttachmentChange}
                  />
                </Stack>
              </label>
            </Paper>
          </Stack>

          <Grid container spacing={2}>
            <CustomFormField
              name={"Latitude"}
              label={"Latitude"}
              value={""}
              onChange={function (
                event: React.ChangeEvent<HTMLInputElement>
              ): void {
                throw new Error("Function not implemented.");
              }}
              type={"text"}
            />
            <CustomFormField
              name={"Latitude"}
              label={"Latitude"}
              value={""}
              onChange={function (
                event: React.ChangeEvent<HTMLInputElement>
              ): void {
                throw new Error("Function not implemented.");
              }}
              type={"text"}
            />
            <CustomFormField
              name={"Latitude"}
              label={"Latitude"}
              value={""}
              onChange={function (
                event: React.ChangeEvent<HTMLInputElement>
              ): void {
                throw new Error("Function not implemented.");
              }}
              type={"text"}
            />
          </Grid>
        </Paper>
      </Stack>

      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={() => setActiveStep(1)}
        sx={{
          display: "flex",
          alignSelf: "end",
          borderRadius: 2,
          boxShadow: "none",
          "&:hover .MuiSvgIcon-root": {
            position: "relative",
            animation: "moveIcon 0.4s infinite alternate ease-in-out",
          },
          "@keyframes moveIcon": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(8px)" },
          },
        }}
        endIcon={<ArrowForwardIcon />}
      >
        Get the insights
      </Button>

      <Stack />
    </Stack>
  );
};

export default Upload;
