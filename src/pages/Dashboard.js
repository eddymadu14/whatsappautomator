import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { cn } from "@/api/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, } from "@/components/ui/card";
import { Users, Send, ArrowUpRight, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, } from "recharts";
import { http } from "@/api/http";
/* ================= COMPONENT ================= */
export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [leadGrowth, setLeadGrowth] = useState([]);
    const [conversion, setConversion] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchDashboard();
    }, []);
    async function fetchDashboard() {
        try {
            const data = await http("/dashboard/analytics");
            setStats(data.stats);
            setLeadGrowth(data.leadGrowth);
            setConversion(data.conversion);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }
    const conversionChartData = conversion.map((c) => ({
        name: c._id.charAt(0).toUpperCase() + c._id.slice(1),
        value: c.value,
        color: c._id === "pending"
            ? "var(--color-chart-2)"
            : c._id === "contacted"
                ? "var(--color-chart-1)"
                : c._id === "converted"
                    ? "oklch(0.55 0.18 142)"
                    : "oklch(0.65 0 0)",
    }));
    return (_jsx("main", { className: "flex-1 overflow-y-auto p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto space-y-8", children: [_jsxs("header", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Dashboard" }), _jsx("p", { className: "text-muted-foreground", children: "Real-time overview of your WhatsApp automation performance." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", children: [_jsx(StatCard, { title: "Total Leads", value: stats?.totalLeads ?? 0, icon: Users }), _jsx(StatCard, { title: "Auto-Replies Sent", value: stats?.autoRepliesSent ?? 0, icon: Zap }), _jsx(StatCard, { title: "Serious Leads", value: stats?.seriousLeads ?? 0, icon: ArrowUpRight, color: "text-emerald-600" }), _jsx(StatCard, { title: "Broadcasts", value: stats?.broadcasts ?? 0, icon: Send })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs(Card, { className: "lg:col-span-2 shadow-sm border-muted/60", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Lead Inbound Traffic" }), _jsx(CardDescription, { children: "Leads received over the last 7 days" })] }), _jsx(CardContent, { className: "h-[300px]", children: loading ? (_jsx("div", { className: "h-full flex items-center justify-center text-muted-foreground", children: "Loading..." })) : (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: leadGrowth, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", vertical: false, stroke: "oklch(0.9 0 0)" }), _jsx(XAxis, { dataKey: "name", tickLine: false, axisLine: false, fontSize: 12 }), _jsx(YAxis, { tickLine: false, axisLine: false, fontSize: 12 }), _jsx(Tooltip, {}), _jsx(Line, { type: "monotone", dataKey: "leads", stroke: "oklch(0.55 0.18 142)", strokeWidth: 3, dot: { r: 4 } })] }) })) })] }), _jsxs(Card, { className: "shadow-sm border-muted/60", children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Lead Conversion" }), _jsx(CardDescription, { children: "Status distribution" })] }), _jsx(CardContent, { className: "h-[300px]", children: loading ? (_jsx("div", { className: "h-full flex items-center justify-center text-muted-foreground", children: "Loading..." })) : (_jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: conversionChartData, layout: "vertical", children: [_jsx(XAxis, { type: "number", hide: true }), _jsx(YAxis, { type: "category", dataKey: "name", width: 80, tickLine: false, axisLine: false, fontSize: 12 }), _jsx(Tooltip, {}), _jsx(Bar, { dataKey: "value", barSize: 32, radius: [0, 4, 4, 0], children: conversionChartData.map((c, i) => (_jsx(Cell, { fill: c.color }, i))) })] }) })) })] })] })] }) }));
}
/* ================= STAT CARD ================= */
function StatCard({ title, value, icon: Icon, color, }) {
    return (_jsx(Card, { className: "shadow-sm border-muted/60 hover:border-primary/30 transition-all", children: _jsxs(CardContent, { className: "p-6", children: [_jsx("div", { className: "flex items-center justify-between", children: _jsx("div", { className: "bg-muted p-2 rounded-lg", children: _jsx(Icon, { className: cn("w-5 h-5", color || "text-muted-foreground") }) }) }), _jsxs("div", { className: "mt-4", children: [_jsx("p", { className: "text-sm font-medium text-muted-foreground", children: title }), _jsx("h3", { className: "text-2xl font-bold mt-1", children: value })] })] }) }));
}
