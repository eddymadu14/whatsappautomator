// Sidebar.tsx
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Send,
  Settings,
  Bot,
  Circle,
  Reply,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "../api/utils";
import { useLogout } from "@/hooks/mutations/useLogout";
import { useAuth } from "@/context/AuthContext";
import { useWA } from "@/context/waContext"; // updated hook

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Users, label: "Leads", href: "/leads" },
  { icon: MessageSquare, label: "Templates", href: "/templates" },
  { icon: Reply, label: "Autoreply", href: "/autoreply" },
  { icon: Send, label: "Broadcast", href: "/broadcast" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const navigate = useNavigate();
  const logoutMutation = useLogout();
  const { isAuthenticated } = useAuth();
  const { waStatus, pollRef, terminateInit } = useWA(); // useWA hook

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ✅ Combined Logout + QR Killer
  const handleLogout = async () => {
    try {
      // Stop polling if active
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }

      // Kill WhatsApp QR/init session if not connected
      if (waStatus && !waStatus.connected) {
        await terminateInit();
      }

      // Logout mutation
      logoutMutation.mutate(undefined, {
        onSuccess: () => {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        },
      });
    } catch (err) {
      console.error("Logout failed:", err);
      alert("Logout failed");
    }
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-card p-2 rounded-lg shadow"
      >
        <Menu />
      </button>

      <aside
        className={cn(
          "fixed md:static z-40 h-screen border-r bg-card shadow-sm transition-all",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "left-0" : "-left-full",
          "md:left-0"
        )}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && <h1 className="font-bold">WA Automator</h1>}
          </div>

          <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block">
            <ChevronLeft className={cn("transition-transform", collapsed && "rotate-180")} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {!collapsed && item.label}
            </NavLink>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && "Logout"}
          </button>
        </nav>

        {/* Session Status */}
        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
            <Circle
              className={cn(
                "w-2 h-2",
                isAuthenticated
                  ? "fill-emerald-500 text-emerald-500 animate-pulse"
                  : "fill-red-500 text-red-500"
              )}
            />
            {!collapsed && (
              <span className="text-xs">
                {isAuthenticated ? "Session Active" : "Session Expired"}
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}