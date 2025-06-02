"use client";

import { useState } from "react";
import GrapeAnimation from "../../components/GrapeAnimation";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
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

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const EmployerForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        console.log("Forgot password email:", values.email);

        const { data } = await employerAxiosInstance.post("/forgot-password", {
          email: values.email,
        });

        if (data.status) {
          // Store the token and email for the next step
          localStorage.setItem("employerForgotPasswordToken", data.token);
          localStorage.setItem("employerForgotPasswordEmail", values.email);

          toast.success("OTP sent to your email successfully!");

          setTimeout(() => {
            navigate("/employer/forgot-password-otp");
          }, 1500);
        }
      } catch (err) {
        console.error("Forgot password error:", err);
        toast.error(
          err.response?.data?.message || "Email not found or an error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    },
  });

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
            Forgot Password?
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-gray-500 mb-6 text-center lg:text-left"
          >
            No worries! Enter your employer email address and we'll send you an
            OTP to reset your password.
          </motion.p>

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={formik.handleSubmit}
          >
            <motion.div variants={itemVariants} className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Employer Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                placeholder="Enter your employer email address"
                aria-required="true"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="email"
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.email}
                </div>
              ) : null}
            </motion.div>

            <motion.button
              variants={buttonVariants}
              type="submit"
              disabled={isLoading || !formik.values.email}
              className={`w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium ${
                isLoading || !formik.values.email
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              whileHover="hover"
              whileTap="tap"
            >
              {isLoading ? "Sending OTP..." : "Send Reset OTP"}
            </motion.button>
          </motion.form>

          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
              <Link
                to="/employer/employer-login"
                className="text-blue-600 hover:underline"
              >
                Back to Login
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary flex-col justify-center items-center text-center text-white p-6 lg:p-10">
        <div className="max-w-md">
          <GrapeAnimation className="sm:hidden" />
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
            Reset Your Employer Password
          </h2>
          <p className="text-base lg:text-lg text-gray-200 mb-4">
            Don't worry! It happens to the best of us. Enter your email and
            we'll send you a reset link.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmployerForgotPassword;
