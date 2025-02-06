import React, { useState } from "react";
import {
  Grid,
  Typography,
  Button,
  Paper,
  alpha,
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  Stack,
  Stepper,
  Step,
  Box,
  StepLabel,
  Zoom,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import { ResetPasswordProps } from "../../types/componentInterfaces";
import CustomFormField from "../common/CustomFormField";
import UploadCompleteSvg from "../../assets/images/upload-complete.svg";
import * as Yup from "yup";
import CustomFormSelectField from "../common/CustomFormSelectField";

export const validationSchemas = [
  Yup.object({
    firstName: Yup.string().required("Required"),
    middleName: Yup.string(),
    surName: Yup.string().required("Required"),
    position: Yup.number().required("Required").min(0, "Required"),
    phoneNumber: Yup.string().required("Required"),
    gender: Yup.number().required("Required").min(0, "Required"),
  }),
  Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .required("Please enter your password.")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
    reenterPassword: Yup.string()
      .required("Please re-enter your password.")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .equals([Yup.ref("password")], "Passwords must match"),
  }),
  Yup.object({
    verificationCode: Yup.string().required("Required").min(6, "Invalid code"),
  }),
];

const AddUserModal = ({ open, handleClose }: ResetPasswordProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const steps = [
    "Enter personal information",
    "Create a new password",
    "Verify your email",
  ];

  const formik = useFormik({
    initialValues: {
      firstName: "",
      middleName: "",
      surName: "",
      position: -1,
      phoneNumber: "",
      gender: -1,
      email: "",
      password: "",
      reenterPassword: "",
      verificationCode: "",
    },
    validationSchema: validationSchemas[activeStep],
    onSubmit: (values) => {
      switch (activeStep) {
        case 0:
          setActiveStep(activeStep + 1);
          break;
        case 1:
          setActiveStep(activeStep + 1);
          break;
        case 2:
          setActiveStep(activeStep + 1);
          break;
        default:
          break;
      }
    },
  });

  const handleNext = () => {
    if (formik.isValid) {
      console.log("Form is valid");
      formik.handleSubmit();
    } else {
      console.log(formik.errors);
      formik.setTouched({ ...formik.touched });
    }
  };

  const elementHandler = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <Stack gap={3} sx={{ mt: 3 }}>
              <Typography variant="h6">
                Enter your personal information
              </Typography>

              <Grid container spacing={4} alignItems="center">
                <CustomFormField
                  name={"firstName"}
                  label={"First Name"}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.firstName && formik.errors.firstName
                  )}
                  helperText={
                    formik.touched.firstName && formik.errors.firstName
                  }
                  type={"text"}
                />
                <CustomFormField
                  name={"middleName"}
                  label={"Middle Name"}
                  value={formik.values.middleName}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.middleName && formik.errors.middleName
                  )}
                  helperText={
                    formik.touched.middleName && formik.errors.middleName
                  }
                  type={"text"}
                />

                <CustomFormField
                  name={"surName"}
                  label={"Surname"}
                  value={formik.values.surName}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.surName && formik.errors.surName
                  )}
                  helperText={formik.touched.surName && formik.errors.surName}
                  type={"text"}
                />
                <CustomFormSelectField
                  name="position"
                  label="Position"
                  itemArray={[
                    {
                      id: 0,
                      name: "Admin",
                    },
                    {
                      id: 1,
                      name: "Manager",
                    },
                    {
                      id: 2,
                      name: "Cashier",
                    },
                  ]}
                  onChange={formik.handleChange}
                  value={formik.values.position}
                  error={Boolean(
                    formik.touched.position && formik.errors.position
                  )}
                  helperText={formik.touched.position && formik.errors.position}
                  type={"text"}
                />

                <CustomFormField
                  name={"phoneNumber"}
                  label={"Phone Number"}
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={Boolean(
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  )}
                  helperText={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                  type={"text"}
                />
                <CustomFormSelectField
                  name="gender"
                  label="Gender"
                  itemArray={[
                    {
                      id: 0,
                      name: "Male",
                    },
                    {
                      id: 1,
                      name: "Female",
                    },
                  ]}
                  onChange={formik.handleChange}
                  value={formik.values.gender}
                  error={Boolean(formik.touched.gender && formik.errors.gender)}
                  helperText={formik.touched.gender && formik.errors.gender}
                  type={"text"}
                />
              </Grid>
            </Stack>
            <LoadingButton
              loading={loading}
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2,
                boxShadow: "none",
                float: "right",
                mt: 3,
              }}
              onClick={handleNext}
            >
              Next
            </LoadingButton>
          </>
        );
      case 1:
        return (
          <>
            <Stack gap={3} sx={{ mt: 3 }}>
              <Typography variant="h6">
                Enter the new password and confirm
              </Typography>
              <Grid container spacing={4} alignItems="center">
                <CustomFormField
                  name={"email"}
                  label={"Email"}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.email && formik.touched.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  type={"email"}
                />
                <CustomFormField
                  name={"password"}
                  label={"New Password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  type={"password"}
                  error={Boolean(
                    formik.errors.password && formik.touched.password
                  )}
                  helperText={formik.touched.password && formik.errors.password}
                />
                <CustomFormField
                  name={"reenterPassword"}
                  label={"Re-enter password"}
                  value={formik.values.reenterPassword}
                  onChange={formik.handleChange}
                  type={"password"}
                  error={Boolean(
                    formik.touched.reenterPassword &&
                      formik.errors.reenterPassword
                  )}
                  helperText={
                    formik.touched.reenterPassword &&
                    formik.errors.reenterPassword
                  }
                />
              </Grid>
              <Stack
                flexDirection={"row"}
                gap={1.5}
                justifyContent={"flex-end"}
              >
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                  onClick={handleNext}
                >
                  Next
                </LoadingButton>
              </Stack>
            </Stack>
          </>
        );
      case 2:
        return (
          <>
            <Stack gap={3} sx={{ mt: 3 }}>
              <Typography variant="h6">
                Enter the verification code sent to your email
              </Typography>
              <Grid container spacing={4} alignItems="center">
                <CustomFormField
                  name={"verificationCode"}
                  label={"Verification Code"}
                  value={formik.values.verificationCode}
                  onChange={formik.handleChange}
                  type={"string"}
                  error={Boolean(
                    formik.touched.verificationCode &&
                      formik.errors.verificationCode
                  )}
                  helperText={
                    formik.touched.verificationCode &&
                    formik.errors.verificationCode
                  }
                />
              </Grid>
              <Stack
                flexDirection={"row"}
                gap={1.5}
                justifyContent={"flex-end"}
              >
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                  onClick={() => setActiveStep(activeStep - 1)}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                  onClick={handleClose}
                >
                  Next
                </Button>
              </Stack>
            </Stack>
          </>
        );

      default:
        return (
          <>
            <Zoom in={true}>
              <Stack
                direction={"column"}
                paddingTop={"10px"}
                alignSelf={"center"}
                alignItems={"center"}
              >
                <img src={UploadCompleteSvg} width={70} />
                <Typography
                  align="center"
                  sx={{ mt: 1 }}
                  fontWeight={400}
                  color={"inherit"}
                >{`File uploaded successfully!`}</Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    borderRadius: 2,
                    boxShadow: "none",
                  }}
                  onClick={handleNext}
                >
                  Finish
                </Button>
              </Stack>
            </Zoom>
          </>
        );
    }
  };

  return (
    <>
      <Dialog
        open={open}
        sx={{
          backdropFilter: "blur(5px)",
          ".MuiDialog-paper": {
            maxWidth: 600,
            minHeight: 200,
            borderRadius: 4,
            p: 1,
            pb: 0,
          },
        }}
      >
        <Stack flexDirection={"row"} justifyContent={"space-between"}>
          <DialogTitle variant="h5"> Hiring New Employee</DialogTitle>
          <IconButton
            onClick={() => {
              setActiveStep(0);
              formik.resetForm();
              handleClose();
            }}
            sx={{
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </Stack>

        <DialogContent
          sx={{
            width: "100%",
          }}
        >
          <Stepper activeStep={activeStep} sx={{ mb: 2 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ height: "100%" }}>{elementHandler(activeStep)}</Box>{" "}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddUserModal;
