import type { AxiosInstance } from "axios";
import axios, { AxiosRequestConfig } from 'axios';



import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in .env");
}

// Optional: type for API response errors
interface ApiError {
  message: string;
  [key: string]: any; // for additional fields
}

// Create a reusable Axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/`, // your backend base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Add a request interceptor to attach token from context
export const useApi = () => {
  const { token } = useAuth();

  api.interceptors.request.use(
    (config) => {
      if (token) {
     const config: AxiosRequestConfig = {
  headers: new axios.AxiosHeaders({
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
  })
};
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
};

export default api;