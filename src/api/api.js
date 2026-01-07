import axios from "axios";
import { useAuth } from "@/context/AuthContext";
// Create a reusable Axios instance
const api = axios.create({
    baseURL: "http://localhost:5000/api/", // your backend base URL
    headers: {
        "Content-Type": "application/json",
    },
});
// Optional: Add a request interceptor to attach token from context
export const useApi = () => {
    const { token } = useAuth();
    api.interceptors.request.use((config) => {
        if (token) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }
        return config;
    }, (error) => Promise.reject(error));
    return api;
};
export default api;
