import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { APIService } from "../../utils/apiService";
import { AppConfig } from "../../configs/configs";
import { State } from "../../types/common.type";
import { enqueueSnackbarMessage } from "../commonSlice/common";
import { CocoDataInterface } from "../../types/componentInterfaces";
import { type } from "os";
import { error, log, warn } from "console";
import { encode, stringify } from "querystring";
import { arrayBuffer, buffer } from "stream/consumers";

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
      }
    );
    builder.addCase(get3DModel.rejected, (state, action) => {
      state.modelState = State.FAILED;
    });

    builder.addCase(get3DObjectJSON.pending, (state, action) => {
      state.modelState = State.LOADING;
    });
    builder.addCase(
      get3DObjectJSON.fulfilled,
      (state, action: PayloadAction<CocoDataInterface>) => {
        state.modelState = State.SUCCESS;
        state.coco3DJSON = action.payload; // Assuming action.payload is a File object
        console.log("3D Model file received");
      }
    );
    builder.addCase(get3DObjectJSON.rejected, (state, action) => {
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

export const get3DModel = createAsyncThunk<
  File,
  { image: File | null; cocoData: CocoDataInterface }
>("get3DModel", async (data, { dispatch }) => {
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

    console.log("Response Headers:", resp.headers);
    console.log("resp.data:", resp.data);
    console.log("typeof resp.data:", typeof resp.data);

    let modelData: ArrayBuffer | null = null; // Initialize as null

    if (resp.data instanceof ArrayBuffer) {
      console.log(
        "resp.data is ArrayBuffer, byteLength:",
        resp.data.byteLength
      );
      modelData = resp.data; // Data is already ArrayBuffer - perfect!
    } else if (resp.data instanceof Blob) {
      console.log("resp.data is Blob, size:", resp.data.size);
      modelData = await resp.data.arrayBuffer(); // Convert Blob to ArrayBuffer
      console.log(
        "Blob read as ArrayBuffer, byteLength:",
        modelData.byteLength
      );
    } else if (typeof resp.data === "string") {
      console.warn(
        "WARNING: resp.data is STRING - This is likely INCORRECT for binary .glb data. Check your APIService configuration!"
      );
      console.warn(
        "Attempting to convert string to ArrayBuffer as a workaround, but data loss may occur."
      );
      // **VERY IMPORTANT: String to ArrayBuffer conversion is NOT ideal for binary data.**
      // **This is a WORKAROUND. The REAL FIX is to ensure your APIService fetches binary data correctly.**
      const encoder = new TextEncoder(); // Use TextEncoder to convert string to Uint8Array
      const uint8Array = encoder.encode(resp.data); // Encode the string to Uint8Array
      modelData = uint8Array.buffer; // Get the ArrayBuffer from Uint8Array
      console.log(
        "String converted to ArrayBuffer, byteLength:",
        modelData.byteLength
      );
    } else {
      console.error(
        "resp.data is NOT ArrayBuffer, Blob, or String - UNEXPECTED TYPE!"
      );
      throw new Error("Unexpected data type received for 3D model."); // Stop processing if unexpected type
    }

    if (!modelData) {
      throw new Error("Failed to obtain ArrayBuffer for 3D model data."); // Error if modelData is still null
    }

    const file = new File([modelData], "model.glb", {
      // Use the ArrayBuffer (or null if conversion failed)
      type: "model/gltf-binary",
    });
    return file;
  } catch (error) {
    dispatch(
      enqueueSnackbarMessage({
        message: "SnackMessage.error.sendHiringDetails",
        type: "error",
      })
    );
    throw error;
  }
});

export const get3DObjectJSON = createAsyncThunk<
  CocoDataInterface,
  { image: File | null; cocoData: CocoDataInterface }
>("get3DObjectJSON", async (data, { dispatch }) => {
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
        message: "Successfully fetched coco data ;)",
        type: "success",
      })
    );
    return resp.data;
  } catch (error) {
    dispatch(
      enqueueSnackbarMessage({
        message: "Something went wrong :(",
        type: "error",
      })
    );
    throw error;
  }
});

export const { setUpdatePredictionState, setImageData } = SolarSlice.actions;
export default SolarSlice.reducer;
