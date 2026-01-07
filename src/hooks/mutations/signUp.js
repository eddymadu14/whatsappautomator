import { useMutation } from "@tanstack/react-query";
import api from "@/api/api";
import toast from "react-hot-toast";
export const useRegisterUser = () => {
    return useMutation({
        mutationFn: async (userData) => {
            const { data } = await api.post("users/register", userData);
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
        onError: (error) => {
            const msg = error?.response?.data?.message || "Registration failed";
            toast.error(msg);
        },
    });
};
