import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useLoginUser } from "../hooks/mutations/";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { mutate: loginUser, isPending } = useLoginUser();
    const validate = () => {
        const newErrors = {};
        if (!form.email)
            newErrors.email = "Email is required";
        if (!form.password)
            newErrors.password = "Password is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate())
            return;
        loginUser(form, {
            onSuccess: (data) => {
                localStorage.setItem("token", data.token);
                localStorage.setItem("pm_user", JSON.stringify(data.user));
                navigate("/dashboard");
            },
            onError: (err) => {
                console.error("Login failed:", err?.response?.data?.message || err.message);
            },
        });
    };
    return (_jsxs("div", { className: "flex justify-center items-center min-h-screen bg-[#f0fff4] text-gray-900 relative overflow-hidden", children: [_jsx(Toaster, { position: "top-right" }), _jsx("div", { className: "absolute w-96 h-96 bg-green-200/30 rounded-full blur-3xl top-[-15%] left-[-10%] animate-slowFloat" }), _jsx("div", { className: "absolute w-80 h-80 bg-green-300/30 rounded-full blur-3xl bottom-[-10%] right-[-5%] animate-slowFloat" }), _jsxs(motion.div, { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "relative bg-white/50 backdrop-blur-lg border border-green-200/40 shadow-2xl rounded-2xl p-8 w-full max-w-md text-center mx-4 sm:mx-0", children: [_jsx(motion.h1, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "text-3xl font-bold mb-6 text-green-600", children: "Welcome Back \uD83D\uDC4B" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 text-left", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm text-gray-700", children: "Email" }), _jsx("input", { type: "email", name: "email", value: form.email, onChange: handleChange, placeholder: "you@example.com", className: "w-full p-3 rounded-xl bg-white/70 border border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-300 outline-none transition-all" }), errors.email && (_jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.email }))] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1 text-sm text-gray-700", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: showPassword ? "text" : "password", name: "password", value: form.password, onChange: handleChange, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full p-3 pr-14 rounded-xl bg-white/70 border border-green-200 focus:border-green-400 focus:ring-2 focus:ring-green-300 outline-none transition-all" }), _jsx("button", { type: "button", onClick: () => setShowPassword((prev) => !prev), className: "absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-green-600 hover:text-green-700", children: showPassword ? "Hide" : "Show" })] }), errors.password && (_jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.password }))] }), _jsx(motion.button, { type: "submit", whileTap: { scale: 0.97 }, disabled: isPending, className: "w-full py-3 rounded-xl bg-gradient-to-r from-green-400 to-green-500 font-semibold hover:from-green-500 hover:to-green-600 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-60", children: isPending ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-5 h-5 animate-spin" }), _jsx("span", { children: "Logging in..." })] })) : (_jsx("span", { children: "Login" })) })] }), _jsxs("p", { className: "text-gray-700 text-sm mt-6", children: ["Don\u2019t have an account?", " ", _jsx("a", { href: "/register", className: "text-green-600 hover:underline font-medium", children: "Sign up" })] })] })] }));
};
export default Login;
