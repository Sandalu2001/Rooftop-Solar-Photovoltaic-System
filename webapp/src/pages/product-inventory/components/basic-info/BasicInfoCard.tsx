import { Stack, alpha } from "@mui/material";

const BasicInfoCard = () => {
  return (
    <Stack
      flex={1}
      sx={{
        background: (theme) => alpha(theme.palette.common.white, 10),
        height: "100%",
        borderRadius: 3,
        p: 2,
      }}
    ></Stack>
  );
};

export default BasicInfoCard;
