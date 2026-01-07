import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Leads.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Phone, Calendar, Star, MessageCircle, MoreVertical, } from "lucide-react";
import { http } from "@/api/http";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, } from "@/components/ui/dropdown-menu";
export default function LeadsPage() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    useEffect(() => {
        fetchLeads();
    }, []);
    async function fetchLeads() {
        setLoading(true);
        try {
            const data = await http("/leads");
            console.log("Fetched leads:", data); // 🔍 debug
            setLeads(data || []);
        }
        catch {
            toast.error("Failed to fetch leads");
        }
        finally {
            setLoading(false);
        }
    }
    async function handleStatusUpdate(id, status) {
        try {
            await http(`/leads/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ status }),
            });
            setLeads((prev) => prev.map((l) => (l._id === id ? { ...l, status } : l)));
            toast.success(`Status updated to ${status}`);
        }
        catch {
            toast.error("Failed to update status");
        }
    }
    // ----------------- Filtered leads -----------------
    const filteredLeads = leads.filter((lead) => {
        // Always show all leads if search is empty
        if (!searchQuery)
            return true;
        const q = searchQuery.toLowerCase();
        return ((lead.name || "").toLowerCase().includes(q) ||
            (lead.phone || "").includes(q) ||
            (lead.message || "").toLowerCase().includes(q) ||
            (lead.triggerKeyword || "").toLowerCase().includes(q) ||
            (lead.matchedSynonym || "").toLowerCase().includes(q));
    });
    return (_jsx("div", { className: "flex h-screen overflow-hidden bg-background", children: _jsx("main", { className: "flex-1 overflow-y-auto p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto space-y-6", children: [_jsxs("header", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Leads" }), _jsx("p", { className: "text-muted-foreground", children: "Manage and track qualified customer intent." })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "relative w-full md:w-64", children: [_jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }), _jsx(Input, { placeholder: "Search leads...", className: "pl-9", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value) })] }), _jsx(Button, { variant: "outline", size: "icon", children: _jsx(Filter, { className: "w-4 h-4" }) })] })] }), _jsxs(Card, { className: "border-muted/60 shadow-sm overflow-hidden", children: [_jsxs(CardHeader, { className: "bg-muted/30 border-b flex items-center justify-between", children: [_jsx(CardTitle, { className: "text-lg", children: "Customer List" }), _jsxs(Badge, { variant: "secondary", className: "font-mono", children: [filteredLeads.length, " Total"] })] }), _jsx(CardContent, { className: "p-0", children: _jsx("div", { className: "divide-y divide-muted/60", children: loading ? (_jsx("div", { className: "p-8 text-center text-muted-foreground", children: "Loading leads..." })) : filteredLeads.length === 0 ? (_jsx("div", { className: "p-8 text-center text-muted-foreground", children: "No leads found." })) : (filteredLeads.map((lead) => (_jsx(LeadRow, { lead: lead, onStatusChange: handleStatusUpdate }, lead._id)))) }) })] })] }) }) }));
}
// ----------------- Lead Row -----------------
function LeadRow({ lead, onStatusChange, }) {
    const displayName = lead.name || lead.phone;
    return (_jsxs("div", { className: [
            "p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3",
            lead.isSerious
                ? "bg-amber-50/30 ring-1 ring-amber-400/30"
                : "hover:bg-muted/20",
        ].join(" "), children: [_jsxs("div", { className: "flex items-start md:items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold", children: displayName.charAt(0) }), _jsxs("div", { className: "flex flex-col gap-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h4", { className: "font-semibold text-sm", children: displayName }), lead.isSerious && (_jsxs(Badge, { className: "bg-amber-100 text-amber-700 border-none h-5 px-1.5 flex items-center gap-1", children: [_jsx(Star, { className: "w-3 h-3 fill-amber-700" }), " Hot"] })), typeof lead.keywordHitCount === "number" && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [lead.keywordHitCount, " signals"] }))] }), _jsxs("div", { className: "flex flex-wrap items-center gap-2 text-xs text-muted-foreground", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Phone, { className: "w-3 h-3" }), " ", lead.phone] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Calendar, { className: "w-3 h-3" }), " ", new Date(lead.lastInteractionAt || lead.createdAt).toLocaleDateString()] }), lead.triggerKeyword && (_jsx(Badge, { variant: "secondary", className: "text-xs", children: lead.triggerKeyword })), lead.matchedSynonym && (_jsx(Badge, { variant: "outline", className: "text-xs", children: lead.matchedSynonym }))] }), _jsxs("div", { className: "mt-1 italic text-sm text-muted-foreground", children: ["\u201C", lead.message || "No message", "\u201D"] })] })] }), _jsxs("div", { className: "flex items-center gap-3 mt-2 md:mt-0", children: [_jsx(StatusBadge, { status: lead.status }), _jsxs(DropdownMenu, { children: [_jsx(DropdownMenuTrigger, { asChild: true, children: _jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: _jsx(MoreVertical, { className: "w-4 h-4" }) }) }), _jsxs(DropdownMenuContent, { align: "end", children: [_jsx(DropdownMenuLabel, { children: "Actions" }), _jsx(DropdownMenuItem, { onClick: () => onStatusChange(lead._id, "contacted"), children: "Mark as Contacted" }), _jsx(DropdownMenuItem, { onClick: () => onStatusChange(lead._id, "converted"), children: "Mark as Converted" }), _jsx(DropdownMenuItem, { onClick: () => onStatusChange(lead._id, "cold"), children: "Mark as Cold" }), _jsx(DropdownMenuSeparator, {}), _jsxs(DropdownMenuItem, { className: "text-primary font-medium flex items-center gap-2", children: [_jsx(MessageCircle, { className: "w-4 h-4" }), " Message on WA"] })] })] })] })] }));
}
// ----------------- Status Badge -----------------
function StatusBadge({ status }) {
    const styles = {
        pending: "bg-blue-100 text-blue-700 border-none",
        contacted: "bg-purple-100 text-purple-700 border-none",
        converted: "bg-emerald-100 text-emerald-700 border-none",
        cold: "bg-slate-100 text-slate-700 border-none",
    };
    return (_jsx(Badge, { className: styles[status], children: status.charAt(0).toUpperCase() + status.slice(1) }));
}
