import React, { useState } from "react";
import GrapeAnimation from "../../components/GrapeAnimation";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const keralaDistricts = [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad",
  ];

  const showPasswordFunction = () => {
    var x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      setShowPassword(true);
    } else {
      x.type = "password";
      setShowPassword(false);
    }
  };

  const showConfirmPasswordFunction = () => {
    var x = document.getElementById("confirm-password");
    if (x.type === "password") {
      x.type = "text";
      setShowConfirmPassword(true);
    } else {
      x.type = "password";
      setShowConfirmPassword(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      district: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must not exceed 50 characters")
        .required("Name is required"),
      phone: Yup.string()
        .min(10, "Phone number must be at least 10 characters")
        .matches(/^\+?[1-9]\d{1,14}$/, "Phone number is not valid")
        .required("Phone number is required"),
      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
      district: Yup.string().required("District is required"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          name: values.name,
          location: values.district,
          email: values.email,
          password: values.password,
          phone: values.phone,
        };
        const { data } = await employerAxiosInstance.post("/signup", payload);
        if (data) {
          localStorage.setItem("employer-email", values?.email);
          navigate("/employer/otp");
        }
      } catch (err) {
        console.log("err",err)
        toast.error(err.response.data.message || "An error occurred");
      }
    },
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  const iconVariants = {
    hover: { scale: 1.2, rotate: 10, transition: { duration: 0.2 } },
    tap: { scale: 0.9 },
  };

  const errorVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <motion.div
      className="flex flex-col lg:flex-row h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left Section */}
      <motion.div
        className="hidden sm:hidden lg:flex lg:w-1/2 w-full bg-primary flex-col justify-center items-center text-center text-white p-6 lg:p-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-md">
          <motion.div variants={itemVariants}>
            <GrapeAnimation className="sm:hidden" />
          </motion.div>
          <motion.h2
            className="text-2xl lg:text-3xl font-semibold mb-4"
            variants={itemVariants}
          >
            Connecting Talent with Opportunity—Post Jobs, Build Futures.
          </motion.h2>
          <motion.p
            className="text-base lg:text-lg text-gray-200 mb-4"
            variants={itemVariants}
          >
            Empowering Careers, One Opportunity at a Time.
          </motion.p>
        </div>
      </motion.div>
      {/* Footer for Small Screens */}
      <motion.div
        className="block sm:block lg:hidden bg-primary text-white text-center p-4"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        Connecting Talent with Opportunity—Post Jobs, Build Futures.
      </motion.div>

      {/* Right Section */}
      <motion.div
        className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-6 lg:p-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-2xl font-bold text-primary mb-3 text-center lg:text-left"
          variants={itemVariants}
        >
          Techpath
        </motion.h1>
        <div className="w-full max-w-md px-2">
          <motion.h2
            className="text-3xl font-semibold mb-4 text-center lg:text-left"
            variants={itemVariants}
          >
            Register as an Employer
          </motion.h2>
          <motion.p
            className="text-gray-500 mb-2 text-center lg:text-left"
            variants={itemVariants}
          >
            Join Us Today! Create Your Account to Get Started:
          </motion.p>

          <form onSubmit={formik.handleSubmit}>
            <motion.div className="md:flex gap-5" variants={itemVariants}>
              <div className="mb-3 md:w-full">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Company/Employer Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Enter your company name"
                  aria-required="true"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="name"
                />
                <AnimatePresence>
                  {formik.touched.name && formik.errors.name && (
                    <motion.div
                      className="text-red-500 text-[13px]"
                      variants={errorVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                    >
                      {formik.errors.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <motion.div className="mb-3" variants={itemVariants}>
              <label
                htmlFor="district"
                className="block text-sm font-medium text-gray-700"
              >
                District
              </label>
              <select
                id="district"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                value={formik.values.district}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="district"
              >
                <option value="">Select a district</option>
                {keralaDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <AnimatePresence>
                {formik.touched.district && formik.errors.district && (
                  <motion.div
                    className="text-red-500 text-[13px]"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.district}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div className="mb-3" variants={itemVariants}>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                placeholder="Enter your phone number"
                aria-required="true"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="phone"
              />
              <AnimatePresence>
                {formik.touched.phone && formik.errors.phone && (
                  <motion.div
                    className="text-red-500 text-[13px]"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.phone}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div className="mb-3" variants={itemVariants}>
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
              <AnimatePresence>
                {formik.touched.email && formik.errors.email && (
                  <motion.div
                    className="text-red-500 text-[13px]"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.email}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div className="mb-3" variants={itemVariants}>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Enter your password"
                  aria-required="true"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="password"
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                  aria-label="Toggle password visibility"
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {showPassword ? (
                    <PiEyeBold onClick={showPasswordFunction} />
                  ) : (
                    <PiEyeSlashBold onClick={showPasswordFunction} />
                  )}
                </motion.button>
              </div>
              <AnimatePresence>
                {formik.touched.password && formik.errors.password && (
                  <motion.div
                    className="text-red-500 text-[13px]"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.password}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div className="mb-3" variants={itemVariants}>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirm-password"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Re-enter your password"
                  aria-required="true"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="confirmPassword"
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                  aria-label="Toggle password visibility"
                  variants={iconVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {showConfirmPassword ? (
                    <PiEyeBold onClick={showConfirmPasswordFunction} />
                  ) : (
                    <PiEyeSlashBold onClick={showConfirmPasswordFunction} />
                  )}
                </motion.button>
              </div>
              <AnimatePresence>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <motion.div
                    className="text-red-500 text-[13px]"
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {formik.errors.confirmPassword}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 mt-2"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Sign Up
            </motion.button>
          </form>

          <motion.p
            className="text-center text-sm text-gray-600 mt-4"
            variants={itemVariants}
          >
            Already have an account?{" "}
            <motion.span
              onClick={() => navigate("/employer/employer-login")}
              className="text-blue-600 hover:underline cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Log in
            </motion.span>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Register;