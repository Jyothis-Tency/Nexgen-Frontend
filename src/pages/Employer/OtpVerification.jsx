import React, { useRef, useState, useEffect } from "react";
import { InputOtp } from "@nextui-org/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import employerAxiosInstance from "@/config/axiosConfig/employerAxiosInstance";
import GrapeAnimation from "@/components/GrapeAnimation";
import useRequest from "@/hooks/useRequestUser";

const RegisterOtp = () => {
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(new Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;
  const { data, loading, error, sendRequest } = useRequest();


  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

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
    console.log(otp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const email = localStorage.getItem("employer-email");
      const joinedOtp = otp.join("");
      const data = {
        otp : joinedOtp,
        email
      }
      
      console.log(data);
      
      const res = await employerAxiosInstance.post('/verify-otp' , data)
      console.log(res);
      if(res) {
        localStorage.removeItem("employer-email")
        toast.success("Otp verification successfull")
        setTimeout(() => {
            navigate('/employer/employer-login')
        }, 1500);
      }
      

      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error: {error}</p>;
    } catch (err) {
      console.log(err , "dhinuuu");
      
      toast.error(err.response.data.message || "An error occurred");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      

      {/* Right Section */}
      <div className="lg:w-1/2 w-full bg-white flex flex-col justify-center items-center p-6 lg:p-10 font-sans">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-primary mb-8 text-center lg:text-left">
          Techpath
          </h1>
          <h2 className="text-3xl font-bold mb-4 text-center lg:text-left">
            Verify your email
          </h2>
          <p className="text-gray-500 mb-6 text-center lg:text-left">
            We've sent a code to <span className="font-semibold">{email}</span>{" "}
            . Please enter it below to verify your account.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center md:gap-3 gap-1">
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
                  className={`w-14 h-14 text-center text-2xl font-semibold border ${
                    document.activeElement === inputRefs.current[index]
                      ? "border-blue-500"
                      : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all`}
                />
              ))}
            </div>
            <button
              className={`w-full bg-primary hover:bg-blue-700 text-white py-2 rounded-lg mt-6 transition-colors ${
                otp.some((digit) => digit === "")
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={otp.some((digit) => digit === "")}
              type="submit"
            >
              Verify Email
            </button>
          </form>

          <div className="text-center mt-4 flex justify-center gap-3">
            <p className="text-gray-600">Didn't receive the code?</p>
            <button className="text-blue-600 hover:text-blue-700 text-sm hover:underline"
            >
              Resend Code
            </button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-6">
            Back to{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Left Section */}
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
    </div>
  );
};

export default RegisterOtp;
