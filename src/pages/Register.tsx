import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRegisterUser } from "../hooks/mutations";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

const Register: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const { mutate: registerUser, isPending } = useRegisterUser();

  // -----------------------------
  // Validation (frontend)
  // -----------------------------
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -----------------------------
  // Input change handler
  // -----------------------------
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear field error on input
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
  };

  // -----------------------------
  // Submit handler
  // -----------------------------
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    registerUser(form, {
      onSuccess: (data) => {
        if (data?.message) {
          toast.success(data.message);
        } else {
          toast.success("Registration successful!");
        }
        setForm({ name: "", email: "", password: "" }); // Optional: clear form
      },
      onError: (error: any) => {
        const resMessage = error?.response?.data?.message;

        if (Array.isArray(resMessage)) {
          // Handle array of errors from backend (e.g., Joi validation)
          const newErrors: FormErrors = {};
          resMessage.forEach((msg: string) => {
            if (msg.toLowerCase().includes("name")) newErrors.name = msg;
            else if (msg.toLowerCase().includes("email")) newErrors.email = msg;
            else if (msg.toLowerCase().includes("password")) newErrors.password = msg;
          });
          setErrors(newErrors);
        } else if (typeof resMessage === "string") {
          // Single string error from backend
          toast.error(resMessage);           
        } else {
        }
      },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f0fff4] text-gray-900 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Background floating blobs */}
      <div className="absolute w-96 h-96 bg-green-200/30 rounded-full blur-3xl top-[-15%] left-[-10%] animate-slowFloat" />
      <div className="absolute w-80 h-80 bg-green-300/30 rounded-full blur-3xl bottom-[-10%] right-[-5%] animate-slowFloat" />

      {/* Glassmorphic Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white/50 backdrop-blur-lg border border-green-200/40 shadow-2xl rounded-2xl p-8 w-full max-w-md text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-6 text-green-600"
        >
          Create Account ✨
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`w-full p-3 rounded-xl bg-white/70 border ${
                errors.name ? "border-red-500" : "border-green-200"
              } focus:border-green-400 focus:ring-2 focus:ring-green-300 outline-none text-gray-900 placeholder-gray-500 transition-all`}
              placeholder="John Doe"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={`w-full p-3 rounded-xl bg-white/70 border ${
                errors.email ? "border-red-500" : "border-green-200"
              } focus:border-green-400 focus:ring-2 focus:ring-green-300 outline-none text-gray-900 placeholder-gray-500 transition-all`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={`w-full p-3 rounded-xl bg-white/70 border ${
                errors.password ? "border-red-500" : "border-green-200"
              } focus:border-green-400 focus:ring-2 focus:ring-green-300 outline-none text-gray-900 placeholder-gray-500 transition-all`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Register Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-green-500 font-semibold hover:from-green-500 hover:to-green-600 transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-gray-700 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 hover:underline font-medium">
            Log in
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;