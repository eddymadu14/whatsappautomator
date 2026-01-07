import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import api from "@/api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Define types
interface LoginCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  // add more user fields as needed
}

interface LoginResponse {
  token: string;
  user: User;
}

export const useLoginUser = () => {
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();

  return useMutation<LoginResponse, any, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await api.post<LoginResponse>("users/login", credentials);
      
      return data;
    },

    onSuccess: (data) => {
      // Persist token and user
      localStorage.setItem("token", data.token);
      localStorage.setItem("pm_user", JSON.stringify(data.user));

      // Update context
      setToken(data.token);
      setUser(data.user);

      toast.success("Login successful! 🚀");

      // Redirect to dashboard
      setTimeout(() => navigate("/dashboard"), 500);
    },

    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Invalid credentials";
      toast.error(msg);
    },
  });
};