import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "../../utils/apiService";
import { AppConfig } from "../../configs/configs";
import { State } from "../../types/common.type";
import { enqueueSnackbarMessage } from "../commonSlice/common";
import { CocoDataInterface } from "../../types/componentInterfaces";

interface SolarSliceInterface {
  predictionState: State;
  addNewProductState: State;
  fetchProductsState: State;
  cocoJSON: CocoDataInterface;
  image: File | null;
}

const initialState: SolarSliceInterface = {
  predictionState: State.IDLE,
  fetchProductsState: State.IDLE,
  addNewProductState: State.IDLE,
  cocoJSON: { coco_output: { images: [], annotations: [], categories: [] } },
  image: null,
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

export const { setUpdatePredictionState, setImageData } = SolarSlice.actions;
export default SolarSlice.reducer;
