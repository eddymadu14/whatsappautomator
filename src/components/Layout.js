import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Toaster } from "../components/ui/sonner"; // adjust path
import { Sidebar } from "./Sidebar";
export default function Layout({ children }) {
    return (_jsxs("div", { className: "flex min-h-screen font-sans antialiased bg-background text-foreground", children: [_jsx(Sidebar, {}), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx("header", { className: "p-4 bg-[#1a1a1a] shadow-md text-primary font-bold", children: "WhatsApp Business Automator" }), _jsx("main", { className: "flex-1 p-6 overflow-auto", children: children }), _jsx("footer", { className: "p-4 bg-[#1a1a1a] text-sm text-gray-400 text-center", children: "\u00A9 2025 WAutomator" })] }), _jsx(Toaster, { position: "top-right" })] }));
}
