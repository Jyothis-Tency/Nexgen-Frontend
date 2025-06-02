import { createSlice } from "@reduxjs/toolkit";
import {
  employerLogin,
  employerOtpVerificationAction,
  updateEmployer,
} from "../actions/EmployerAction";

const initialState = {
  employer: {},
  error: null,
  loading: false,
};

const employerSlice = createSlice({
  name: "employer",
  initialState,
  reducers: {
    logout: (state) => {
      state.employer = {};
      state.error = null;
      state.loading = false;
    },
    setEmployer: (state, action) => {
      state.employer = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle employer login
      .addCase(employerLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(employerLogin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.employer = action.payload.employerData || {};
        }
      })
      .addCase(employerLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })

      // Handle employer OTP verification
      .addCase(employerOtpVerificationAction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(employerOtpVerificationAction.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.employer = action.payload.employerData || {};
        }
      })
      .addCase(employerOtpVerificationAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "OTP verification failed";
      })

      // Handle employer profile update
      .addCase(updateEmployer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateEmployer.fulfilled, (state, action) => {
        state.loading = false;
        state.employer = { ...state.employer, ...action.payload.employerData };
      })
      .addCase(updateEmployer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, setEmployer, clearError } = employerSlice.actions;
export default employerSlice.reducer;
