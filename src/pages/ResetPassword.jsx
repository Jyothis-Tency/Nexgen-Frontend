"use client";

import { useState, useEffect } from "react";
import GrapeAnimation from "../components/GrapeAnimation";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { motion } from "framer-motion";

// Animation variants
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

const ResetPassword = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const email = localStorage.getItem("forgotPasswordEmail");
  const token = localStorage.getItem("forgotPasswordToken");

  useEffect(() => {
    // Redirect if no email or token found
    // if (!email) {
    //   toast.error(
    //     "Session expired. Please start the password reset process again."
    //   );
    //   navigate("/forgot-password");
    // }
  }, [email, token, navigate]);

  const showPasswordFunction = () => {
    setShowPassword(!showPassword);
  };

  const showConfirmPasswordFunction = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const payload = {
          token,
          password: values.password,
        };

        console.log("Resetting password...");

        const { data } = await userAxiosInstance.post(
          "/reset-password",
          payload
        );

        if (data.status) {
          // Clear stored data
          localStorage.removeItem("forgotPasswordToken");
          localStorage.removeItem("forgotPasswordEmail");

          toast.success("Password reset successfully!");

          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      } catch (err) {
        console.error("Password reset error:", err);
        toast.error(err.response?.data?.message || "Failed to reset password");
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (!email || !token) {
    return null; // Will redirect in useEffect
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col lg:flex-row h-screen"
    >
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center text-center text-white p-6 lg:p-10">
        <div className="max-w-md">
          <GrapeAnimation className="sm:hidden" />
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
            Create New Password
          </h2>
          <p className="text-base lg:text-lg text-gray-200 mb-4">
            You're almost done! Create a strong new password to secure your
            account.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-10 pt-20 lg:p-10 font-sans"
      >
        <div className="w-full max-w-md">
          <motion.div variants={itemVariants}>
            <Link to="/">
              <h1 className="text-2xl font-bold text-primary mb-8 text-center lg:text-left cursor-pointer">
                Techpath
              </h1>
            </Link>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl font-bold mb-4 text-center lg:text-left"
          >
            Reset Password
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-gray-500 mb-6 text-center lg:text-left"
          >
            Enter your new password below. Make sure it's strong and secure.
          </motion.p>

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={formik.handleSubmit}
          >
            <motion.div variants={itemVariants} className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Enter your new password"
                  aria-required="true"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                  aria-label="Toggle password visibility"
                  onClick={showPasswordFunction}
                >
                  {showPassword ? <PiEyeBold /> : <PiEyeSlashBold />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.password}
                </div>
              ) : null}
            </motion.div>

            <motion.div variants={itemVariants} className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Confirm your new password"
                  aria-required="true"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="confirmPassword"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                  aria-label="Toggle password visibility"
                  onClick={showConfirmPasswordFunction}
                >
                  {showConfirmPassword ? <PiEyeBold /> : <PiEyeSlashBold />}
                </button>
              </div>
              {formik.touched.confirmPassword &&
              formik.errors.confirmPassword ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
            </motion.div>

            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={isLoading || !formik.isValid || !formik.dirty}
              className={`w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium ${
                isLoading || !formik.isValid || !formik.dirty
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </motion.button>
          </motion.form>

          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResetPassword;
