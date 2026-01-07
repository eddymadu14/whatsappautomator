import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// For routes that require the user to be logged in
interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

// For routes that require admin access
interface AdminRouteProps {
  children: JSX.Element;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.email !== "admin@example.com") {
    // Or check a proper admin role field
    return <Navigate to="/" replace />;
  }

  return children;
};