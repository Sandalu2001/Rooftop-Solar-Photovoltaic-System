import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "../../utils/apiService";
import { AppConfig } from "../../configs/configs";
import { State } from "../../types/common.type";
import { enqueueSnackbarMessage } from "../commonSlice/common";
import { CocoDataInterface } from "../../types/componentInterfaces";

interface SolarSliceInterface {
  predictionState: State;
  addNewProductState: State;
  getPairsState: State;
  modelState: State;
  cocoJSON: CocoDataInterface;
  image: File | null;
  Image3D: File | null;
  coco3DJSON: CocoDataInterface;
}

const initialState: SolarSliceInterface = {
  predictionState: State.IDLE,
  getPairsState: State.IDLE,
  modelState: State.IDLE,
  addNewProductState: State.IDLE,
  cocoJSON: { coco_output: { images: [], annotations: [], categories: [] } },
  coco3DJSON: { coco_output: { images: [], annotations: [], categories: [] } },
  image: null,
  Image3D: null,
};

const SolarSlice = createSlice({
  name: "solar",
  initialState,
  reducers: {
    setUpdatePredictionState: (state, action: PayloadAction<State>) => {
      state.predictionState = action.payload;
    },
    setImageData: (state, action: PayloadAction<File>) => {
      state.image = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAnnotatedImage.pending, (state, action) => {
      state.predictionState = State.LOADING;
    });
    builder.addCase(
      getAnnotatedImage.fulfilled,
      (state, action: PayloadAction<CocoDataInterface>) => {
        state.predictionState = State.SUCCESS;
        console.log(action.payload);
        state.cocoJSON = action.payload;
      }
    );
    builder.addCase(getAnnotatedImage.rejected, (state, action) => {
      state.predictionState = State.FAILED;
    });
    builder.addCase(getPairs.pending, (state, action) => {
      state.getPairsState = State.LOADING;
    });
    builder.addCase(
      getPairs.fulfilled,
      (state, action: PayloadAction<CocoDataInterface>) => {
        state.getPairsState = State.SUCCESS;
        state.cocoJSON = action.payload;
      }
    );
    builder.addCase(getPairs.rejected, (state, action) => {
      state.getPairsState = State.FAILED;
    });

    builder.addCase(get3DModel.pending, (state, action) => {
      state.modelState = State.LOADING;
    });
    builder.addCase(
      get3DModel.fulfilled,
      (state, action: PayloadAction<File>) => {
        state.modelState = State.SUCCESS;
        state.Image3D = action.payload;
        console.log("Picture reseved");
      }
    );
    builder.addCase(get3DModel.rejected, (state, action) => {
      state.modelState = State.FAILED;
    });
  },
});

export const getAnnotatedImage = createAsyncThunk(
  "getAnnotation",
  async (image: File, { dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const resp = await APIService.getInstance().postForm(
        AppConfig.serviceUrls.getAnnotation,
        formData
      );
      dispatch(
        enqueueSnackbarMessage({
          message: "SnackMessage.success.sendHiringDetails",
          type: "success",
        })
      );
      return resp.data;
    } catch (error) {
      dispatch(
        enqueueSnackbarMessage({
          message: "SnackMessage.error.sendHiringDetails",

          type: "error",
        })
      );
      return error;
    }
  }
);

export const getPairs = createAsyncThunk(
  "getPairs",
  async (cocoData: CocoDataInterface, { dispatch }) => {
    try {
      const resp = await APIService.getInstance().post(
        AppConfig.serviceUrls.getPairs,
        cocoData
      );
      dispatch(
        enqueueSnackbarMessage({
          message: "SnackMessage.success.sendHiringDetails",
          type: "success",
        })
      );
      return resp.data;
    } catch (error) {
      dispatch(
        enqueueSnackbarMessage({
          message: "SnackMessage.error.sendHiringDetails",

          type: "error",
        })
      );
      return error;
    }
  }
);

export const get3DModel = createAsyncThunk(
  "get3DModel",
  async (
    data: { image: File | null; cocoData: CocoDataInterface },
    { dispatch }
  ) => {
    try {
      const formData = new FormData();
      formData.append(
        "image",
        data.image ? data.image : new File([""], "filename")
      );
      formData.append("json", JSON.stringify(data.cocoData));

      const resp = await APIService.getInstance().postForm(
        AppConfig.serviceUrls.get3DModel,
        formData
      );
      dispatch(
        enqueueSnackbarMessage({
          message: "SnackMessage.success.sendHiringDetails",
          type: "success",
        })
      );
      return resp.data;
    } catch (error) {
      dispatch(
        enqueueSnackbarMessage({
          message: "SnackMessage.error.sendHiringDetails",

          type: "error",
        })
      );
      return error;
    }
  }
);
export const { setUpdatePredictionState, setImageData } = SolarSlice.actions;
export default SolarSlice.reducer;
