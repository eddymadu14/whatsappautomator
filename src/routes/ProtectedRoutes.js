import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
// -------------------------------
// Route requiring any authenticated user
// -------------------------------
export const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    if (!token) {
        // Redirect to login if not authenticated
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children }); // wrap in fragment for type safety
};
export const AdminRoute = ({ children }) => {
    const { user, token } = useAuth();
    if (!token) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Replace this with your proper admin role check if available
    if (user?.email !== "admin@example.com") {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return _jsx(_Fragment, { children: children }); // wrap in fragment for type safety
};
