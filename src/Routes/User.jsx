import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./../pages/Login";
import ForgotPassword from "./../pages/ForgotPassword";
import RegisterOtp from "./../pages/RegisterOtp";
import SignupPage from "./../pages/SignUp";
import Profile from "../pages/User/Outlets/Profile";
import CompleteProfile from "../pages/User/Outlets/CompleteProfile";
import JobApplication from "../pages/User/Outlets/JobApplication";
import Home from "../pages/User/Outlets/Home";
import ApplicationSubmitted from "../pages/User/Outlets/ApplicationSubmitted";
import NotFound from "@/pages/User/NotFound";
// import Home2 from "../pages/Home2";
import AllJobsPage from "../pages/User/Outlets/AllJobs";
import JobDetailPage from "../pages/User/Outlets/JobDetails";
// import Home3 from "@/pages/Home3";
import HomeLayout from "@/pages/User/Layout/HomeLayout";
import JobApplicationHistory from "@/pages/User/Outlets/JobApplicationHistory";
import { UserProtectedRoute } from "@/services/userProtector";
import ForgotPasswordOtp from "@/pages/ForgotPasswordOtp";
import ResetPassword from "@/pages/ResetPassword";

function User() {
  return (
    <Routes>
      {/* <Route path="/" element={<Home3 />} /> */}
      {/* <Route path="/home" element={<Home3 />} /> */}
      {/* <Route path="/home3" element={<Home3 />} /> */}
      <Route path="/sign-up" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp-verification" element={<RegisterOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password-otp" element={<ForgotPasswordOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
        <Route
          path="/complete-profile"
          element={
            <UserProtectedRoute>
              <CompleteProfile />
            </UserProtectedRoute>
          }
        />
        {/* User Protected Routes */}
        <Route path="/all-jobs" element={<AllJobsPage />} />
        <Route path="/job-details/:id" element={<JobDetailPage />} />
        <Route
          path="/job-application/:id"
          element={
            <UserProtectedRoute>
              <JobApplication />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/application-submitted"
          element={
            <UserProtectedRoute>
              <ApplicationSubmitted />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/job-application-history"
          element={
            <UserProtectedRoute>
              <JobApplicationHistory />
            </UserProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <UserProtectedRoute>
              <Profile />
            </UserProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}


export default User;
