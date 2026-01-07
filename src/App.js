import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { WAProvider } from "@/context/waContext";
import { ProtectedRoute, AdminRoute } from "@/routes/ProtectedRoutes";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import LandingPage from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Leads from "@/pages/Leads";
import Templates from "@/pages/Templates";
import Settings from "@/pages/Settings";
import Broadcast from "@/pages/Broadcast";
import AutoRepliesPage from "@/pages/AutoReply";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { AuthLayout } from "@/components/AuthLayout";
//import  AuthLayout  from "@/components/Layout";
const queryClient = new QueryClient();
export default function App() {
    return (_jsx(QueryClientProvider, { client: queryClient, children: _jsx(AuthProvider, { children: _jsx(AppProvider, { children: _jsx(WAProvider, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsx(Route, { path: "/landing", element: _jsx(LandingPage, {}) }), _jsx(Route, { path: "/", element: _jsx(ProtectedRoute, { children: _jsx(AuthLayout, { children: _jsx(Dashboard, {}) }) }) }), _jsx(Route, { path: "/leads", element: _jsx(ProtectedRoute, { children: _jsx(AuthLayout, { children: _jsx(Leads, {}) }) }) }), _jsx(Route, { path: "/templates", element: _jsx(ProtectedRoute, { children: _jsx(AuthLayout, { children: _jsx(Templates, {}) }) }) }), _jsx(Route, { path: "/settings", element: _jsx(ProtectedRoute, { children: _jsx(AuthLayout, { children: _jsx(Settings, {}) }) }) }), _jsx(Route, { path: "/broadcast", element: _jsx(ProtectedRoute, { children: _jsx(AuthLayout, { children: _jsx(Broadcast, {}) }) }) }), _jsx(Route, { path: "/autoreply", element: _jsx(ProtectedRoute, { children: _jsx(AuthLayout, { children: _jsx(AutoRepliesPage, {}) }) }) }), _jsx(Route, { path: "/admin", element: _jsx(AdminRoute, { children: _jsxs(AuthLayout, { children: [_jsx(Settings, {}), " "] }) }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }) }) }) }) }));
}
