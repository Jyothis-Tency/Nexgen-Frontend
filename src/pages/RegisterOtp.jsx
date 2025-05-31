"use client";

import { useRef, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import userAxiosInstance from "@/config/axiosConfig/userAxiosInstance";
import GrapeAnimation from "@/components/GrapeAnimation";
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

const RegisterOtp = () => {
  const OTP_LENGTH = 6; // Changed from 4 to 6 digits
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  // Get email from localStorage (set during registration)
  const email = localStorage.getItem("user-email") || location.state?.email;

  useEffect(() => {
    // Redirect if no email found
    if (!email) {
      toast.error("Session expired. Please register again.");
      navigate("/sign-up");
      return;
    }

    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [email, navigate]);

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
      const data = {
        otp: joinedOtp,
        email,
      };

      console.log("Verifying OTP:", data);

      const res = await userAxiosInstance.post("/verify-otp", data);
      console.log("OTP verification response:", res);

      if (res.data.status) {
        localStorage.removeItem("user-email");
        toast.success("OTP verification successful!");
        setTimeout(() => {
          navigate("/complete-profile");
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
        email,
      };

      console.log("Resending OTP for:", email);

      const { data } = await userAxiosInstance.post("/resend-otp", payload);

      if (data.status) {
        toast.success("OTP resent successfully!");
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

  if (!email) {
    return null; // Will redirect in useEffect
  }

  return (
    <motion.div
      className="flex flex-col lg:flex-row h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Left Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-6 lg:p-10 font-sans"
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
            Verify your email
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-gray-500 mb-6 text-center lg:text-left"
          >
            We've sent a 6-digit code to{" "}
            <span className="font-semibold">{email}</span>. Please enter it
            below to verify your account.
          </motion.p>

          <motion.form
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit}
          >
            <motion.div
              variants={itemVariants}
              className="flex justify-center md:gap-3 gap-1 mb-6"
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
                  className={`w-12 h-12 lg:w-14 lg:h-14 text-center text-2xl font-semibold border ${
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
              {isLoading ? "Verifying..." : "Verify Email"}
            </motion.button>
          </motion.form>

          <motion.div
            variants={itemVariants}
            className="text-center mt-4 flex justify-center gap-3"
          >
            <p className="text-gray-600">Didn't receive the code?</p>
            <button
              className={`text-blue-600 hover:text-blue-700 text-sm hover:underline ${
                isResending ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={resendOtp}
              disabled={isResending}
            >
              {isResending ? "Resending..." : "Resend Code"}
            </button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="text-center text-sm text-gray-600 mt-6"
          >
            Back to{" "}
            <Link to="/sign-up" className="text-blue-600 hover:underline">
              Registration
            </Link>
          </motion.p>
        </div>
      </motion.div>

      {/* Right Section */}
      <div className="lg:w-1/2 w-full bg-primary flex flex-col justify-center items-center text-center text-white p-6 lg:p-10">
        <div className="max-w-md">
          <GrapeAnimation className="sm:hidden" />
          <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
            Find Jobs Tailored for Mobile Technicians
          </h2>
          <p className="text-base lg:text-lg text-gray-200 mb-4">
            Discover the best opportunities and connect with employers who value
            your skills.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default RegisterOtp;
