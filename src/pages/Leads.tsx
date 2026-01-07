// src/pages/Leads.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Phone,
  Calendar,
  Star,
  MessageCircle,
  MoreVertical,
} from "lucide-react";
import type { Lead } from "@/types/lead";
import { http } from "@/api/http";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    setLoading(true);
    try {
      const data = await http<Lead[]>("/leads");
      console.log("Fetched leads:", data); // 🔍 debug
      setLeads(data || []);
    } catch {
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusUpdate(id: string, status: Lead["status"]) {
    try {
      await http(`/leads/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status } : l))
      );
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  }

  // ----------------- Filtered leads -----------------
  const filteredLeads = leads.filter((lead) => {
    // Always show all leads if search is empty
    if (!searchQuery) return true;

    const q = searchQuery.toLowerCase();
    return (
      (lead.name || "").toLowerCase().includes(q) ||
      (lead.phone || "").includes(q) ||
      (lead.message || "").toLowerCase().includes(q) ||
      (lead.triggerKeyword || "").toLowerCase().includes(q) ||
      (lead.matchedSynonym || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Leads</h2>
              <p className="text-muted-foreground">
                Manage and track qualified customer intent.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </header>

          {/* Leads Table */}
          <Card className="border-muted/60 shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b flex items-center justify-between">
              <CardTitle className="text-lg">Customer List</CardTitle>
              <Badge variant="secondary" className="font-mono">
                {filteredLeads.length} Total
              </Badge>
            </CardHeader>

            <CardContent className="p-0">
              <div className="divide-y divide-muted/60">
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">
                    Loading leads...
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No leads found.
                  </div>
                ) : (
                  filteredLeads.map((lead) => (
                    <LeadRow
                      key={lead._id}
                      lead={lead}
                      onStatusChange={handleStatusUpdate}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// ----------------- Lead Row -----------------
function LeadRow({
  lead,
  onStatusChange,
}: {
  lead: Lead;
  onStatusChange: (id: string, status: Lead["status"]) => void;
}) {
  const displayName = lead.name || lead.phone;

  return (
    <div
      className={[
        "p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3",
        lead.isSerious
          ? "bg-amber-50/30 ring-1 ring-amber-400/30"
          : "hover:bg-muted/20",
      ].join(" ")}
    >
      {/* Left */}
      <div className="flex items-start md:items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
          {displayName.charAt(0)}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-sm">{displayName}</h4>

            {lead.isSerious && (
              <Badge className="bg-amber-100 text-amber-700 border-none h-5 px-1.5 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-700" /> Hot
              </Badge>
            )}

            {typeof lead.keywordHitCount === "number" && (
              <Badge variant="outline" className="text-xs">
                {lead.keywordHitCount} signals
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> {lead.phone}
            </span>

            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />{" "}
              {new Date(lead.lastInteractionAt || lead.createdAt).toLocaleDateString()}
            </span>

            {lead.triggerKeyword && (
              <Badge variant="secondary" className="text-xs">
                {lead.triggerKeyword}
              </Badge>
            )}

            {lead.matchedSynonym && (
              <Badge variant="outline" className="text-xs">
                {lead.matchedSynonym}
              </Badge>
            )}
          </div>

          <div className="mt-1 italic text-sm text-muted-foreground">
            “{lead.message || "No message"}”
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3 mt-2 md:mt-0">
        <StatusBadge status={lead.status} />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => onStatusChange(lead._id, "contacted")}
            >
              Mark as Contacted
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onStatusChange(lead._id, "converted")}
            >
              Mark as Converted
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onStatusChange(lead._id, "cold")}
            >
              Mark as Cold
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-primary font-medium flex items-center gap-2">
              <MessageCircle className="w-4 h-4" /> Message on WA
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

// ----------------- Status Badge -----------------
function StatusBadge({ status }: { status: Lead["status"] }) {
  const styles: Record<Lead["status"], string> = {
    pending: "bg-blue-100 text-blue-700 border-none",
    contacted: "bg-purple-100 text-purple-700 border-none",
    converted: "bg-emerald-100 text-emerald-700 border-none",
    cold: "bg-slate-100 text-slate-700 border-none",
  };

  return (
    <Badge className={styles[status]}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}