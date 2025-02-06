import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import ItemCounter from "../../../components/common/ItemCounter";
import { OrderedProductCardProps } from "../../../types/componentInterfaces";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useAppDispatch } from "../../../slices/store";
import { addToCart, removeFromCart } from "../../../slices/cashier-slice";
import { ProductsInCart } from "../../../types/order.type";

const OrderedProductCard = ({ product }: OrderedProductCardProps) => {
  const [expand, setExpand] = useState(false);
  const dispatch = useAppDispatch();

  const toggleAccordion = () => {
    setExpand((prev) => !prev);
  };

  const addToCartItemsHandler = () => {
    const updatedProduct = {
      ...product,
      quantity: product.quantity + 1,
      total: product.price * (product.quantity + 1),
    };
    dispatch(addToCart(updatedProduct));
  };

  const removeFromCartItemsHandler = () => {
    const updatedProduct = {
      ...product,
      quantity: product.quantity - 1,
      total: product.price * (product.quantity - 1),
    };
    dispatch(removeFromCart(updatedProduct));
  };

  return (
    <Box sx={{ marginX: 1.5 }}>
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
            <Stack gap={0.5} maxWidth={100}>
              <Typography fontWeight={600} fontSize={"body1"}>
                {product.prductName}
              </Typography>
              <Typography
                fontWeight={500}
                fontSize={"body1"}
                color={"primary.main"}
                sx={{ fontSize: 11 }}
              >
                LKR {product.price}
              </Typography>
            </Stack>
            <ItemCounter
              noOfItems={product.quantity}
              addItems={addToCartItemsHandler}
              removeItems={removeFromCartItemsHandler}
            />
            <Typography
              fontWeight={600}
              fontSize={"body1"}
              sx={{ display: expand ? "none" : "block" }}
            >
              LKR {product.total}
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
                ({product.total})
              </Typography>
            </Stack>
            <Typography fontWeight={600} fontSize={"body1"}>
              LKR {product.total}
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
              - LKR {0}
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
              LKR {product.total}
            </Typography>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default OrderedProductCard;
