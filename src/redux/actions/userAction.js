import { createAsyncThunk } from "@reduxjs/toolkit";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";

export const userLoginAction = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await userAxiosInstance.post("/login", {
        email,
        password,
      });
      console.log("Response after login: ", response);
      if (response.status === 200) {
        return {
          success: true,
          message: "User login successfully",
          userData: response.data.cred,
        };
      }
    } catch (error) {
      console.error("Error in userLoginAction thunk: ", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }
);

// New action for OTP verification
export const userOtpVerificationAction = createAsyncThunk(
  "user/otpVerification",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      console.log("=== OTP VERIFICATION ACTION ===");
      console.log("Email:", email, "OTP:", otp);

      const response = await userAxiosInstance.post("/verify-otp", {
        email,
        otp,
      });

      console.log("OTP verification response:", response);

      if (response.status === 200 && response.data.status) {
        return {
          success: true,
          message: "OTP verification successful",
          userData: response.data.cred,
        };
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error("Error in userOtpVerificationAction thunk:", error);
      throw new Error(
        error.response?.data?.message || "OTP verification failed"
      );
    }
  }
);

export const userGoogleLoginAction = createAsyncThunk(
  "user/googleLogin",
  async (id_token, { rejectWithValue }) => {
    try {
      const response = await userAxiosInstance.post("/google-login", {
        credential: id_token,
      });
      console.log("Response after google login: ", response);
      console.log("Response after google login cred: ", response.data.cred);
      if (response.status === 200) {
        return {
          message: "Google Auth successfully",
          userData: response.data.cred,
        };
      }
    } catch (error) {
      console.error("Error in userGoogleLoginAction thunk: ", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  }
);
