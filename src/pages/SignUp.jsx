import React, { useState } from "react";
import GrapeAnimation from "../components/GrapeAnimation";
import { PiEyeBold, PiEyeSlashBold } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import useRequestUser from "../hooks/useRequestUser";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { userGoogleLoginAction } from "@/redux/actions/userAction";

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const GOOGLE_CLIENT_ID =
    "356987224140-nruiian6hrfgt5sk7bf0hi7o47lm210f.apps.googleusercontent.com";
  const { data, loading, error, sendRequest } = useRequestUser();

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
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .trim()
        .min(1, "First name must be at least 1 characters")
        .max(50, "First name must not exceed 50 characters")
        .required("First name is required"),

      lastName: Yup.string()
        .trim()
        .min(1, "Last name must be at least 1 characters")
        .max(50, "Last name must not exceed 50 characters")
        .required("Last name is required"),

      phone: Yup.string()
        .min(10, "Phone number must be at least 10 characters")
        .matches(/^\+?[1-9]\d{1,14}$/, "Phone number is not valid") // Matches E.164 phone number format
        .required("Phone number is required"),

      email: Yup.string()
        .trim()
        .email("Invalid email address")
        .required("Email is required"),

      password: Yup.string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-zA-Z]/, "Password must contain at least one letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .required("Password is required"),

      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      try {
        console.log(values);
        const payload = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          password: values.password,
        };

        const { data } = await userAxiosInstance.post("/signup", payload);
        if (data) {
          localStorage.setItem("email", values.email);
          navigate("/otp-verification");
        }

        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error: {error}</p>;
      } catch (err) {
        toast.warning(err.response.data.message || "An error occured");
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
      if (result) {
        localStorage.setItem("token", result.token);
        toast.success("Google Login successful!");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      }
    } catch (err) {
      console.error("Error in Google login: ", err);
      toast.error(err?.message || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-ful">
      {/* Left Section */}
      <div className="lg:w-1/2 w-full bg-primary flex flex-col justify-center items-center text-center text-white p-6 lg:p-10">
        <div className="max-w-md">
          {/* <img
      src="https://undraw.co/api/illustrations/random?color=ffffff&theme=teamwork"
      alt="Mobile Technician Illustration"
      className="mb-6 max-h-64 w-full object-contain"
      loading="lazy"
    /> */}
          <GrapeAnimation className="sm:hidden" />

          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
            Find Jobs Tailored for Mobile Technicians
          </h2>

          <p className="text-base lg:text-lg text-gray-200 mb-4">
            Discover the best opportunities and connect with employers who value
            your skills.
          </p>

          {/* <div className="flex justify-center gap-2">
      <span className="h-2 w-2 bg-white rounded-full"></span>
      <span className="h-2 w-2 bg-white opacity-50 rounded-full"></span>
      <span className="h-2 w-2 bg-white opacity-50 rounded-full"></span>
    </div> */}
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-6 lg:p-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/">
            <h1 className="text-2xl font-bold text-primary mb-8 text-center lg:text-left cursor-pointer">
            Techpath
            </h1>
          </Link>

          {/* Welcome Text */}
          <h2 className="text-3xl font-semibold mb-4 text-center lg:text-left">
            Register to login
          </h2>
          <p className="text-gray-500 mb-2 text-center lg:text-left">
            Join Us Today! Create Your Account to Get Started:
          </p>

          {/* Social Login Buttons */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex justify-center">
              <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error("Google sign up failed");
                  }}
                />
              </GoogleOAuthProvider>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-4">
            <span className="absolute bg-white px-4 -top-2 left-1/2 transform -translate-x-1/2 text-gray-500 text-sm">
              or continue with email
            </span>
            <hr className="border-gray-300" />
          </div>

          {/* Email and Password Form */}
          <form onSubmit={formik.handleSubmit}>
            <div className="md:flex gap-5  ">
              <div className="mb-3 md:w-1/2 ">
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First name
                </label>
                <input
                  type="text"
                  id="first-name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Enter your first name"
                  aria-required="true"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="firstName"
                />
                {formik.touched.firstName && formik.errors.firstName ? (
                  <div className="text-red-500 text-[13px]">
                    {formik.errors.firstName}
                  </div>
                ) : null}
              </div>

              <div className="mb-3 md:w-1/2">
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last name
                </label>
                <input
                  type="text"
                  id="last-name"
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                  placeholder="Enter your last name"
                  aria-required="true"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="lastName"
                />
                {formik.touched.lastName && formik.errors.lastName ? (
                  <div className="text-red-500 text-[13px]">
                    {formik.errors.lastName}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="phone-number"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="phone-number"
                id="phone-number"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm outline-none"
                placeholder="Enter your phone number"
                aria-required="true"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="phone"
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="text-red-500 text-[13px]">
                  {formik.errors.phone}
                </div>
              ) : null}
            </div>

            <div className="mb-3">
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
                <div className="text-red-500 text-[13px]">
                  {formik.errors.email}
                </div>
              ) : null}
            </div>

            <div className="mb-3">
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
                {formik.touched.password && formik.errors.password ? (
                  <div className="text-red-500 text-[13px]">
                    {formik.errors.password}
                  </div>
                ) : null}
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <PiEyeBold onClick={showPasswordFunction} />
                  ) : (
                    <PiEyeSlashBold onClick={showPasswordFunction} />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-3">
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
                {formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <div className="text-red-500 text-[13px]">
                    {formik.errors.confirmPassword}
                  </div>
                ) : null}
                <button
                  type="button"
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? (
                    <PiEyeBold onClick={showConfirmPasswordFunction} />
                  ) : (
                    <PiEyeSlashBold onClick={showConfirmPasswordFunction} />
                  )}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-700 mt-2"
            >
              Sign Up
            </button>
          </form>

          {/* Create Account */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <a
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
