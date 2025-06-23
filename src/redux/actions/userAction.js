import { createAsyncThunk } from "@reduxjs/toolkit";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance"

export const userLoginAction = createAsyncThunk(
  "user/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await userAxiosInstance.post("/login", {
        email,
        password,
      });

      console.log("Response after login: ", response);

      if (response.status === 200 && response.data.cred) {
        return {
          success: true,
          message: "User login successfully",
          userData: response.data.cred,
        };
      } else {
        throw new Error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error in userLoginAction thunk: ", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(errorMessage);
    }
  }
);

// OTP verification action
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
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "OTP verification failed";
      throw new Error(errorMessage);
    }
  }
);

export const userGoogleLoginAction = createAsyncThunk(
  "user/googleLogin",
  async (tokenData, { rejectWithValue }) => {
    try {
      console.log("Google login token data:", tokenData);

      const response = await userAxiosInstance.post("/google-login", tokenData);

      console.log("Response after google login: ", response);
      console.log("Response after google login cred: ", response.data.cred);

      if (response.status === 200 && response.data.cred) {
        return {
          success: true,
          message: "Google Auth successfully",
          userData: response.data.cred,
        };
      } else {
        throw new Error(response.data.message || "Google login failed");
      }
    } catch (error) {
      console.error("Error in userGoogleLoginAction thunk: ", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Google login failed";
      throw new Error(errorMessage);
    }
  }
);
