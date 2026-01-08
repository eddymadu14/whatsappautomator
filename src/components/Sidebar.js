import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, MessageSquare, Send, Settings, Bot, Circle, Reply, LogOut, ChevronLeft, Menu, } from "lucide-react";
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
    return (_jsxs(_Fragment, { children: [_jsx("button", { onClick: toggleSidebar, className: "\n          fixed top-4 left-4 z-[60]\n          bg-primary text-primary-foreground\n          p-2 rounded-lg shadow\n        ", children: _jsx(Menu, { className: "w-5 h-5" }) }), _jsxs("aside", { className: cn("fixed md:static z-40 h-screen bg-card border-r shadow-sm transition-all duration-300 ease-in-out overflow-hidden", open ? "w-64" : "w-0 md:w-20"), children: [_jsx("button", { onClick: toggleSidebar, className: "\n            absolute -right-3 top-6 z-50\n            w-7 h-7 rounded-full\n            flex items-center justify-center\n            bg-primary text-primary-foreground\n            shadow-md\n          ", children: _jsx(ChevronLeft, { className: cn("w-4 h-4 transition-transform duration-300", !open && "rotate-180") }) }), _jsxs("div", { className: "p-4 flex items-center gap-3", children: [_jsx("div", { className: "bg-primary p-2 rounded-xl", children: _jsx(Bot, { className: "w-5 h-5 text-primary-foreground" }) }), open && _jsx("h1", { className: "font-bold", children: "WA Automator" })] }), _jsxs("nav", { className: "px-3 space-y-1", children: [navItems.map(item => (_jsxs(NavLink, { to: item.href, className: ({ isActive }) => cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap", isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted"), children: [_jsx(item.icon, { className: "w-4 h-4" }), open && item.label] }, item.href))), _jsxs("button", { onClick: handleLogout, disabled: logoutMutation.isPending, className: "\n              w-full flex items-center gap-3\n              px-3 py-2.5 rounded-lg\n              text-sm font-medium\n              text-destructive hover:bg-destructive/10\n              whitespace-nowrap\n            ", children: [_jsx(LogOut, { className: "w-4 h-4" }), open && "Logout"] })] }), _jsx("div", { className: "absolute bottom-4 left-0 right-0 px-4", children: _jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg", children: [_jsx(Circle, { className: cn("w-2 h-2", isAuthenticated
                                        ? "fill-emerald-500 text-emerald-500 animate-pulse"
                                        : "fill-red-500 text-red-500") }), open && (_jsx("span", { className: "text-xs", children: isAuthenticated ? "Session Active" : "Session Expired" }))] }) })] })] }));
}
