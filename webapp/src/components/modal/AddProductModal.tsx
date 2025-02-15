import React from "react";
import {
  Grid,
  DialogActions,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Stack,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { AddProductModalProps } from "../../types/componentInterfaces";
import CustomFormField from "../common/CustomFormField";
import CustomFormSelectField from "../common/CustomFormSelectField";
import * as Yup from "yup";
import { AddProductPayload } from "../../types/product.type";
import { addNewProduct } from "../../slices/inventory-slice";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../slices/store";
import { State } from "../../types/common.type";

const validationSchema = Yup.object().shape({
  productName: Yup.string().required("Required"),
  productCategory: Yup.number().required("Required").min(0, "Required"),
  buyingPrice: Yup.number().required("Required").min(0),
  sellingPrice: Yup.number().required("Required"),
  avgSales: Yup.number().required("Required").min(0),
});

const AddProductModal = ({ open, handleClose }: AddProductModalProps) => {
  const inventory = useSelector((state: RootState) => state.inventory);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      productName: "",
      productCategory: "",
      productBrandName: "",
      buyingPrice: "",
      sellingPrice: "",
      avgSales: "",
      quantity: "",
    },
    onSubmit: (values) => {
      const payload: AddProductPayload = {
        productName: values.productName,
        productCategory: values.productCategory,
        productBrandName: values.productBrandName,
        avgSales: parseFloat(values.avgSales),
        productInventoryInfo: [
          {
            buyingPrice: parseFloat(values.buyingPrice),
            sellingPrice: parseFloat(values.sellingPrice),
            quantity: parseInt(values.quantity),
          },
        ],
      };
      dispatch(addNewProduct(payload)).then(() => {
        handleClose();
      });
    },
  });

  return (
    <Dialog
      open={open}
      sx={{
        backdropFilter: "blur(5px)",
        ".MuiDialog-paper": {
          maxWidth: 550,
          maxHeight: 600,
          borderRadius: 4,
          minHeight: 400,
        },
      }}
    >
      <DialogTitle
        variant="h5"
        sx={{
          fontSize: 18,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          paddingY: 2.5,
        }}
      >
        Add New Product
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon color="inherit" />
      </IconButton>
      <DialogContent sx={{ p: 2, m: 0, paddingX: 3, height: "100%" }}>
        <Grid container spacing={4} alignItems="center">
          <CustomFormField
            name={"productName"}
            label={"Product Name"}
            value={formik.values.productName}
            onChange={formik.handleChange}
            error={Boolean(
              formik.touched.productName && formik.errors.productName
            )}
            helperText={formik.touched.productName && formik.errors.productName}
            type={"text"}
          />
          <CustomFormField
            name={"productBrandName"}
            label={"Brand Name"}
            value={formik.values.productBrandName}
            onChange={formik.handleChange}
            error={Boolean(
              formik.touched.productBrandName && formik.errors.productBrandName
            )}
            helperText={
              formik.touched.productBrandName && formik.errors.productBrandName
            }
            type={"text"}
          />
          <CustomFormSelectField
            name="productCategory"
            label="Product Category"
            itemArray={[
              {
                id: 0,
                name: "Beverages",
              },
              {
                id: 1,
                name: "Biscuits",
              },
              {
                id: 2,
                name: "Short Eats",
              },
              {
                id: 3,
                name: "Grocery",
              },
            ]}
            value={formik.values.productCategory}
            onChange={formik.handleChange}
            error={Boolean(
              formik.touched.productCategory && formik.errors.productCategory
            )}
            helperText={
              formik.touched.productCategory && formik.errors.productCategory
            }
            type={"number"}
          />

          <CustomFormField
            name={"buyingPrice"}
            label={"Buying Price"}
            value={formik.values.buyingPrice}
            onChange={formik.handleChange}
            error={Boolean(
              formik.touched.buyingPrice && formik.errors.buyingPrice
            )}
            helperText={formik.touched.buyingPrice && formik.errors.buyingPrice}
            type={"number"}
          />

          <CustomFormField
            name={"sellingPrice"}
            label={"Selling Price"}
            value={formik.values.sellingPrice}
            onChange={formik.handleChange}
            error={Boolean(
              formik.touched.sellingPrice && formik.errors.sellingPrice
            )}
            helperText={
              formik.touched.sellingPrice && formik.errors.sellingPrice
            }
            type={"number"}
          />

          <CustomFormField
            name={"quantity"}
            label={"Quantity"}
            value={formik.values.quantity}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.quantity && formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
            type={"number"}
          />

          <CustomFormField
            name={"avgSales"}
            label={"Average Sales per month"}
            value={formik.values.avgSales}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.avgSales && formik.errors.avgSales)}
            helperText={formik.touched.avgSales && formik.errors.avgSales}
            type={"number"}
          />
        </Grid>
      </DialogContent>
      <DialogActions sx={{ pb: 2, paddingX: 2 }}>
        <Stack flexDirection={"row"} gap={2}>
          <Button
            sx={{
              borderRadius: 2,
            }}
            onClick={() => handleClose()}
            variant="outlined"
          >
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            sx={{
              borderRadius: 2,
              boxShadow: "none",
              border: 0.5,
              borderColor: "divider",
            }}
            variant="contained"
            onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
              formik.handleSubmit(e as any)
            }
            loading={inventory.addNewProductState === State.LOADING}
            loadingPosition="start"
            startIcon={<AddIcon fontSize="small" />}
            disabled={!formik.isValid}
          >
            Add
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
