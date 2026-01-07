import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/api/api";
// --------------------
// Context
// --------------------
const AuthContext = createContext(undefined);
// --------------------
// Provider
// --------------------
export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem("pm_user");
            return raw ? JSON.parse(raw) : null;
        }
        catch {
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
        }
        else {
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
    return (_jsx(AuthContext.Provider, { value: {
            user,
            token,
            isAuthenticated,
            setUser,
            setToken,
            logout,
        }, children: children }));
}
// --------------------
// Hook
// --------------------
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
