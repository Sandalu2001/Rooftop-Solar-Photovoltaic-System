import React from "react";
import {
  TextField,
  InputLabel,
  FormControl,
  Select,
  Grid,
  FormHelperText,
  MenuItem,
  Typography,
  DialogActions,
  Button,
  Paper,
  alpha,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  DialogContentText,
  Stack,
  Input,
  SelectChangeEvent,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useFormik } from "formik";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { AddProductModalProps } from "../../types/componentInterfaces";
import CustomFormField from "../common/CustomFormField";
import CustomFormSelectField from "../common/CustomFormSelectField";
import * as Yup from "yup";

export const validationSchema = [
  Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
  }),
  Yup.object({
    verificationCode: Yup.string().required("Required"),
  }),
  Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
    reenterPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  }),
];

const AddProductModal = ({ open, handleClose }: AddProductModalProps) => {
  const formik = useFormik({
    initialValues: {
      productName: "",
      productCategory: "",
      buyingPrice: 0,
      sellingPrice: 0,
      avgSales: 0,
    },

    validationSchema: validationSchema,
    onSubmit: (values) => {},
  });
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
        <CloseIcon color="primary" />
      </IconButton>
      <DialogContent sx={{ p: 2, m: 0, paddingX: 3, height: "100%" }}>
        <Grid container spacing={4} alignItems="center">
          <CustomFormField
            name={"productName"}
            label={"Product Name"}
            value={formik.values.productName}
            onChange={formik.handleChange}
            type={"text"}
          />
          <CustomFormSelectField
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
            name={""}
            label={""}
            value={""}
            onChange={function (
              event: SelectChangeEvent<string | number>,
              child: React.ReactNode
            ) {}}
            type={undefined}
          />

          <CustomFormField
            name={"buyingPrice"}
            label={"Buying Price"}
            value={formik.values.buyingPrice}
            onChange={formik.handleChange}
            type={"number"}
          />

          <CustomFormField
            name={"sellingPrice"}
            label={"Selling Price"}
            value={formik.values.sellingPrice}
            onChange={formik.handleChange}
            type={"number"}
          />

          <CustomFormField
            name={"avgSales"}
            label={"Average Sales per month"}
            value={formik.values.avgSales}
            onChange={formik.handleChange}
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
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {}}
            loading={false}
            loadingPosition="start"
            startIcon={<AddIcon fontSize="small" />}
          >
            Add
          </LoadingButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
