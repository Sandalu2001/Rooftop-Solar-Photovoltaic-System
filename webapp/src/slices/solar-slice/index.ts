import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { APIService } from "../../utils/apiService";
import { AppConfig } from "../../configs/configs";
import { State } from "../../types/common.type";

interface SolarSliceInterface {
  predictionState: State;
  addNewProductState: State;
  fetchProductsState: State;
}

const initialState: SolarSliceInterface = {
  predictionState: State.IDLE,
  fetchProductsState: State.IDLE,
  addNewProductState: State.IDLE,
};

const SolarSlice = createSlice({
  name: "solar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPrediction.pending, (state, action) => {
      state.predictionState = State.LOADING;
    });
    builder.addCase(getPrediction.fulfilled, (state, action) => {
      state.predictionState = State.SUCCESS;
    });
    builder.addCase(getPrediction.rejected, (state, action) => {
      state.predictionState = State.FAILED;
    });
  },
});

export const getPrediction = createAsyncThunk(
  "getPrediction",
  async (image: File, thunkAPI) => {
    try {
      const resp = await APIService.getInstance().postForm(
        AppConfig.serviceUrls.addImage,
        image
      );
      return resp.data;
    } catch (error) {
      return error;
    }
  }
);

export default SolarSlice.reducer;
