import React, { useEffect, useState } from "react";
import {
  Typography,
  Stack,
  Avatar,
  alpha,
  IconButton,
  Box,
  Button,
  Divider,
  Backdrop,
  CircularProgress,
  FormHelperText,
  LinearProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../slices/store";
import CustomTextField from "./common/CustomTextField";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import FacebookIcon from "../assets/images/facebook.png";
import GoogleIcon from "../assets/images/google.png";
import LoginImg from "../assets/images/login.svg";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn, resetPassword } from "@aws-amplify/auth";
import { AuthState } from "../types/componentInterfaces";
import ResetPasswordModal from "./modal/ResetPasswordModal";
import { useNavigate } from "react-router-dom";
import { APIService } from "../utils/apiService";
import { fetchAuthSession } from "aws-amplify/auth";
import { setAuthState } from "../slices/auth-slice";
import { LoadingButton } from "@mui/lab";

const validationSchema = Yup.object().shape({
  email: Yup.string().email().required("Please enter your email."),
  password: Yup.string()
    .required("Please enter your password.")
    .min(2, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [helperText, setHelperText] = useState<string | null>(null);
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false);
  const authState = useAppSelector((state) => state.auth.authState);

  const handleChangeWithTouch = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldTouched(e.target.name, true, false);
    formik.handleChange(e);
  };

  useEffect(() => {
    if (authState === AuthState.ACTIVE) {
      navigate("/");
    }
  }, [authState, navigate]);

  const formik = useFormik({
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      localStorage.setItem("pos-app-state", AuthState.LOADING);
      dispatch(setAuthState(AuthState.LOADING));
      setHelperText(null);
      try {
        const { isSignedIn } = await signIn({
          username: values.email,
          password: values.password,
        });
        console.log("Successfully signed in", isSignedIn);
        localStorage.setItem("pos-app-state", AuthState.ACTIVE);
        dispatch(setAuthState(AuthState.ACTIVE));
        navigate("/");
      } catch (error: any) {
        dispatch(setAuthState(AuthState.LOGOUT));
        setHelperText(error.toString());
        localStorage.setItem("pos-app-state", AuthState.LOGOUT);
        console.log(error);
      }
    },
  });

  return (
    <>
      {authState == AuthState.LOADING && (
        <LinearProgress
          sx={{ position: "absolute", top: 0, width: "100%", height: 3 }}
        />
      )}
      <Stack flexDirection={"row"} gap={0} sx={{ height: "100%" }}>
        <Box
          sx={{
            flex: 4,
            background: (theme) => alpha(theme.palette.grey[500], 0.1),
          }}
        >
          <Stack
            sx={{
              m: 12,
              mt: 20,
              alignItems: "center",
            }}
            gap={8}
          >
            <img src={LoginImg} width={450} />

            <Stack gap={1.5} textAlign={"center"}>
              <Typography variant="h4" fontWeight={600}>
                Welcome back
              </Typography>
              <Typography variant="h6" color={"GrayText"}>
                Start managing your finance faster and better
              </Typography>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ flex: 4 }}>
          <Stack sx={{ m: 12, marginX: 20 }} gap={4}>
            <Stack gap={1.5}>
              <Typography variant="h4" fontWeight={600}>
                Welcome back
              </Typography>
              <Typography variant="h6" color={"GrayText"}>
                Start managing your finance faster and better
              </Typography>
            </Stack>
            <Stack gap={2}>
              <CustomTextField
                name={"email"}
                label={"Email"}
                id={"email"}
                type={"email"}
                value={formik.values.email}
                onChange={handleChangeWithTouch}
                error={Boolean(
                  (formik.touched.email && formik.errors.email) || helperText
                )}
                helperText={formik.touched.email && formik.errors.email}
                startIcon={
                  <IconButton
                    sx={{
                      p: 1.2,
                      mb: 0.5,
                      border: "none",
                      borderRadius: 2,
                      bgcolor: (theme) => theme.palette.background.paper,
                    }}
                  >
                    <MailOutlineRoundedIcon color="primary" />
                  </IconButton>
                }
              />

              <CustomTextField
                name={"password"}
                label={"Password"}
                value={formik.values.password}
                onChange={handleChangeWithTouch}
                id={"password"}
                type={"password"}
                error={Boolean(
                  (formik.touched.password && formik.errors.password) ||
                    helperText
                )}
                helperText={formik.touched.password && formik.errors.password}
                endIcon={<VisibilityRoundedIcon color="primary" />}
              />

              {helperText && (
                <FormHelperText sx={{ color: "red", fontSize: 10 }}>
                  {helperText}
                </FormHelperText>
              )}
            </Stack>
            <Stack gap={2}>
              <Typography
                variant="h6"
                color={"primary.main"}
                onClick={() => setOpenResetPasswordModal(true)}
                paragraph
                component="span"
                sx={{
                  textDecoration: "underline",
                  textAlign: "end",
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </Typography>
              <LoadingButton
                variant="contained"
                sx={{ borderRadius: 2, p: 1.5 }}
                size="large"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  formik.submitForm();
                }}
                loading={authState == AuthState.LOADING}
              >
                Login
              </LoadingButton>
            </Stack>
            <Divider textAlign="center" sx={{ fontSize: 14 }}>
              or
            </Divider>
            <Stack gap={2} flexDirection={"row"}>
              <Button
                variant="outlined"
                sx={{ borderRadius: 2, flex: 1 }}
                color="inherit"
                startIcon={
                  <Avatar sx={{ width: 25, height: 25 }} src={GoogleIcon} />
                }
              >
                Google
              </Button>
              <Button
                variant="outlined"
                sx={{ borderRadius: 2, flex: 1 }}
                color="inherit"
                startIcon={
                  <Avatar sx={{ width: 25, height: 25 }} src={FacebookIcon} />
                }
              >
                Facebook
              </Button>
            </Stack>
            <Stack
              flexDirection={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={2}
            >
              <Typography variant="h6" color={"GrayText"}>
                Don't you have an account?
              </Typography>
              <Typography
                variant="h6"
                fontWeight={600}
                color={"primary.main"}
                sx={{ textDecoration: "underline", textAlign: "end" }}
              >
                Sign Up
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <ResetPasswordModal
          open={openResetPasswordModal}
          handleClose={() => setOpenResetPasswordModal(false)}
        />
      </Stack>
    </>
  );
};

export default Login;
