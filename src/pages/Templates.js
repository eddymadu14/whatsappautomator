import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Templates.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, MessageSquare, Trash2, Edit3, Tag } from "lucide-react";
import { http } from "@/api/http";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
export default function TemplatesPage() {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
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
            const data = await http("/templates");
            setTemplates(data);
        }
        catch {
            toast.error("Failed to fetch templates");
        }
        finally {
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
                const updated = await http(`/templates/${editId}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });
                setTemplates(prev => prev.map(t => (t._id === editId ? updated : t)));
                toast.success("Template updated successfully");
            }
            else {
                const created = await http("/templates/", {
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
        }
        catch {
            toast.error("Failed to save template");
        }
    };
    /* ================= DELETE ================= */
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this template?"))
            return;
        try {
            await http(`/templates/${id}`, { method: "DELETE" });
            setTemplates(prev => prev.filter(t => t._id !== id));
            toast.success("Template deleted");
        }
        catch {
            toast.error("Failed to delete template");
        }
    };
    /* ================= EDIT ================= */
    const handleEdit = (template) => {
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
    return (_jsx("div", { className: "flex h-screen overflow-hidden bg-background", children: _jsx("main", { className: "flex-1 overflow-y-auto p-8", children: _jsxs("div", { className: "max-w-6xl mx-auto space-y-6", children: [_jsxs("header", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Templates" }), _jsx("p", { className: "text-muted-foreground", children: "Manage your auto-reply messages and keywords." })] }), _jsxs(Dialog, { open: isDialogOpen, onOpenChange: open => {
                                    if (!open) {
                                        setIsEditing(false);
                                        setEditId(null);
                                        setFormData({ name: "", content: "", keywords: "" });
                                    }
                                    setIsDialogOpen(open);
                                }, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { className: "gap-2", children: [_jsx(Plus, { className: "w-4 h-4" }), isEditing ? "Edit Template" : "Create Template"] }) }), _jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: isEditing ? "Edit Template" : "New Template" }) }), _jsxs("div", { className: "space-y-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Template Name" }), _jsx(Input, { value: formData.name, onChange: e => setFormData({ ...formData, name: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Auto-Reply Content" }), _jsx(Textarea, { className: "min-h-[120px]", value: formData.content, onChange: e => setFormData({ ...formData, content: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Keywords (comma separated)" }), _jsx(Input, { value: formData.keywords, onChange: e => setFormData({ ...formData, keywords: e.target.value }) }), _jsx("p", { className: "text-[10px] text-muted-foreground italic", children: "Matching any of these will trigger the auto-reply." })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: () => setIsDialogOpen(false), children: "Cancel" }), _jsx(Button, { onClick: handleSave, children: isEditing ? "Update" : "Save Template" })] })] })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: loading ? (_jsx("div", { className: "col-span-full py-20 text-center text-muted-foreground", children: "Loading templates..." })) : templates.length === 0 ? (_jsxs(Card, { className: "col-span-full border-dashed p-12 flex flex-col items-center text-center", children: [_jsx(MessageSquare, { className: "w-12 h-12 mb-4 opacity-20" }), _jsx("h3", { className: "font-semibold text-lg", children: "No templates yet" }), _jsx("p", { className: "text-muted-foreground mt-2 max-w-sm", children: "Create your first auto-reply template to start automating conversations." })] })) : (templates.map(template => (_jsxs(Card, { className: "flex flex-col justify-between", children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsx(CardTitle, { className: "text-base", children: template.name }), _jsx("div", { className: "flex flex-wrap gap-2 pt-2", children: template.keywords?.map(kw => (_jsxs(Badge, { variant: "secondary", className: "text-xs px-2 py-1", children: [_jsx(Tag, { className: "w-3 h-3 mr-1" }), kw] }, kw))) })] }), _jsxs(CardContent, { className: "flex-1 space-y-4", children: [_jsxs("div", { className: "p-4 rounded-md border bg-muted/40 text-sm italic leading-relaxed", children: ["\u201C", template.content, "\u201D"] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { size: "icon", variant: "outline", onClick: () => handleEdit(template), title: "Edit template", children: _jsx(Edit3, { className: "w-4 h-4" }) }), _jsx(Button, { size: "icon", variant: "destructive", onClick: () => handleDelete(template._id), title: "Delete template", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] })] }, template._id)))) })] }) }) }));
}
