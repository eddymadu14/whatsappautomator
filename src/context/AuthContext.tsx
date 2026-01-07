import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import api from "@/api/api";

// --------------------
// Types
// --------------------
export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  plan?: string;
  billingStatus?: string;
  limits?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// --------------------
// Context
// --------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --------------------
// Provider
// --------------------
export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("pm_user");
      return raw ? JSON.parse(raw) as User : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!token;

  // --------------------
  // Sync API headers
  // --------------------
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Fetch user profile if not set
      if (!user) {
        api.get("/users/me")
          .then(res => {
            const data = res.data;
            setUser({
              id: data._id,
              name: data.name,
              email: data.email,
              role: data.role,
              plan: data.plan,
              billingStatus: data.billingStatus,
              limits: data.limits,
            });
            localStorage.setItem("pm_user", JSON.stringify(data));
          })
          .catch(err => {
            console.error("Failed to fetch user profile:", err);
            logout(); // auto-logout if token invalid
          });
      }
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // --------------------
  // Auto-clear on logout
  // --------------------
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("pm_user");
    delete api.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        setUser,
        setToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// --------------------
// Hook
// --------------------
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}