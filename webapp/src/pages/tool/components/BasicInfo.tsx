import React from "react";
import CustomFormField from "../../../components/common/CustomFormField";
import dayjs from "dayjs";
import { alpha, Grid, Stack, Typography } from "@mui/material";
import { useAppSelector } from "../../../slices/store";

const BasicInfo = () => {
  const metadata = useAppSelector((state) => state.solar);
  return (
    <div style={{ flex: 2, height: "100%" }}>
      <Stack
        flex={1}
        sx={{
          gap: 2,
          maxWidth: 400,
          p: 2,
          borderRadius: 5,
          background: (theme) => alpha(theme.palette.primary.main, 0.1),
          height: "100%",
        }}
      >
        <Stack sx={{ gap: 1 }}>
          <Typography variant="h5" color={"GrayText"} sx={{ fontWeight: 600 }}>
            Basic Info
          </Typography>
          <Grid
            container
            spacing={2}
            sx={{
              background: (theme) => alpha(theme.palette.primary.main, 0.1),
              p: 2,
              borderRadius: 4,
            }}
          >
            <CustomFormField
              name={"latitude"}
              label={"Latitude"}
              onChange={() => {}}
              value={metadata.latitude}
              type={"text"}
              disabled
            />
            <CustomFormField
              name={"longtitude"}
              label={"Lontitude"}
              onChange={() => {}}
              value={metadata.longitude}
              type={"text"}
              disabled
            />
            <CustomFormField
              name={"Date"}
              label={"Date"}
              onChange={() => {}}
              value={dayjs(metadata.date).format("YYYY-MM-DD")}
              type={"text"}
              disabled
            />
          </Grid>
        </Stack>
      </Stack>
    </div>
  );
};

export default BasicInfo;
