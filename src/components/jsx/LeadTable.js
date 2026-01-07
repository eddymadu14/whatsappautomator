import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
/**
 * LeadTable component
 * @param {Array} leads - array of lead objects
 * Expected lead object structure: { id, name, email, phone, status }
 */
export default function LeadTable({ leads }) {
    return (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "min-w-full border border-gray-200", children: [_jsx("thead", { className: "bg-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 border-b text-left", children: "#" }), _jsx("th", { className: "px-4 py-2 border-b text-left", children: "Name" }), _jsx("th", { className: "px-4 py-2 border-b text-left", children: "Email" }), _jsx("th", { className: "px-4 py-2 border-b text-left", children: "Phone" }), _jsx("th", { className: "px-4 py-2 border-b text-left", children: "Status" })] }) }), _jsx("tbody", { children: leads.map((lead, index) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-2 border-b", children: index + 1 }), _jsx("td", { className: "px-4 py-2 border-b", children: lead.name }), _jsx("td", { className: "px-4 py-2 border-b", children: lead.email }), _jsx("td", { className: "px-4 py-2 border-b", children: lead.phone }), _jsx("td", { className: "px-4 py-2 border-b", children: lead.status })] }, lead.id || index))) })] }) }));
}
