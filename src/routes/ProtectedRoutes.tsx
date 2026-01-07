// src/routes/ProtectedRoutes.tsx
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// -------------------------------
// Props interface for any protected route
// -------------------------------
interface ProtectedRouteProps {
  children: ReactNode; // use ReactNode instead of JSX.Element
}

// -------------------------------
// Route requiring any authenticated user
// -------------------------------
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; // wrap in fragment for type safety
};

// -------------------------------
// Route requiring admin access
// -------------------------------
interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Replace this with your proper admin role check if available
  if (user?.email !== "admin@example.com") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>; // wrap in fragment for type safety
};