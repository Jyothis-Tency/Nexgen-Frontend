import axios from "axios";
const env = import.meta.env;

const AdminAxiosInstance = axios.create({
  baseURL: `https://api.techpath.in/admin`,

  withCredentials: true,
});

AdminAxiosInstance.interceptors.request.use(
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

AdminAxiosInstance.interceptors.response.use(
  (response) => {
    console.log("response reached");
    return response;
  },
  (error) => {
    console.error("Axios error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default AdminAxiosInstance;
