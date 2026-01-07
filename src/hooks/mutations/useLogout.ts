import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import api from "@/api/api";

export const useLogout = () => {
  const { logout, token } = useAuth();

  return useMutation<void, any>({
    mutationFn: async () => {
      if (token) {
        try {
          await api.post("/users/logout");
        } catch (err: any) {
          // silent fail if backend unreachable
          console.warn("Backend logout failed:", err.message);
        }
      }

      // Always clear local session
      logout();
    },

    onSuccess: () => {
      toast.success("Logged out successfully");
    },

    onError: (error: any) => {
      console.error("Logout error:", error?.response?.data || error.message);
      toast.error(error?.response?.data?.message || "Logout failed locally");
    },
  });
};