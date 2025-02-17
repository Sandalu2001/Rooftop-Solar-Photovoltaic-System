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
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { AddOrderModalProps } from "../../types/componentInterfaces";
import CustomFormField from "../common/CustomFormField";
import CustomFormSelectField from "../common/CustomFormSelectField";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  productName: Yup.string().required("Required"),
  supplier: Yup.number().required("Required").min(0, "Required"),
  discount: Yup.number().min(0),
  buyingPrice: Yup.number().required("Required"),
  quantity: Yup.number().required("Required").min(0),
});

const AddOrderModal = ({ open, handleClose }: AddOrderModalProps) => {
  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      productName: "",
      supplier: "",
      discount: "",
      buyingPrice: "",
      quantity: "",
    },
    onSubmit: (values) => {},
  });

  console.log(formik);
  return (
    <Dialog
      open={open}
      sx={{
        backdropFilter: "blur(5px)",
        ".MuiDialog-paper": {
          maxWidth: 420,
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
        New Order
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
        <CloseIcon color="primary" />
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
          <CustomFormSelectField
            name="supplier"
            label="Supplier"
            itemArray={[
              {
                id: 0,
                name: "Supplier1",
              },
              {
                id: 1,
                name: "Supplier2",
              },
              {
                id: 2,
                name: "Supplier3",
              },
              {
                id: 3,
                name: "Supplier4",
              },
            ]}
            value={formik.values.supplier}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.supplier && formik.errors.supplier)}
            helperText={formik.touched.supplier && formik.errors.supplier}
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
            name={"discount"}
            label={"Discount"}
            value={formik.values.discount}
            onChange={formik.handleChange}
            error={Boolean(formik.touched.discount && formik.errors.discount)}
            helperText={formik.touched.discount && formik.errors.discount}
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
            loading={false}
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

export default AddOrderModal;
