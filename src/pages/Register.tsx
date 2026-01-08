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
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: registerUser, isPending } = useRegisterUser();

  // -----------------------------
  // Validation
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
  // Input handler
  // -----------------------------
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
        toast.success(data?.message || "Registration successful!");
        setForm({ name: "", email: "", password: "" });
      },
      onError: (error: any) => {
        const resMessage = error?.response?.data?.message;

        if (Array.isArray(resMessage)) {
          const newErrors: FormErrors = {};
          resMessage.forEach((msg: string) => {
            if (msg.toLowerCase().includes("name")) newErrors.name = msg;
            else if (msg.toLowerCase().includes("email")) newErrors.email = msg;
            else if (msg.toLowerCase().includes("password"))
              newErrors.password = msg;
          });
          setErrors(newErrors);
        } else if (typeof resMessage === "string") {
          toast.error(resMessage);
        }
      },
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f0fff4] text-gray-900 relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Background blobs */}
      <div className="absolute w-96 h-96 bg-green-200/30 rounded-full blur-3xl top-[-15%] left-[-10%] animate-slowFloat" />
      <div className="absolute w-80 h-80 bg-green-300/30 rounded-full blur-3xl bottom-[-10%] right-[-5%] animate-slowFloat" />

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white/50 backdrop-blur-lg border border-green-200/40 shadow-2xl rounded-2xl p-8 w-full max-w-md text-center mx-4 sm:mx-0"
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
              placeholder="John Doe"
              className={`w-full p-3 rounded-xl bg-white/70 border ${
                errors.name ? "border-red-500" : "border-green-200"
              } focus:border-green-400 focus:ring-2 focus:ring-green-300 outline-none transition-all`}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full p-3 rounded-xl bg-white/70 border ${
                errors.email ? "border-red-500" : "border-green-200"
              } focus:border-green-400 focus:ring-2 focus:ring-green-300 outline-none transition-all`}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm text-gray-700">Password</label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full p-3 pr-14 rounded-xl bg-white/70 border ${
                  errors.password ? "border-red-500" : "border-green-200"
                } focus:border-green-400 focus:ring-2 focus:ring-green-300 outline-none transition-all`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-green-600 hover:text-green-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Register Button */}
          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-green-500 font-semibold hover:from-green-500 hover:to-green-600 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </motion.button>
        </form>

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