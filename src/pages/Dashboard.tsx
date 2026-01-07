// src/pages/Dashboard.tsx
import { useEffect, useState } from "react";
import { cn } from "@/api/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, Send, ArrowUpRight, Zap } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { http } from "@/api/http";

/* ================= TYPES ================= */

type DashboardStats = {
  totalLeads: number;
  seriousLeads: number;
  autoRepliesSent: number;
  broadcasts: number;
};

type LeadGrowthPoint = {
  name: string;
  leads: number;
};

type ConversionStat = {
  _id: "pending" | "contacted" | "converted" | "cold";
  value: number;
};

type DashboardResponse = {
  stats: DashboardStats;
  leadGrowth: LeadGrowthPoint[];
  conversion: ConversionStat[];
};

/* ================= COMPONENT ================= */

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leadGrowth, setLeadGrowth] = useState<LeadGrowthPoint[]>([]);
  const [conversion, setConversion] = useState<ConversionStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const data = await http<DashboardResponse>("/dashboard/analytics");
      setStats(data.stats);
      setLeadGrowth(data.leadGrowth);
      setConversion(data.conversion);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const conversionChartData = conversion.map((c) => ({
    name: c._id.charAt(0).toUpperCase() + c._id.slice(1),
    value: c.value,
    color:
      c._id === "pending"
        ? "var(--color-chart-2)"
        : c._id === "contacted"
        ? "var(--color-chart-1)"
        : c._id === "converted"
        ? "oklch(0.55 0.18 142)"
        : "oklch(0.65 0 0)",
  }));

  return (
    <main className="flex-1 overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time overview of your WhatsApp automation performance.
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Leads"
            value={stats?.totalLeads ?? 0}
            icon={Users}
          />
          <StatCard
            title="Auto-Replies Sent"
            value={stats?.autoRepliesSent ?? 0}
            icon={Zap}
          />
          <StatCard
            title="Serious Leads"
            value={stats?.seriousLeads ?? 0}
            icon={ArrowUpRight}
            color="text-emerald-600"
          />
          <StatCard
            title="Broadcasts"
            value={stats?.broadcasts ?? 0}
            icon={Send}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lead Growth */}
          <Card className="lg:col-span-2 shadow-sm border-muted/60">
            <CardHeader>
              <CardTitle>Lead Inbound Traffic</CardTitle>
              <CardDescription>
                Leads received over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {loading ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Loading...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={leadGrowth}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="oklch(0.9 0 0)"
                    />
                    <XAxis
                      dataKey="name"
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="leads"
                      stroke="oklch(0.55 0.18 142)"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Conversion */}
          <Card className="shadow-sm border-muted/60">
            <CardHeader>
              <CardTitle>Lead Conversion</CardTitle>
              <CardDescription>Status distribution</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {loading ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Loading...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={conversionChartData} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={80}
                      tickLine={false}
                      axisLine={false}
                      fontSize={12}
                    />
                    <Tooltip />
                    <Bar dataKey="value" barSize={32} radius={[0, 4, 4, 0]}>
                      {conversionChartData.map((c, i) => (
                        <Cell key={i} fill={c.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

/* ================= STAT CARD ================= */

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: number;
  icon: any;
  color?: string;
}) {
  return (
    <Card className="shadow-sm border-muted/60 hover:border-primary/30 transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="bg-muted p-2 rounded-lg">
            <Icon className={cn("w-5 h-5", color || "text-muted-foreground")} />
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
      </CardContent>
    </Card>
  );
}
