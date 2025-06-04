"use client";

import { useRef, useState, useEffect } from "react";
import GrapeAnimation from "../components/GrapeAnimation";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import { motion } from "framer-motion";
import OtpTimer from "@/components/otp-timer";

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

const ForgotPasswordOtp = () => {
  const OTP_LENGTH = 6; // Changed from 4 to 6 digits
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const email = localStorage.getItem("forgotPasswordEmail");
  const token = localStorage.getItem("forgotPasswordToken");

  useEffect(() => {
    // Redirect if no email or token found
    if (!email || !token) {
      toast.error(
        "Session expired. Please start the password reset process again."
      );
      navigate("/forgot-password");
      return;
    }

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email, token, navigate]);

  const handleChange = (element, index) => {
    const value = element.value.replace(/[^0-9]/g, "");
    setOtp([...otp.map((d, idx) => (idx === index ? value : d))]);

    if (value !== "" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
    const otpArray = pastedData.slice(0, OTP_LENGTH).split("");
    setOtp([...otpArray, ...new Array(OTP_LENGTH - otpArray.length).fill("")]);
    inputRefs.current[Math.min(otpArray.length, OTP_LENGTH - 1)].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const joinedOtp = otp.join("");
      const payload = {
        token,
        otp: joinedOtp,
      };

      console.log("Verifying forgot password OTP:", payload);

      const { data } = await userAxiosInstance.post(
        "/verify-forgot-password-otp",
        payload
      );

      if (data.status) {
        // Clean up timer on successful verification
        localStorage.removeItem("forgot_password_otp_timer");

        toast.success("OTP verified successfully!");
        setTimeout(() => {
          navigate("/reset-password");
        }, 1500);
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      toast.error(
        err.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    setIsResending(true);
    try {
      const payload = {
        token,
      };

      const { data } = await userAxiosInstance.post(
        "/resend-forgot-password-otp",
        payload
      );

      if (data.status) {
        toast.success("OTP resent successfully!");

        // Reset the timer using the global method
        const resetTimerMethod = window.resetTimer_forgot_password_otp_timer;
        if (resetTimerMethod) {
          resetTimerMethod();
        }

        setIsTimerExpired(false);

        // Clear current OTP
        setOtp(new Array(OTP_LENGTH).fill(""));
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const handleOtpExpire = () => {
    setIsTimerExpired(true);
    toast.warning("OTP has expired. Please request a new one.");
  };

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
            Verify Your Identity
          </h2>
          <p className="text-base lg:text-lg text-gray-200 mb-4">
            We've sent a verification code to your email. Enter it below to
            proceed with password reset.
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
            Verify OTP
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-gray-500 mb-6 text-center lg:text-left"
          >
            We've sent a 6-digit code to{" "}
            <span className="font-semibold">{email}</span>. Please enter it
            below to verify your identity.
          </motion.p>

          {/* OTP Timer */}
          <motion.div variants={itemVariants} className="mb-4">
            <OtpTimer
              initialSeconds={300}
              onExpire={handleOtpExpire}
              className="mb-4"
              storageKey="forgot_password_otp_timer"
            />
          </motion.div>

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
          >
            <motion.div
              variants={itemVariants}
              className="flex justify-center gap-2 lg:gap-3 mb-6"
            >
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  ref={(el) => (inputRefs.current[index] = el)}
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className={`w-10 h-10 lg:w-12 lg:h-12 text-center text-xl font-semibold border ${
                    document.activeElement === inputRefs.current[index]
                      ? "border-blue-500"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                />
              ))}
            </motion.div>

            <motion.button
              variants={itemVariants}
              className={`w-full bg-primary hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-medium ${
                otp.some((digit) => digit === "") || isLoading
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={otp.some((digit) => digit === "") || isLoading}
              type="submit"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </motion.button>
          </motion.form>

          <motion.div
            variants={itemVariants}
            className="text-center mt-4 flex justify-center gap-3"
          >
            <p className="text-gray-600">Didn't receive the code?</p>
            {isTimerExpired ? (
              <button
                className={`text-blue-600 hover:text-blue-700 text-sm hover:underline ${
                  isResending ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={resendOtp}
                disabled={isResending}
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            ) : (
              <span className="text-gray-400 text-sm">
                Wait for timer to expire
              </span>
            )}
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-gray-600 mt-6"
          >
            Back to{" "}
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ForgotPasswordOtp;
