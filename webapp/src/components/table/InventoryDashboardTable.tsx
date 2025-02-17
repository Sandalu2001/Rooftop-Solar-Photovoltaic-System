import * as React from "react";
import { DataGrid, GridCellParams, GridColDef } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
  alpha,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { addToCart, getProducts } from "../../slices/inventory-slice";
import { useAppDispatch, useAppSelector } from "../../slices/store";
import {
  ProductResponse,
  ProductInventoryInfo,
  InventoryResponse,
  ProductQuantityAndPrice,
} from "../../types/product.type";
import { useEffect, useState } from "react";
import { State } from "../../types/common.type";
import AddOrderModal from "../modal/AddOrderModel";

const InventoryTable = () => {
  const dispatch = useAppDispatch();
  const { productsInInventory, fetchProductsState, productsInCart } =
    useAppSelector((state) => state.inventory);

  useEffect(() => {
    dispatch(getProducts());
  }, []);

  const [rows, setRows] = useState<InventoryResponse[]>(productsInInventory);
  const [addToCartHandler, setAddToCardHandler] = useState(false);

  useEffect(() => {
    setRows(productsInInventory);
  }, [productsInInventory]);

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
      field: "buyingPrice",
      headerName: "Buying Price",
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      flex: 1,
      renderCell: (params: GridCellParams) => {
        const productInventoryInfo = params.row
          .productInventoryInfo as ProductQuantityAndPrice[];
        return (
          <Stack
            gap={2}
            sx={{
              height: "100%",
              justifyContent: "center",
            }}
          >
            {productInventoryInfo.map(
              (item: ProductQuantityAndPrice, index) => (
                <Typography color={alpha("#000", 0.55)} fontSize={13}>
                  LKR {item.buyingPrice}
                </Typography>
              )
            )}
          </Stack>
        );
      },
    },

    {
      field: "price",
      headerName: "Selling Price",
      headerAlign: "center",
      minWidth: 120,
      flex: 1,
      align: "center",
      renderCell: (params: GridCellParams) => {
        const productInventoryInfo = params.row
          .productInventoryInfo as ProductQuantityAndPrice[];
        return (
          <Stack
            gap={2}
            sx={{
              height: "100%",
              justifyContent: "center",
            }}
          >
            {productInventoryInfo.map(
              (item: ProductQuantityAndPrice, index) => (
                <Typography color={alpha("#000", 0.55)} fontSize={13}>
                  LKR {item.sellingPrice}
                </Typography>
              )
            )}
          </Stack>
        );
      },
    },

    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      flex: 1,
      editable: false,
      renderCell: (params) => {
        const avgSales = params.row.avgSales as number;
        var totalQuantity = 0;
        const productInventoryInfo = params.row
          .productInventoryInfo as ProductInventoryInfo[];

        return (
          <Stack
            sx={{
              height: "100%",
              justifyContent: "center",
            }}
            gap={1.5}
          >
            {productInventoryInfo.map((product) => {
              return (
                <Chip
                  sx={{
                    minWidth: 80,
                    border: "none",
                    borderRadius: 2,
                    bgcolor: (theme) =>
                      alpha(
                        product.quantity < avgSales
                          ? theme.palette.warning.main
                          : product.quantity === 0
                          ? theme.palette.error.main
                          : theme.palette.success.main,
                        0.3
                      ),
                  }}
                  size="small"
                  icon={
                    product.quantity < avgSales ? (
                      <WarningIcon />
                    ) : product.quantity === 0 ? (
                      <ErrorIcon />
                    ) : (
                      <CheckIcon />
                    )
                  }
                  label={
                    product.quantity < avgSales
                      ? "Warning"
                      : product.quantity === 0
                      ? "Out Of Stock"
                      : "In Stock"
                  }
                  variant={"outlined"}
                  color={
                    product.quantity < avgSales
                      ? "warning"
                      : product.quantity === 0
                      ? "error"
                      : "success"
                  }
                />
              );
            })}
          </Stack>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Quantity",
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      flex: 1,
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
              <Typography color={alpha("#000", 0.55)} fontSize={13}>
                {item.quantity}
              </Typography>
            ))}
          </Stack>
        );
      },
    },
    {
      field: "order",
      headerName: "Add to Cart",
      headerAlign: "center",
      align: "center",
      minWidth: 120,
      flex: 1,
      editable: false,
      renderCell: (params) => {
        const productInventoryInfo = params.row
          .productInventoryInfo as ProductInventoryInfo[];

        const orderClickHandler = (index: number) => {
          const currentRow = params.row as ProductResponse;
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
        return (
          <Stack
            sx={{
              height: "100%",
              justifyContent: "center",
            }}
            gap={1}
          >
            {productInventoryInfo.map((_, index) => {
              return (
                <Button
                  startIcon={<AddShoppingCartIcon />}
                  sx={{
                    minWidth: 80,
                    border: "none",
                    borderRadius: 2,
                    boxShadow: "none",
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.9),
                  }}
                  size="small"
                  variant={"contained"}
                  color={"primary"}
                  onClick={() => setAddToCardHandler(true)}
                >
                  Order
                </Button>
              );
            })}
          </Stack>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
      minWidth: 100,
      editable: false,
      renderCell: (params) => {
        const productInventoryInfo = params.row
          .productInventoryInfo as ProductInventoryInfo[];
        return (
          <Stack
            sx={{
              height: "100%",
              justifyContent: "center",
            }}
            gap={1}
          >
            {productInventoryInfo.map((product) => {
              return (
                <Box>
                  <IconButton>
                    <MoreVertIcon />
                  </IconButton>
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
        rows={rows}
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

      <AddOrderModal
        open={addToCartHandler}
        handleClose={() => setAddToCardHandler(false)}
      />
    </Box>
  );
};

export default InventoryTable;
