import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
export const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) {
        // Redirect to login if not authenticated
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return children;
};
export const AdminRoute = ({ children }) => {
    const { user, token } = useAuth();
    if (!token) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (user?.email !== "admin@example.com") {
        // Or check a proper admin role field
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return children;
};
