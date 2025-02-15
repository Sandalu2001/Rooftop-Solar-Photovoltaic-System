import {
  Box,
  Button,
  Divider,
  Grow,
  IconButton,
  Paper,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import { useState } from "react";
import OrderedProductCard from "./OrderedProductCard";
import MoneyIcon from "@mui/icons-material/Money";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { PaymentMethod } from "../../../types/enums";
import { useAppDispatch, useAppSelector } from "../../../slices/store";
import { AddOrderPayload } from "../../../types/order.type";
import { placeCustomerOrder } from "../../../slices/cashier-slice";
import LoadingButton from "@mui/lab/LoadingButton";
import { State } from "../../../types/common.type";
import EmptyCart from "../../../assets/images/empty_cart.svg";

const CustomerOrderView = () => {
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CASH);
  const orderData = useAppSelector((state) => state.cashier.orderData);
  const placeCustomerOrderState = useAppSelector(
    (state) => state.cashier.placeCustomerOrderState
  );
  const dispatch = useAppDispatch();

  const customerOrderHandler = () => {
    const addOrderPayload: AddOrderPayload = {
      userId: orderData.userId,
      total: orderData.total,
      discount: orderData.discount,
      customerId: orderData.customerId,
      branchId: orderData.branchId,
      products: orderData.products.map((product) => {
        return {
          ...product,
        };
      }),
    };

    dispatch(placeCustomerOrder(addOrderPayload));
  };

  return (
    <Paper
      variant="outlined"
      sx={{
        flex: 2,
        width: "100%",
        height: "100%",
        border: "none",
        borderRadius: 3,
        p: 1.5,
      }}
    >
      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        sx={{ m: 2 }}
      >
        <Typography variant="h5" fontWeight={600}>
          Order Details
        </Typography>
        <Typography variant="h6">#185645</Typography>
      </Stack>
      <Divider
        orientation="horizontal"
        sx={{ borderBottomWidth: 3, borderRadius: 2, marginY: 2 }}
        flexItem
      />
      <Grow in={orderData.products.length > 0}>
        <Box
          display={orderData.products.length > 0 ? "block" : "none"}
          sx={{ height: `100%` }}
        >
          <Box
            sx={{
              overflow: "auto",
              height: `calc(100% - 120px)`,
              paddingX: 1,
            }}
          >
            <Stack gap={1}>
              <Typography variant="h6" fontWeight={600} color={"GrayText"}>
                Customer Name
              </Typography>
              <Stack
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography fontWeight={600} fontSize={"body1"}>
                  {" "}
                  Sandalu De Silva
                </Typography>
                <Stack flexDirection={"row"} alignItems={"center"} gap={4}>
                  <Typography
                    fontWeight={600}
                    color={"GrayText"}
                    fontSize={"body2"}
                  >
                    C101
                  </Typography>

                  <IconButton
                    size="small"
                    sx={{
                      p: 0.4,
                      border: "none",
                      borderRadius: 1,
                      bgcolor: (theme) => theme.palette.error.main,
                      "&:hover": {
                        bgcolor: (theme) => theme.palette.error.dark,
                      },
                    }}
                  >
                    <DeleteOutlineRoundedIcon color="info" fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>
            </Stack>
            <Stack
              sx={{
                background: (theme) =>
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                  ),
                maxHeight: 300,
                marginY: 2,
                borderRadius: 3,
                p: 1.5,
                paddingX: 0,
                gap: 1,
                overflow: "auto",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={600}
                color={"GrayText"}
                sx={{ marginX: 1.5 }}
              >
                Current Order
              </Typography>
              <Stack sx={{ gap: 1.2, overflow: "auto", minHeight: 105 }}>
                {orderData.products.map((product, index) => {
                  return (
                    <Box key={index}>
                      <OrderedProductCard product={product} />
                    </Box>
                  );
                })}
              </Stack>
            </Stack>

            <Stack
              sx={{
                background: (theme) =>
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                  ),

                marginY: 1,
                borderRadius: 3,
                p: 3,
                pb: 1,
                gap: 1,
              }}
            >
              <Stack
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography fontWeight={600} variant="body1" color={"GrayText"}>
                  No of items
                </Typography>
                <Typography fontWeight={600} variant={"body1"}>
                  25 (Items)
                </Typography>
              </Stack>

              <Stack
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography fontWeight={600} fontSize={"h6"} color={"GrayText"}>
                  Sub Total
                </Typography>
                <Typography fontWeight={600} fontSize={"body2"}>
                  LKR {orderData.total}
                </Typography>
              </Stack>

              <Stack
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Stack flexDirection={"row"} gap={1}>
                  <Typography
                    fontWeight={600}
                    fontSize={"body1"}
                    color={"GrayText"}
                  >
                    Discount
                  </Typography>
                  <Stack flexDirection={"row"} gap={1}>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ minWidth: 0 }}
                    >
                      5%
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ minWidth: 0 }}
                    >
                      10%
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{ minWidth: 0 }}
                    >
                      15%
                    </Button>
                  </Stack>
                </Stack>
                <Typography
                  fontWeight={600}
                  fontSize={"body2"}
                  color={"success.main"}
                >
                  - LKR {orderData.discount ?? 0}
                </Typography>
              </Stack>
              <Divider
                orientation="horizontal"
                sx={{ borderBottomWidth: 3, borderRadius: 2, marginY: 1 }}
                flexItem
              />
              <Stack
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography fontWeight={600} variant={"h6"}>
                  Total
                </Typography>
                <Typography fontWeight={600} variant={"h6"}>
                  LKR {orderData.total}
                </Typography>
              </Stack>

              <Stack>
                <Typography fontWeight={600} variant={"h6"} color={"GrayText"}>
                  Payment Method
                </Typography>
                <Stack
                  flexDirection={"row"}
                  justifyContent={"space-around"}
                  alignItems={"center"}
                  gap={2}
                  sx={{ marginY: 2 }}
                >
                  <Button
                    variant={
                      paymentMethod === PaymentMethod.CASH
                        ? "contained"
                        : "outlined"
                    }
                    sx={{
                      borderRadius: 2,
                      flex: 1,
                    }}
                    size="large"
                    startIcon={<MoneyIcon />}
                    color="success"
                    onClick={() => setPaymentMethod(PaymentMethod.CASH)}
                  >
                    Cash
                  </Button>
                  <Button
                    variant={
                      paymentMethod === PaymentMethod.CARD
                        ? "contained"
                        : "outlined"
                    }
                    sx={{ borderRadius: 2, flex: 1 }}
                    size="large"
                    startIcon={<CreditCardIcon />}
                    color="success"
                    onClick={() => setPaymentMethod(PaymentMethod.CARD)}
                  >
                    Card
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Box>
          <Stack
            flexDirection={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={2}
            sx={{ mt: 1, paddingX: 1 }}
          >
            <Button
              variant="outlined"
              sx={{ borderRadius: 2, flex: 1 }}
              size="large"
            >
              Cancel
            </Button>
            <LoadingButton
              loading={placeCustomerOrderState === State.LOADING}
              variant="contained"
              sx={{ borderRadius: 2, flex: 1 }}
              onClick={customerOrderHandler}
              size="large"
              disabled={orderData.products.length === 0}
            >
              Place Order
            </LoadingButton>
          </Stack>
        </Box>
      </Grow>

      <Grow in={orderData.products.length === 0}>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            borderRadius: 2,
            overflow: "auto",
            height: `calc(100% - 80px)`,
            display: orderData.products.length === 0 ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            textAlign: "center",
            backgroundColor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.selectedOpacity
              ),
            gap: 6,
          }}
        >
          <img src={EmptyCart} width={230} />
          <Stack gap={2}>
            <Typography fontSize={20} fontWeight={600}>
              Customer Cart is empty
            </Typography>
            <Typography fontSize={13} color={"GrayText"} sx={{ marginX: 3 }}>
              Search for items to start adding them to the cart
            </Typography>
          </Stack>
        </Paper>
      </Grow>
    </Paper>
  );
};

export default CustomerOrderView;
