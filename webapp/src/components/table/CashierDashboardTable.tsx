import * as React from "react";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import { alpha, Box, Stack, Tooltip, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import {
  addToCart,
  getProducts,
  removeFromCart,
  setProducts,
} from "../../slices/cashier-slice";
import { useEffect, useState } from "react";
import {
  CashierProductInfo,
  CashierProductResponse,
  ProductInventoryInfo,
  ProductResponse,
} from "../../types/product.type";
import ItemCounter from "../common/ItemCounter";
import { State } from "../../types/common.type";

const CashierTable = () => {
  const dispatch = useAppDispatch();
  const { products, fetchProductsState } = useAppSelector(
    (state) => state.cashier
  );

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  const columns: GridColDef[] = [
    {
      field: "productName",
      headerName: "ProductName",
      flex: 1.5,
      minWidth: 150,
      headerAlign: "left",
      align: "left",
      renderCell: (params: GridCellParams) => {
        return (
          <Stack
            sx={{
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Typography fontWeight={600} fontSize={13}>
              {params.row.productName}
            </Typography>
          </Stack>
        );
      },
    },

    {
      field: "productBrandName",
      headerName: "Brand Name",
      flex: 1,

      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridCellParams) => {
        return (
          <Stack
            sx={{
              height: "100%",
              justifyContent: "center",
            }}
          >
            <Typography fontWeight={600} fontSize={13}>
              {params.row.productBrandName}
            </Typography>
          </Stack>
        );
      },
    },

    {
      field: "quantity",
      headerName: "Quantity",
      headerAlign: "center",
      align: "center",
      flex: 1,
      minWidth: 150,

      renderCell: (params: GridCellParams) => {
        var totalQuantity = 0;
        const productInventoryInfo = params.row
          .productInventoryInfo as ProductInventoryInfo[];
        productInventoryInfo.map((item: ProductInventoryInfo) => {
          totalQuantity += item.quantity;
        });
        return (
          <Tooltip
            title={
              <Stack flexDirection={"row"} gap={1}>
                <Typography>Total </Typography>
                <Typography
                  color={totalQuantity === 0 ? "error.main" : "success.main"}
                >
                  {totalQuantity} items
                </Typography>
                <Typography>left </Typography>
              </Stack>
            }
            arrow
          >
            <Stack
              gap={2}
              sx={{
                height: "100%",
                justifyContent: "center",
              }}
            >
              {productInventoryInfo.map((item: ProductInventoryInfo, index) => (
                <Typography
                  color={alpha("#000", 0.55)}
                  fontSize={14}
                  key={index}
                >
                  {`${item.quantity} items`}
                </Typography>
              ))}
            </Stack>
          </Tooltip>
        );
      },
    },
    {
      field: "price",
      headerName: "Price",
      headerAlign: "center",
      minWidth: 150,
      flex: 1,

      align: "center",
      renderCell: (params: GridCellParams) => {
        const productInventoryInfo = params.row
          .productInventoryInfo as ProductInventoryInfo[];
        return (
          <Stack
            gap={2}
            sx={{
              height: "100%",
              justifyContent: "center",
            }}
          >
            {productInventoryInfo.map((item: ProductInventoryInfo, index) => (
              <Typography color={alpha("#000", 0.55)} fontSize={13} key={index}>
                LKR {item.price}
              </Typography>
            ))}
          </Stack>
        );
      },
    },
    {
      field: "noOfItems",
      headerName: "No Of Items",
      flex: 1,
      minWidth: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params: GridCellParams) => {
        const currentRow = params.row as CashierProductResponse;
        const productInventoryInfo = params.row
          .productInventoryInfo as CashierProductInfo[];

        const addToCartItemsHandler = (index: number) => {
          dispatch(
            addToCart({
              productId: currentRow.productId,
              prductName: currentRow.productName,
              productBrandName: currentRow.productBrandName,
              productCategory: currentRow.productCategory,
              price: currentRow.productInventoryInfo[index].price,
            })
          );
        };

        const removeFromCartItemsHandler = (index: number) => {
          const currentRow = params.row as CashierProductResponse;
          dispatch(
            removeFromCart({
              productId: currentRow.productId,
              prductName: currentRow.productName,
              productBrandName: currentRow.productBrandName,
              productCategory: currentRow.productCategory,
              price: currentRow.productInventoryInfo[index].price,
            })
          );
        };

        return (
          <Stack
            gap={1}
            sx={{
              height: "100%",
              justifyContent: "center",
            }}
          >
            {productInventoryInfo.map((_, index) => {
              return (
                <Box sx={{ paddingX: 2 }} key={index}>
                  <ItemCounter
                    noOfItems={
                      currentRow.productInventoryInfo[index].selectedItems
                    }
                    addItems={() => addToCartItemsHandler(index)}
                    removeItems={() => removeFromCartItemsHandler(index)}
                  />
                </Box>
              );
            })}
          </Stack>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%", mt: 4, overflow: "auto" }}>
      <DataGrid
        getRowId={(row) => row.productId}
        rows={products}
        columns={columns}
        autosizeOnMount
        loading={fetchProductsState === State.LOADING}
        disableRowSelectionOnClick
        sx={{
          "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": { py: "8px" },
          "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
            py: "10px",
          },
          "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
            py: "22px",
          },
        }}
        getRowHeight={() => "auto"}
      />
    </Box>
  );
};

export default CashierTable;
