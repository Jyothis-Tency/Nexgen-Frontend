import axios from "axios";

const employerAxiosInstance = axios.create({
  baseURL: "http://localhost:3001/employer",
  withCredentials: true,
});


employerAxiosInstance.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL || ""}${config.url}`;
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);


employerAxiosInstance.interceptors.response.use(
  (response) => {
    console.log("response reached");
    return response;
  },
  (error) => {
    console.error("Axios error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default employerAxiosInstance;
