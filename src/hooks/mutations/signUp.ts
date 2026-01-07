import { useMutation } from "@tanstack/react-query";
import api from "@/api/api";
import toast from "react-hot-toast";

// Define types
interface RegisterData {
  name: string;
  email: string;
  password: string;
  // add more registration fields if needed
}

interface RegisterResponse {
  message: string;
  user?: any; // optional: backend might return the created user
}

export const useRegisterUser = () => {
  return useMutation<RegisterResponse, any, RegisterData>({
    mutationFn: async (userData: RegisterData) => {
      const { data } = await api.post<RegisterResponse>("users/register", userData);
      return data;
    },

    onSuccess: (data) => {
      toast.success("Registration successful! 🎉");

      if (data.message) {
        setTimeout(() => {
          toast.success(data.message);
        }, 1000);
      }
    },

    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Registration failed";
      toast.error(msg);
    },
  });
};