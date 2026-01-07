import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from "react-router-dom";
export default function AppRouter() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/connect", element: _jsx(Connect, {}) }), _jsx(Route, { path: "/leads", element: _jsx(Leads, {}) }), _jsx(Route, { path: "/broadcast", element: _jsx(Broadcast, {}) }), _jsx(Route, { path: "/templates", element: _jsx(Templates, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) })] }));
}
