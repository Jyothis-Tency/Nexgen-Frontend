import axios from "axios";
const env = import.meta.env;

const adminAxiosInstance = axios.create({
  baseURL: `https://api.techpath.in/admin`,
  withCredentials: true,
});

// console.log("env.VITE_LOCAL_BACKEND_URL", env.VITE_LOCAL_BACKEND_URL);

adminAxiosInstance.interceptors.request.use(
  (config) => {
    // Build the full URL
    const fullUrl = `${config.baseURL || ""}${config.url}`;
    console.log("Full URL:", fullUrl);

    // You can add additional configurations or modifications here if needed
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

adminAxiosInstance.interceptors.response.use(
  (response) => {
    console.log("response reached from admin");
    return response;
  },
  (error) => {
    console.error("Axios error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default adminAxiosInstance;
