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
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
              <WAProvider>
          <Router>
            <Routes>
              {/* Public route: Login */}
              <Route path="/login" element={<Login />} />
              
              <Route path="/register" element={<Register />} />
                <Route path="/landing" element={<LandingPage />} />


              {/* Protected routes wrapped with AuthLayout */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AuthLayout>
                      <Dashboard />
                    </AuthLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/leads"
                element={
                  <ProtectedRoute>
                    <AuthLayout>
                      <Leads />
                    </AuthLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/templates"
                element={
                  <ProtectedRoute>
                    <AuthLayout>
                      <Templates />
                    </AuthLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AuthLayout>
                      <Settings />
                    </AuthLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/broadcast"
                element={
                  <ProtectedRoute>
                    <AuthLayout>
                      <Broadcast />
                    </AuthLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/autoreply"
                element={
                  <ProtectedRoute>
                    <AuthLayout>
                      <AutoRepliesPage />
                    </AuthLayout>
                  </ProtectedRoute>
                }
              />

              {/* Admin-only route */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AuthLayout>
                      <Settings /> {/* Replace with admin page */}
                    </AuthLayout>
                  </AdminRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          </WAProvider>
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}