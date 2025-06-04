import { useState, useEffect, useCallback, useRef } from "react";

const ImprovedOtpTimer = ({
  onExpire,
  className = "",
  storageKey,
  otpType,
  email,
  token,
}) => {
  const [seconds, setSeconds] = useState < number > 0;
  const [isExpired, setIsExpired] = useState < boolean > false;
  const [isLoading, setIsLoading] = useState < boolean > true;
  const intervalRef = (useRef < NodeJS.Timeout) | (null > null);
  const mountedRef = useRef < boolean > true;

  // Format time as MM:SS
  const formatTime = useCallback((totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  // Fetch remaining time from backend
  const fetchRemainingTime = useCallback(async () => {
    try {
      // Import axios instance dynamically to avoid SSR issues
      const { default: userAxiosInstance } = await import(
        "@/config/axiosConfig/userAxiosInstance"
      );

      const response =
        (await userAxiosInstance.get) < OtpExpiryResponse > "/otp-expiry-times";
      const { data } = response.data;

      // Get the appropriate expiry time based on OTP type
      const expiryDuration =
        otpType === "signup"
          ? data.signupOtpExpiry
          : data.forgotPasswordOtpExpiry;

      // Check if we have a stored expiry time
      const storedExpiry = localStorage.getItem(storageKey);
      const now = Math.floor(Date.now() / 1000);

      if (storedExpiry) {
        const expiryTime = Number.parseInt(storedExpiry, 10);
        const remainingTime = expiryTime - now;

        if (remainingTime > 0) {
          return remainingTime;
        } else {
          // Expired, clean up
          localStorage.removeItem(storageKey);
          return 0;
        }
      } else {
        // No stored expiry, this might be a fresh start or page reload
        // We need to check with backend if OTP still exists
        return await checkOtpStatus(expiryDuration);
      }
    } catch (error) {
      console.error("Error fetching remaining time:", error);
      // Fallback to stored time or 0
      const storedExpiry = localStorage.getItem(storageKey);
      if (storedExpiry) {
        const now = Math.floor(Date.now() / 1000);
        const remainingTime = Number.parseInt(storedExpiry, 10) - now;
        return Math.max(0, remainingTime);
      }
      return 0;
    }
  }, [storageKey, otpType]);

  // Check OTP status with backend
  const checkOtpStatus = useCallback(
    async (defaultExpiry) => {
      try {
        const { default: userAxiosInstance } = await import(
          "@/config/axiosConfig/userAxiosInstance"
        );

        // Try to verify with a dummy OTP to check if the real OTP exists
        const payload =
          otpType === "signup"
            ? { email, otp: "0000" } // Dummy OTP
            : { token, otp: "0000" }; // Dummy OTP

        const endpoint =
          otpType === "signup" ? "/verify-otp" : "/verify-forgot-password-otp";

        try {
          (await userAxiosInstance.post) < ApiResponse > (endpoint, payload);
          // If no error, OTP exists (though our dummy OTP is wrong)
          return defaultExpiry;
        } catch (error) {
          if (
            error.response?.status === 404 ||
            error.response?.data?.message?.includes("expired") ||
            error.response?.data?.message?.includes("not found")
          ) {
            // OTP doesn't exist or expired
            return 0;
          } else if (
            error.response?.status === 409 ||
            error.response?.data?.message?.includes("Wrong OTP") ||
            error.response?.data?.message?.includes("Incorrect OTP")
          ) {
            // OTP exists but wrong (expected for dummy OTP)
            return defaultExpiry;
          }
          // Other errors, assume OTP exists
          return defaultExpiry;
        }
      } catch (error) {
        console.error("Error checking OTP status:", error);
        return defaultExpiry;
      }
    },
    [otpType, email, token]
  );

  // Initialize timer
  useEffect(() => {
    let mounted = true;

    const initializeTimer = async () => {
      if (!mountedRef.current) return;

      setIsLoading(true);
      const remainingTime = await fetchRemainingTime();

      if (!mounted || !mountedRef.current) return;

      if (remainingTime > 0) {
        setSeconds(remainingTime);
        setIsExpired(false);
      } else {
        setSeconds(0);
        setIsExpired(true);
        onExpire();
      }
      setIsLoading(false);
    };

    initializeTimer();

    return () => {
      mounted = false;
    };
  }, [fetchRemainingTime, onExpire]);

  // Countdown effect
  useEffect(() => {
    if (isLoading || seconds <= 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds - 1;
        if (newSeconds <= 0) {
          setIsExpired(true);
          localStorage.removeItem(storageKey);
          onExpire();
          return 0;
        }
        return newSeconds;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [seconds, isLoading, onExpire, storageKey]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Method to reset timer (called when OTP is resent)
  const resetTimer = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch fresh expiry time from backend
      const { default: userAxiosInstance } = await import(
        "@/config/axiosConfig/userAxiosInstance"
      );
      const response =
        (await userAxiosInstance.get) < OtpExpiryResponse > "/otp-expiry-times";
      const { data } = response.data;

      const expiryDuration =
        otpType === "signup"
          ? data.signupOtpExpiry
          : data.forgotPasswordOtpExpiry;

      const now = Math.floor(Date.now() / 1000);
      const expiryTime = now + expiryDuration;

      localStorage.setItem(storageKey, expiryTime.toString());
      setSeconds(expiryDuration);
      setIsExpired(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error resetting timer:", error);
      setIsLoading(false);
    }
  }, [otpType, storageKey]);

  // Expose reset method via ref callback
  useEffect(() => {
    // Create a more specific global method name
    const globalMethodName = `resetTimer_${storageKey}_${otpType}`;
    window[globalMethodName] = resetTimer;

    return () => {
      delete window[globalMethodName];
    };
  }, [resetTimer, storageKey, otpType]);

  if (isLoading) {
    return (
      <div className={`text-center ${className}`}>
        <div className="flex items-center justify-center gap-2">
          <span className="text-gray-600">Loading timer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`text-center ${className}`}>
      {!isExpired ? (
        <div className="flex items-center justify-center gap-2">
          <span className="text-gray-600">Code expires in:</span>
          <span className="font-medium text-primary">
            {formatTime(seconds)}
          </span>
        </div>
      ) : (
        <span className="text-red-500">OTP expired</span>
      )}
    </div>
  );
};

export default ImprovedOtpTimer;
