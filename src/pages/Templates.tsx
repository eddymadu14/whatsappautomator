// src/pages/Templates.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MessageSquare, Trash2, Edit3, Tag } from "lucide-react";
import type { Template as TemplateType } from "@/types/template";
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

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<TemplateType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    content: "",
    keywords: "",
  });

  /* ================= FETCH ================= */

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const data = await http<TemplateType[]>("/templates");
      setTemplates(data);
    } catch {
      toast.error("Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SAVE ================= */

  const handleSave = async () => {
    if (!formData.name || !formData.content) {
      toast.error("Please fill in name and content");
      return;
    }

    const payload = {
      name: formData.name,
      content: formData.content,
      keywords: formData.keywords
        .split(",")
        .map(k => k.trim())
        .filter(Boolean),
    };

    try {
      if (isEditing && editId) {
        const updated = await http<TemplateType>(`/templates/${editId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setTemplates(prev =>
          prev.map(t => (t._id === editId ? updated : t))
        );
        toast.success("Template updated successfully");
      } else {
        const created = await http<TemplateType>("/templates/", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setTemplates(prev => [created, ...prev]);
        toast.success("Template created successfully");
      }

      setIsDialogOpen(false);
      setFormData({ name: "", content: "", keywords: "" });
      setIsEditing(false);
      setEditId(null);
    } catch {
      toast.error("Failed to save template");
    }
  };

  /* ================= DELETE ================= */

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    try {
      await http(`/templates/${id}`, { method: "DELETE" });
      setTemplates(prev => prev.filter(t => t._id !== id));
      toast.success("Template deleted");
    } catch {
      toast.error("Failed to delete template");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (template: TemplateType) => {
    setFormData({
      name: template.name,
      content: template.content,
      keywords: template.keywords?.join(", ") || "",
    });
    setIsEditing(true);
    setEditId(template._id);
    setIsDialogOpen(true);
  };

  /* ================= UI ================= */

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* HEADER */}
          <header className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Templates</h2>
              <p className="text-muted-foreground">
                Manage your auto-reply messages and keywords.
              </p>
            </div>

            <Dialog
              open={isDialogOpen}
              onOpenChange={open => {
                if (!open) {
                  setIsEditing(false);
                  setEditId(null);
                  setFormData({ name: "", content: "", keywords: "" });
                }
                setIsDialogOpen(open);
              }}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  {isEditing ? "Edit Template" : "Create Template"}
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>
                    {isEditing ? "Edit Template" : "New Template"}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Template Name</label>
                    <Input
                      value={formData.name}
                      onChange={e =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Auto-Reply Content
                    </label>
                    <Textarea
                      className="min-h-[120px]"
                      value={formData.content}
                      onChange={e =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Keywords (comma separated)
                    </label>
                    <Input
                      value={formData.keywords}
                      onChange={e =>
                        setFormData({ ...formData, keywords: e.target.value })
                      }
                    />
                    <p className="text-[10px] text-muted-foreground italic">
                      Matching any of these will trigger the auto-reply.
                    </p>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>
                    {isEditing ? "Update" : "Save Template"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </header>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loading ? (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                Loading templates...
              </div>
            ) : templates.length === 0 ? (
              <Card className="col-span-full border-dashed p-12 flex flex-col items-center text-center">
                <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                <h3 className="font-semibold text-lg">No templates yet</h3>
                <p className="text-muted-foreground mt-2 max-w-sm">
                  Create your first auto-reply template to start automating
                  conversations.
                </p>
              </Card>
            ) : (
              templates.map(template => (
                <Card
                  key={template._id}
                  className="flex flex-col justify-between"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {template.name}
                    </CardTitle>

                    {/* KEYWORDS */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {template.keywords?.map(kw => (
                        <Badge
                          key={kw}
                          variant="secondary"
                          className="text-xs px-2 py-1"
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    {/* MESSAGE */}
                    <div className="p-4 rounded-md border bg-muted/40 text-sm italic leading-relaxed">
                      “{template.content}”
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleEdit(template)}
                        title="Edit template"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => handleDelete(template._id)}
                        title="Delete template"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}