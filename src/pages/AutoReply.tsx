import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Edit3, Trash2, Tag } from "lucide-react";
import { http } from "@/api/http";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

/* ================= TYPES ================= */

type Template = {
  _id: string;
  name: string;
  content: string;
};

type KeywordObj = {
  word: string;
  matchType: "contains" | "exact" | "startsWith" | "word";
  synonyms: string[];
};

type AutoReply = {
  _id: string;
  name: string;
  keywords: KeywordObj[];
  responseTemplate: Template;
  isActive: boolean;
  priority: number;
  cooldownSeconds: number;
};

/* ================= PAGE ================= */

export default function AutoRepliesPage() {
  const [autoReplies, setAutoReplies] = useState<AutoReply[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutoReply | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    keywords: [] as KeywordObj[],
    responseTemplate: "",
    isActive: true,
    priority: 100,
    cooldownSeconds: 30,
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchAutoReplies();
    fetchTemplates();
  }, []);

  const fetchAutoReplies = async () => {
    try {
      const data = await http<AutoReply[]>("/auto-replies");
      setAutoReplies(data);
    } catch {
      toast.error("Failed to fetch auto replies");
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await http<Template[]>("/templates");
      setTemplates(data);
    } catch {
      toast.error("Failed to fetch templates");
    }
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!formData.name || !formData.keywords.length || !formData.responseTemplate) {
      toast.error("All fields are required");
      return;
    }

    const payload = {
      ...formData,
      template: { id: formData.responseTemplate },
      keywords: formData.keywords.map(k => ({
        word: k.word.trim().toLowerCase(),
        matchType: k.matchType,
        synonyms: k.synonyms
          .flatMap(s => s.split(","))
          .map(s => s.trim().toLowerCase())
          .filter(Boolean),
      })),
    };

    try {
      if (editingRule) {
        const updated = await http<AutoReply>(
          `/auto-replies/${editingRule._id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );
        setAutoReplies(r =>
          r.map(a => (a._id === updated._id ? updated : a))
        );
        toast.success("Auto reply updated");
      } else {
        const created = await http<AutoReply>("/auto-replies", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setAutoReplies(r => [created, ...r]);
        toast.success("Auto reply created");
      }

      resetForm();
    } catch {
      toast.error("Failed to save auto reply");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      keywords: [],
      responseTemplate: "",
      isActive: true,
      priority: 100,
      cooldownSeconds: 30,
    });
    setEditingRule(null);
    setIsDialogOpen(false);
  };

  /* ================= EDIT ================= */

  const openEditDialog = (rule: AutoReply) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      keywords: rule.keywords,
      responseTemplate: rule.responseTemplate._id,
      isActive: rule.isActive,
      priority: rule.priority,
      cooldownSeconds: rule.cooldownSeconds,
    });
    setIsDialogOpen(true);
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this rule?")) return;
    try {
      await http(`/auto-replies/${id}`, { method: "DELETE" });
      setAutoReplies(r => r.filter(a => a._id !== id));
      toast.success("Rule deleted");
    } catch {
      toast.error("Failed to delete rule");
    }
  };

  /* ================= UI ================= */

  return (
    <main className="p-8 max-w-6xl mx-auto space-y-6">
      <header className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Auto Replies</h2>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-1" />
              New Rule
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingRule ? "Edit Auto Reply" : "Create Auto Reply"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Rule name"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              {formData.keywords.map((kw, idx) => (
                <div key={idx} className="border p-3 rounded space-y-2">
                  <Input
                    placeholder="Keyword"
                    value={kw.word}
                    onChange={e => {
                      const k = [...formData.keywords];
                      k[idx].word = e.target.value;
                      setFormData({ ...formData, keywords: k });
                    }}
                  />

                  <Select
                    value={kw.matchType}
                    onValueChange={v => {
                      const k = [...formData.keywords];
                      k[idx].matchType = v as any;
                      setFormData({ ...formData, keywords: k });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="exact">Exact</SelectItem>
                      <SelectItem value="startsWith">Starts With</SelectItem>
                      <SelectItem value="word">Word</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    placeholder="Synonyms (comma separated)"
                    value={kw.synonyms.join(", ")}
                    onChange={e => {
                      const k = [...formData.keywords];
                      k[idx].synonyms = e.target.value
                        .split(",")
                        .map(s => s.trim());
                      setFormData({ ...formData, keywords: k });
                    }}
                  />

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        keywords: formData.keywords.filter((_, i) => i !== idx),
                      })
                    }
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() =>
                  setFormData({
                    ...formData,
                    keywords: [
                      ...formData.keywords,
                      { word: "", matchType: "contains", synonyms: [] },
                    ],
                  })
                }
              >
                Add Keyword
              </Button>

              <Select
                value={formData.responseTemplate}
                onValueChange={v =>
                  setFormData({ ...formData, responseTemplate: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map(t => (
                    <SelectItem key={t._id} value={t._id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <span>Active</span>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={v =>
                    setFormData({ ...formData, isActive: v })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      {/* EMPTY STATE */}
      {!loading && autoReplies.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center space-y-3">
            <p className="text-lg font-semibold">No Auto Replies</p>
            <p className="text-sm text-muted-foreground">
              You haven’t created any auto reply rules yet.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-1" />
              Create your first rule
            </Button>
          </CardContent>
        </Card>
      )}

      {/* LIST */}
      {loading
        ? "Loading..."
        : autoReplies.map(rule => (
            <Card
              key={rule._id}
              className={!rule.isActive ? "opacity-60 grayscale-[0.2]" : ""}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{rule.name}</CardTitle>
                <Switch
                  checked={rule.isActive}
                  onCheckedChange={async v => {
                    const updated = await http<AutoReply>(
                      `/auto-replies/${rule._id}/toggle`,
                      {
                        method: "PATCH",
                        body: JSON.stringify({ isActive: v }),
                      }
                    );
                    setAutoReplies(r =>
                      r.map(a =>
                        a._id === updated._id ? updated : a
                      )
                    );
                  }}
                />
              </CardHeader>

              <CardContent className="space-y-4">
                {/* KEYWORDS */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Trigger Keywords
                  </p>

                  {rule.keywords.map((k, idx) => (
                    <div key={idx} className="space-y-1">
                      <Badge
                        variant="secondary"
                        className="inline-flex items-center gap-1"
                      >
                        <Tag className="w-3 h-3" />
                        <span className="font-medium">{k.word}</span>
                        <span className="text-xs opacity-70">
                          ({k.matchType})
                        </span>
                      </Badge>

                      {k.synonyms.length > 0 && (
                        <p className="ml-6 text-xs text-muted-foreground">
                          Synonyms: {k.synonyms.join(", ")}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* TEMPLATE */}
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-muted-foreground">
                    Response Template
                  </p>
                  <div className="rounded-md border p-3 text-sm italic bg-muted/30">
                    “{rule.responseTemplate.content}”
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => openEditDialog(rule)}
                    title="Edit rule"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDelete(rule._id)}
                    title="Delete rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
    </main>
  );
}