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
import { useWA } from "@/context/waContext";

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
  const { waStatus, pollRef, terminateInit } = useWA();

  // 🔥 single toggle state
  const [open, setOpen] = useState(true);

  const toggleSidebar = () => setOpen(v => !v);

  const handleLogout = async () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    if (waStatus && !waStatus.connected) {
      await terminateInit();
    }

    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <>
      {/* ================= HAMBURGER (FIXED, ALWAYS CLICKABLE) ================= */}
      <button
        onClick={toggleSidebar}
        className="
          fixed top-4 left-4 z-[60]
          bg-primary text-primary-foreground
          p-2 rounded-lg shadow
        "
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* ================= SIDEBAR ================= */}
      <aside
        className={cn(
          "fixed md:static z-40 h-screen bg-card border-r shadow-sm transition-all duration-300 ease-in-out overflow-hidden",
          open ? "w-64" : "w-0 md:w-20"
        )}
      >
        {/* ================= ARROW TOGGLE ================= */}
        <button
          onClick={toggleSidebar}
          className="
            absolute -right-3 top-6 z-50
            w-7 h-7 rounded-full
            flex items-center justify-center
            bg-primary text-primary-foreground
            shadow-md
          "
        >
          <ChevronLeft
            className={cn(
              "w-4 h-4 transition-transform duration-300",
              !open && "rotate-180"
            )}
          />
        </button>

        {/* ================= HEADER ================= */}
        <div className="p-4 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl">
            <Bot className="w-5 h-5 text-primary-foreground" />
          </div>
          {open && <h1 className="font-bold">WA Automator</h1>}
        </div>

        {/* ================= NAV ================= */}
        <nav className="px-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {open && item.label}
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="
              w-full flex items-center gap-3
              px-3 py-2.5 rounded-lg
              text-sm font-medium
              text-destructive hover:bg-destructive/10
              whitespace-nowrap
            "
          >
            <LogOut className="w-4 h-4" />
            {open && "Logout"}
          </button>
        </nav>

        {/* ================= SESSION STATUS ================= */}
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
            {open && (
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