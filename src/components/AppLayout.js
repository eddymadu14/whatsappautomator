import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sidebar } from "@/components/Sidebar";
export default function AppLayout({ children }) {
    return (_jsxs("div", { className: "flex", children: [_jsx(Sidebar, {}), _jsx("main", { className: "flex-1", children: children })] }));
}
