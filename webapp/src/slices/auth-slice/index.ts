import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../../types/componentInterfaces";
import { getCurrentUser, GetCurrentUserOutput } from "aws-amplify/auth";

interface AuthSlice {
  authState: AuthState;
  username: string;
  userId: string;
}

const initialState: AuthSlice = {
  authState: AuthState.LOGOUT,
  username: "",
  userId: "",
};

const AuthSlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setAuthState: (state, action) => {
      state.authState = action.payload;
    },
    setCurrentUser: (state, action) => {
      state.username = action.payload.username;
      state.userId = action.payload.userId;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(currentAuthenticatedUser.pending, (state) => {
      console.log("Pending");
    });
    builder.addCase(
      currentAuthenticatedUser.fulfilled,
      (state, action: PayloadAction<GetCurrentUserOutput>) => {
        state.username = action.payload.username;
        state.userId = action.payload.userId;
      }
    );
    builder.addCase(currentAuthenticatedUser.rejected, (state) => {
      console.log("Failed");
    });
  },
});

export const currentAuthenticatedUser = createAsyncThunk<GetCurrentUserOutput>(
  "currentAuthenticatedUser",
  async (_, thunkAPI) => {
    try {
      const resp: GetCurrentUserOutput = await getCurrentUser();
      return resp;
    } catch (error) {
      console.log("Failed");
      throw error;
    }
  }
);

export const { setAuthState, setCurrentUser } = AuthSlice.actions;
export default AuthSlice.reducer;
