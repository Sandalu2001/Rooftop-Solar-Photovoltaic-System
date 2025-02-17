import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import React, { useState } from "react";
import ItemCounter from "../../../components/common/ItemCounter";
import {
  OrderStatus,
  SupplierInfoCardProps,
} from "../../../types/componentInterfaces";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SupplierInfoCard = ({
  orderId,
  expectedTotal,
  FinalTotal,
  noOfItems,
  supplier,
  date,
  status,
  products,
}: SupplierInfoCardProps) => {
  const [numOfItems, setNumOfItems] = useState(noOfItems);
  const [expand, setExpand] = useState(false);
  const toggleAccordion = () => {
    setExpand((prev) => !prev);
  };
  return (
    <Box sx={{ marginX: 1.5 }} key={orderId}>
      <Accordion
        variant="outlined"
        square
        expanded={expand}
        sx={{
          borderRadius: 3,
          "&.MuiAccordion-root:before": {
            backgroundColor: "transparent",
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            <IconButton onClick={toggleAccordion} size="small">
              <ExpandMoreIcon />
            </IconButton>
          }
          sx={{ width: "100%", paddingY: 0 }}
        >
          <Stack
            sx={{ marginY: expand ? 0 : 0, overflowY: "auto", width: "100%" }}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack gap={0.5}>
              <Typography fontWeight={600} fontSize={"body1"}>
                #SO {orderId}
              </Typography>
              <Typography
                fontWeight={500}
                fontSize={"body1"}
                color={"primary.main"}
                sx={{ fontSize: 11 }}
              >
                {noOfItems} items
              </Typography>
            </Stack>
            <Chip
              sx={{
                minWidth: 80,
                border: "none",
                borderRadius: 2,
                bgcolor: (theme) =>
                  alpha(
                    status === OrderStatus.PENDING
                      ? theme.palette.primary.main
                      : status === OrderStatus.ONDELIVERY
                      ? theme.palette.secondary.main
                      : status === OrderStatus.DELIVERED
                      ? theme.palette.success.main
                      : theme.palette.error.main,
                    0.3
                  ),
              }}
              size="small"
              label={status}
              variant={"outlined"}
              color={
                status === OrderStatus.PENDING
                  ? "primary"
                  : status === OrderStatus.ONDELIVERY
                  ? "secondary"
                  : status === OrderStatus.DELIVERED
                  ? "success"
                  : "error"
              }
            />
            <Typography
              fontWeight={600}
              fontSize={"body1"}
              sx={{ display: expand ? "none" : "block" }}
            >
              LKR {expectedTotal}
            </Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Divider />
          <Stack
            sx={{ mt: 2, overflowY: "auto", width: "100%" }}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack flexDirection={"row"} gap={2}>
              <Typography fontWeight={600} fontSize={"body1"}>
                Sub Total{" "}
              </Typography>
              <Typography fontSize={"body2"} color={"GrayText"}>
                (${expectedTotal} x {numOfItems})
              </Typography>
            </Stack>
            <Typography fontWeight={600} fontSize={"body1"}>
              LKR {expectedTotal * numOfItems}
            </Typography>
          </Stack>
          <Stack
            sx={{
              mt: 2,
              overflowY: "auto",
              width: "100%",
              pb: 1,
              borderBottom: 1,
              borderColor: "GrayText",
            }}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography fontWeight={600} fontSize={"body1"}>
              Discount
            </Typography>
            <Typography fontWeight={600} fontSize={"body1"}>
              - LKR {expectedTotal * numOfItems}
            </Typography>
          </Stack>
          <Stack
            sx={{ mt: 2, overflowY: "auto", width: "100%" }}
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography fontWeight={600} fontSize={"body1"}>
              Total
            </Typography>
            <Typography fontWeight={600} fontSize={"body1"}>
              LKR {expectedTotal * numOfItems}
            </Typography>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default SupplierInfoCard;
