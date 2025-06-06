import { createSlice } from "@reduxjs/toolkit";
import {
  userLoginAction,
  userOtpVerificationAction,
  userGoogleLoginAction,
} from "@/redux/actions/userAction";

const initialState = {
  seekerInfo: {},
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.seekerInfo = {};
      state.error = null;
      state.loading = false;
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user-email");
      localStorage.removeItem("email");
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.seekerInfo = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login actions
      .addCase(userLoginAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLoginAction.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.userData) {
          state.seekerInfo = action.payload.userData;
        }
      })
      .addCase(userLoginAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })

      // OTP Verification actions
      .addCase(userOtpVerificationAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userOtpVerificationAction.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.userData) {
          state.seekerInfo = action.payload.userData;
        }
      })
      .addCase(userOtpVerificationAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "OTP verification failed";
      })

      // Google Login actions
      .addCase(userGoogleLoginAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userGoogleLoginAction.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.userData) {
          state.seekerInfo = action.payload.userData;
        }
      })
      .addCase(userGoogleLoginAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Google login failed";
      });
  },
});

export const { logout, clearError, setUser } = userSlice.actions;

export default userSlice.reducer;
