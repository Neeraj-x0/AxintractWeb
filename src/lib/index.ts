import axios from "axios";
import { API_URL,JWT_TOKEN } from "@/constants";

const axiosInstance = axios.create({
  baseURL: API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to dynamically set headers (e.g., Authorization)
axiosInstance.interceptors.request.use((config) => {
  //const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (JWT_TOKEN) {
    config.headers["Authorization"] = `Bearer ${JWT_TOKEN}`;
  }
  return config;
});

export default axiosInstance;
