import React, { useEffect } from "react";
import { AddToCartPopperProps } from "../../types/componentInterfaces";
import {
  Box,
  Divider,
  Fade,
  Paper,
  Popper,
  Stack,
  Typography,
  ClickAwayListener,
} from "@mui/material";
import OrderedProductCard from "../../pages/cashier-dashboard/components/OrderedProductCard";
import LoadingButton from "@mui/lab/LoadingButton";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "../../slices/store";

const AddToCartPopper = ({ anchorEl, handleClick }: AddToCartPopperProps) => {
  const location = useLocation();
  const open = Boolean(anchorEl);
  const id = open ? "simple-popper" : undefined;

  const handleClose = () => {
    handleClick(null);
  };

  useEffect(() => {
    handleClick(null);
  }, [location]);

  const cartData = useAppSelector((state) => state.inventory.productsInCart);
  return (
    <Popper
      id={id}
      open={open}
      anchorEl={anchorEl}
      sx={{ zIndex: 10000 }}
      transition
      placement="bottom-end"
      disablePortal={false}
      modifiers={[
        {
          name: "flip",
          enabled: true,
          options: {
            altBoundary: true,
            rootBoundary: "document",
            padding: 8,
          },
        },
        {
          name: "preventOverflow",
          enabled: true,
          options: {
            altAxis: true,
            altBoundary: true,
            tether: true,
            rootBoundary: "document",
            padding: 8,
          },
        },
        {
          name: "arrow",
          enabled: true,
          options: {
            element: anchorEl,
          },
        },
      ]}
    >
      {({ TransitionProps }) => (
        <ClickAwayListener onClickAway={handleClose}>
          <Fade {...TransitionProps} timeout={350}>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 3,
                mt: 1,
                maxHeight: 600,
                minWidth: 350,
                boxShadow: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ m: 2 }}>
                Shopping Cart
              </Typography>

              <Stack
                sx={{
                  gap: 1.2,
                  overflow: "auto",
                  marginY: 2,
                  minHeight: 50,
                  maxHeight: 400,
                }}
              >
                <Stack sx={{ gap: 1.2, overflow: "auto" }}>
                  {cartData && cartData.length > 0 ? (
                    cartData.map((product, index) => {
                      return (
                        <Box key={index}>
                          <OrderedProductCard product={product} />
                        </Box>
                      );
                    })
                  ) : (
                    <Box>No Items found</Box>
                  )}
                </Stack>
              </Stack>
              <Divider />
              <Stack
                sx={{ marginX: 2, mt: 2 }}
                flexDirection={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography fontWeight={600} variant={"h6"}>
                  Total
                </Typography>
                <Typography fontWeight={600} variant={"h6"}>
                  LKR 52320
                </Typography>
              </Stack>
              <Stack flexDirection={"row"} gap={2} sx={{ m: 1.5 }}>
                <LoadingButton
                  sx={{
                    borderRadius: 2,
                    flex: 1,
                  }}
                  onClick={handleClick}
                  variant="outlined"
                >
                  View Cart
                </LoadingButton>
                <LoadingButton
                  type="submit"
                  sx={{
                    borderRadius: 2,
                    boxShadow: "none",
                    border: 0.5,
                    borderColor: "divider",
                    flex: 1,
                  }}
                  variant="contained"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {}}
                  loading={false}
                  loadingPosition="start"
                >
                  Checkout
                </LoadingButton>
              </Stack>
            </Paper>
          </Fade>
        </ClickAwayListener>
      )}
    </Popper>
  );
};

export default AddToCartPopper;
