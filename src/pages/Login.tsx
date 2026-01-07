import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useLoginUser } from "../hooks/mutations/";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const Login: React.FC = () => {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const navigate = useNavigate();

  // Use your mutation
  const { mutate: loginUser, isPending } = useLoginUser();

  // Form validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    // Call login mutation
    loginUser(form, {
      onSuccess: (data) => {
        // Backend sends: { accessToken, user }
        // Save token for http.ts
        localStorage.setItem("token", data.token);
        localStorage.setItem("pm_user", JSON.stringify(data.user));

        console.log("Login successful. Token saved:", data.token);
        console.log("User object saved:", data.user);

        // Optional: navigate to dashboard
        navigate("/dashboard");
      },
      onError: (err: any) => {
        console.error("Login failed:", err?.response?.data?.message || err.message);
      },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f0fff4] text-gray-900 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Background blobs */}
      <div className="absolute w-96 h-96 bg-green-200/30 rounded-full blur-3xl top-[-15%] left-[-10%] animate-slowFloat" />
      <div className="absolute w-80 h-80 bg-green-300/30 rounded-full blur-3xl bottom-[-10%] right-[-5%] animate-slowFloat" />

      {/* Glassmorphic card */}
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
          Welcome Back 👋
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-white/70 border border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-300 outline-none text-gray-900 placeholder-gray-500 transition-all"
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
              className="w-full p-3 rounded-xl bg-white/70 border border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-300 outline-none text-gray-900 placeholder-gray-500 transition-all"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Login Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-green-500 font-semibold hover:from-green-500 hover:to-green-600 transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Logging in...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </motion.button>
        </form>

        <p className="text-gray-700 text-sm mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-green-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;