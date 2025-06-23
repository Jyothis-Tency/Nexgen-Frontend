"use client";

import { useState } from "react";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import {
  userGoogleLoginAction,
  userLoginAction,
} from "@/redux/actions/userAction";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { motion } from "framer-motion";
import GrapeAnimation from "@/components/GrapeAnimation"

// Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const GOOGLE_CLIENT_ID =
    "356987224140-nruiian6hrfgt5sk7bf0hi7o47lm210f.apps.googleusercontent.com";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        console.log("Login values:", values);

        const response = await dispatch(userLoginAction(values)).unwrap();
        console.log("Response after logging in:", response);

        if (response.success && response.userData) {
          localStorage.setItem("token", response.userData.token);
          toast.success("Login successful!");

          // Check if there's a stored job ID for redirect after login
          const storedJobId = localStorage.getItem("pendingJobId");
          setTimeout(() => {
            if (storedJobId) {
              localStorage.removeItem("pendingJobId");
              navigate(`/job-details/${storedJobId}`);
            } else {
              navigate("/");
            }
          }, 1500);
        }
      } catch (err) {
        console.error("Error in user login:", err);
        toast.error(err?.message || "Login failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    const { credential } = credentialResponse;
    console.log("Google login response: ", credential);
    try {
      const result = await dispatch(
        userGoogleLoginAction({ id_token: credential })
      ).unwrap();

      if (result && result.userData) {
        localStorage.setItem("token", result.userData.token);
        toast.success("Google Login successful!");

        // Check if there's a stored job ID for redirect after login
        const storedJobId = localStorage.getItem("pendingJobId");
        setTimeout(() => {
          if (storedJobId) {
            localStorage.removeItem("pendingJobId");
            navigate(`/job-details/${storedJobId}`);
          } else {
            navigate("/");
          }
        }, 1500);
      }
    } catch (err) {
      console.error("Error in Google login: ", err);
      toast.error(err?.message || "Google login failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col lg:flex-row h-screen"
    >
      {/* Left Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-6 lg:p-10"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div variants={itemVariants}>
            <Link to="/">
              <h1 className="text-2xl font-bold text-primary mb-8 text-center lg:text-left cursor-pointer">
                Techpath
              </h1>
            </Link>
          </motion.div>

          {/* Welcome Text */}
          <motion.h2
            variants={itemVariants}
            className="text-3xl font-semibold mb-4 text-center lg:text-left"
          >
            Discover Your Dream Career
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-gray-500 mb-6 text-center lg:text-left"
          >
            Log in to browse personalized job matches and connect with top
            companies. Your next adventure awaits!
          </motion.p>

          {/* Social Login Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col lg:flex-row gap-4 mb-6"
          >
            <div className="flex justify-center">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error("Google login failed");
                  }}
                />
              </GoogleOAuthProvider>
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative my-4">
            <span className="absolute bg-white px-4 -top-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
              or continue with email
            </span>
            <hr className="border-gray-300" />
          </motion.div>

          {/* Email and Password Form */}
          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={formik.handleSubmit}
          >
            <motion.div variants={itemVariants} className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                placeholder="Enter your email"
                aria-required="true"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="email"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              ) : null}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="mt-1 block w-full px-4 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Enter your password"
                  aria-required="true"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                  onClick={togglePasswordVisibility}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <PiEyeBold /> : <PiEyeSlashBold />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">
                  {formik.errors.password}
                </div>
              ) : null}
            </motion.div>

            {/* Remember Me */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between mb-4"
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-600 hover:underline cursor-pointer"
                aria-label="Forgot Password"
              >
                Forgot Password?
              </button>
            </motion.div>

            {/* Login Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </motion.button>
          </motion.form>

          {/* Create Account */}
          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-gray-600 mt-4"
          >
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/sign-up")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Create a user account
            </button>
          </motion.p>

          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-gray-600 mt-4"
          >
            OR
          </motion.p>
          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-gray-600 mt-4"
          >
            Are you a Recruiter?{" "}
            <button
              onClick={() => navigate("/employer/employer-login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Login to hire candidates
            </button>
          </motion.p>
        </div>
      </motion.div>

      {/* Right Section */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center text-center text-white p-6 lg:p-10"
      >
        <div className="max-w-md">
          <GrapeAnimation className="sm:hidden" />
          <motion.h2
            variants={itemVariants}
            className="text-2xl lg:text-3xl font-semibold mb-4"
          >
            Find Jobs for Mobile Technicians
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base lg:text-lg text-gray-200 mb-4"
          >
            Discover the best opportunities and connect with employers who value
            your skills.
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
