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
import {
  confirmResetPassword,
  ConfirmResetPasswordInput,
  resetPassword,
  type ResetPasswordOutput,
} from "aws-amplify/auth";

import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import { ResetPasswordProps } from "../../types/componentInterfaces";
import CustomFormField from "../common/CustomFormField";
import UploadCompleteSvg from "../../assets/images/upload-complete.svg";
import * as Yup from "yup";

export const validationSchemas = [
  Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
  }),
  Yup.object({
    verificationCode: Yup.string().required("Required").min(4),
  }),
  Yup.object({
    password: Yup.string()
      .required("Please enter your password.")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
    reenterPassword: Yup.string()
      .required("Please re-enter your password.")
      .min(8, "Password is too short - should be 8 chars minimum.")
      .equals([Yup.ref("password")], "Passwords must match"),
  }),
];

const ResetPasswordModal = ({ open, handleClose }: ResetPasswordProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const steps = [
    "Find Your Account",
    "Enter the Verify code",
    "Reset the password",
  ];

  const handleResetPassword = async (username: string) => {
    setLoading(true);
    try {
      const output = await resetPassword({ username });
      handleResetPasswordNextSteps(output);
      setActiveStep(activeStep + 1);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleResetPasswordNextSteps = (output: ResetPasswordOutput) => {
    const { nextStep } = output;
    switch (nextStep.resetPasswordStep) {
      case "CONFIRM_RESET_PASSWORD_WITH_CODE":
        const codeDeliveryDetails = nextStep.codeDeliveryDetails;
        console.log(
          `Confirmation code was sent to ${codeDeliveryDetails.deliveryMedium}`
        );
        break;
      case "DONE":
        console.log("Successfully reset password.");
        break;
    }
  };

  const handleConfirmResetPassword = async ({
    username,
    confirmationCode,
    newPassword,
  }: ConfirmResetPasswordInput) => {
    setLoading(true);
    try {
      await confirmResetPassword({ username, confirmationCode, newPassword });
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      verificationCode: "",
      password: "",
      reenterPassword: "",
    },
    validationSchema: validationSchemas[activeStep],
    onSubmit: (values) => {
      switch (activeStep) {
        case 0:
          handleResetPassword(values.email);
          break;
        case 1:
          setActiveStep(activeStep + 1);
          break;
        case 2:
          handleConfirmResetPassword({
            username: values.email,
            confirmationCode: values.verificationCode,
            newPassword: values.password,
          });
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
                Enter the email address you used when you joined and we’ll send
                you instructions to reset your password.
              </Typography>

              <Grid container spacing={4} alignItems="center">
                <CustomFormField
                  name={"email"}
                  label={"Email Address"}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={Boolean(formik.touched.email && formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
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
                Enter the verification code you used when you joined and we’ll
                send you instructions to reset your password.
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
                  onClick={handleNext}
                >
                  Next
                </Button>
              </Stack>
            </Stack>
          </>
        );
      case 2:
        return (
          <>
            <Stack gap={3} sx={{ mt: 3 }}>
              <Typography variant="h6">
                Enter the new password and confirm
              </Typography>
              <Grid container spacing={4} alignItems="center">
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
          <DialogTitle variant="h5"> Forgot password?</DialogTitle>
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

export default ResetPasswordModal;
