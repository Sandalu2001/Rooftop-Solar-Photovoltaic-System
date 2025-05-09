import { Stack, Typography, alpha } from "@mui/material";

interface FactCardInterface {
  color: "inherit" | "primary";
  description: string;
}

const FactCard = ({ color, description }: FactCardInterface) => {
  return (
    <Stack gap={2}>
      <Stack
        sx={{
          background:
            color == "primary"
              ? (theme) => theme.palette.primary.main
              : (theme) => alpha(theme.palette.secondary.main, 0.1),
          height: "100%",
          borderRadius: 3,
          p: 3,
        }}
      >
        <Stack gap={2}>
          <Typography
            variant="body1"
            color={color == "primary" ? "white" : "inherit"}
            textAlign={"left"}
          >
            {description}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default FactCard;
