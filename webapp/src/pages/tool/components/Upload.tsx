import {
  alpha,
  Button,
  FormControl,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
  Zoom,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FactCard from "../../../components/common/FactCard";
import CustomFormField from "../../../components/common/CustomFormField";
import { StepperInterface } from "../../../types/componentInterfaces";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAppDispatch, useAppSelector } from "../../../slices/store";
import { useFormik } from "formik";
import { uploadImageSchema } from "../../../utils/utils";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import UploadCompleteImage from "../../../assets/images/upload-complete.svg";
import DownloadIcon from "@mui/icons-material/Download";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  getAnnotatedImage,
  setImageData,
  setMetaData,
} from "../../../slices/solar-slice";
import { enqueueSnackbarMessage } from "../../../slices/commonSlice/common";
import { State } from "../../../types/common.type";
import { LoadingButton } from "@mui/lab";
import GLBViewer from "./Visualizer";
import Visualizer1 from "./Scene";

const Upload = ({ setActiveStep }: StepperInterface) => {
  const [image, setImage] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const predictionState = useAppSelector(
    (state) => state.solar.predictionState
  );
  const dispatch = useAppDispatch();

  // -----------------------------------------------//
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setImage(file);
      dispatch(setImageData(file));
      setFileName(file.name);
      formik.setFieldValue("file", file ? file : null, true);
    }
  };
  // -----------------------------------------------//

  //-------------------------------------------------//
  const handleDownload = () => {
    if (!image) return;

    const url = URL.createObjectURL(image);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  //-------------------------------------------------//

  //--- FORMIK HANDLE ------//
  const formik = useFormik({
    initialValues: {
      dataset: "",
      latitude: 0,
      longtitude: 0,
      date: null,
      file: null,
    },

    validationSchema: uploadImageSchema,

    onSubmit(values) {
      const formData = new FormData();
      formData.append("file", image as Blob);

      dispatch(
        setMetaData({
          latitude: values.latitude,
          longitude: values.longtitude,
          date: values.date ? new Date(values.date) : new Date(),
        })
      );

      image
        ? dispatch(getAnnotatedImage(image))
        : dispatch(
            enqueueSnackbarMessage({
              message: "No image found :(",
              type: "error",
            })
          );
    },
  });
  //-------------------------//

  useEffect(() => {
    predictionState === State.SUCCESS ? setActiveStep(1) : console.log();
  }, [predictionState]);

  return (
    <Stack
      height={"100%"}
      sx={{
        alignContent: "center",
        paddingY: 8,
        gap: 2,
      }}
    >
      <Stack
        sx={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Stack
          flex={1}
          sx={{
            gap: 2,
          }}
        >
          <FactCard
            description="Understand the costs and advantages of switching to renewable energy, Uncover what your peers are doing in the region"
            color="inherit"
          />
          <FactCard
            description="Get standardized views of data and insight across borders and
languages to more easily compare and strategize"
            color="inherit"
          />
          <FactCard
            description="Talk to our experts and read their research and analysis reports"
            color="primary"
          />
          <FactCard
            description="Understand the costs and advantages of switching to renewable energy, Uncover what your peers are doing in the region"
            color="inherit"
          />
        </Stack>
        <Paper
          variant="outlined"
          sx={{
            flex: 1.2,
            borderRadius: 3,
            p: 5,
            background: "none",
            display: "flex",
            gap: 4,
            flexDirection: "column",
          }}
        >
          <Stack>
            <Typography variant="h6" fontWeight={"500"}>
              Upload satellite image
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                borderRadius: 3,
                borderStyle: "dashed",
                borderColor: (theme) => alpha(theme.palette.primary.main, 1),
                p: 1,
                marginY: 1.5,
                background: (theme) =>
                  alpha(
                    theme.palette.primary.main,
                    theme.palette.action.activatedOpacity
                  ),
              }}
            >
              {!image ? (
                <label htmlFor="select-image">
                  <Stack
                    justifyContent={"center"}
                    alignItems={"center"}
                    sx={{
                      position: "relative",
                      m: 5,
                      cursor: "pointer",
                      height: 130,
                    }}
                  >
                    <UploadFileIcon
                      fontSize="large"
                      color="disabled"
                      sx={{ fontSize: 60 }}
                    />
                    <Typography variant="h5" sx={{ m: 1 }}>
                      Drop your image here or Browse
                    </Typography>
                    <Typography
                      fontWeight={400}
                      variant={"body2"}
                      sx={{ m: 1, color: "GrayText" }}
                    >
                      Supports: PNG, JPG, JPEG,WEBP
                    </Typography>
                    <input
                      accept=".png,.jpg,.jpeg,.webp"
                      type="file"
                      id="select-image"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </Stack>
                </label>
              ) : (
                <Zoom in={true}>
                  <Stack
                    direction={"column"}
                    paddingTop={"10px"}
                    sx={{
                      height: 130,

                      justifyContent: "center",
                    }}
                  >
                    <img src={UploadCompleteImage} height={"60px"} />
                    <Typography
                      align="center"
                      sx={{ mt: 1 }}
                      fontWeight={400}
                      color={"inherit"}
                    >{`File uploaded successfully!`}</Typography>

                    <Stack flexDirection={"row"} justifyContent={"center"}>
                      <Button
                        size="small"
                        startIcon={<DownloadIcon sx={{ fontSize: 5 }} />}
                        sx={{
                          bgcolor: "transparent",
                          mt: 1,
                          "&:hover": {
                            textDecoration: "underline",
                            boxShadow: "none",
                            cursor: "pointer",
                          },
                          fontWeight: 200,
                          fontSize: 30,
                          typography: "caption",
                        }}
                        onClick={handleDownload}
                      >
                        {fileName}
                      </Button>

                      <IconButton
                        color="error"
                        size="small"
                        sx={{ mt: 0.6, ml: 1 }}
                        onClick={() => setImage(null)}
                      >
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Zoom>
              )}
            </Paper>
          </Stack>

          <Grid container spacing={2}>
            <CustomFormField
              name={"dataset"}
              label={"Dataset"}
              value={formik.values.dataset}
              onChange={formik.handleChange}
              error={formik.touched.dataset && Boolean(formik.errors.dataset)}
              onBlur={formik.handleBlur}
              helperText={formik.touched.dataset && formik.errors.dataset}
              type={"text"}
            />
            <CustomFormField
              name={"latitude"}
              label={"Latitude"}
              onChange={formik.handleChange}
              error={formik.touched.latitude && Boolean(formik.errors.latitude)}
              value={formik.values.latitude}
              helperText={formik.touched.latitude && formik.errors.latitude}
              onBlur={formik.handleBlur}
              type={"text"}
            />
            <CustomFormField
              name={"longtitude"}
              label={"Lontitude"}
              value={formik.values.longtitude}
              onChange={formik.handleChange}
              helperText={formik.touched.longtitude && formik.errors.longtitude}
              error={
                formik.touched.longtitude && Boolean(formik.errors.longtitude)
              }
              onBlur={formik.handleBlur}
              type={"text"}
            />
            <Grid size={4}>
              <Typography variant="h6" color={"GrayText"}>
                {"Date"}
              </Typography>
            </Grid>
            <Grid size={8}>
              <FormControl
                fullWidth
                size="small"
                margin="dense"
                sx={{ flex: 1, width: "100%" }}
                error={Boolean(formik.errors.date)}
              >
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={["DatePicker"]}
                    sx={{ width: "100%" }}
                  >
                    <DatePicker
                      name="date"
                      label="Date of Picture taken"
                      sx={{
                        width: "100%",
                        "& .MuiInputBase-root": {
                          height: 40,
                          borderRadius: 2,
                        },
                        "&:focus-within .MuiInputLabel-root": {
                          top: 0,
                        },
                        ".MuiInputLabel-root": {
                          top: -5,
                        },
                        "& legend": { display: "none" },
                        "& .MuiInputLabel-root": {
                          display: "none",
                        },
                        borderSize: 3,
                      }}
                      value={
                        formik.values.date ? dayjs(formik.values.date) : null
                      }
                      onChange={(value: any) =>
                        formik.setFieldValue(
                          "date",
                          value ? value.format("YYYY-MM-DD").toString() : null,
                          true
                        )
                      }
                      slotProps={{
                        textField: {
                          variant: "outlined",
                          error: Boolean(formik.errors.date),
                          helperText: formik.errors.date,
                        },
                      }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      </Stack>

      <LoadingButton
        loading={predictionState === State.LOADING}
        disabled={!formik.isValid}
        variant="contained"
        color="primary"
        size="large"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          formik.handleSubmit(e as any)
        }
        sx={{
          display: "flex",
          alignSelf: "end",
          borderRadius: 2,
          boxShadow: "none",
          "&:hover .MuiSvgIcon-root": {
            position: "relative",
            animation: "moveIcon 0.4s infinite alternate ease-in-out",
          },
          "@keyframes moveIcon": {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(8px)" },
          },
        }}
        endIcon={<ArrowForwardIcon />}
      >
        Get the insights
      </LoadingButton>

      {/* <GLBViewer /> */}
      {/* <Visualizer1 /> */}

      <Stack />
    </Stack>
  );
};

export default Upload;
