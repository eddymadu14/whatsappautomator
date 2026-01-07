import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Plus, Edit3, Trash2, Tag } from "lucide-react";
import { http } from "@/api/http";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
/* ================= PAGE ================= */
export default function AutoRepliesPage() {
    const [autoReplies, setAutoReplies] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingRule, setEditingRule] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        keywords: [],
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
            const data = await http("/auto-replies");
            setAutoReplies(data);
        }
        catch {
            toast.error("Failed to fetch auto replies");
        }
        finally {
            setLoading(false);
        }
    };
    const fetchTemplates = async () => {
        try {
            const data = await http("/templates");
            setTemplates(data);
        }
        catch {
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
                const updated = await http(`/auto-replies/${editingRule._id}`, {
                    method: "PUT",
                    body: JSON.stringify(payload),
                });
                setAutoReplies(r => r.map(a => (a._id === updated._id ? updated : a)));
                toast.success("Auto reply updated");
            }
            else {
                const created = await http("/auto-replies", {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
                setAutoReplies(r => [created, ...r]);
                toast.success("Auto reply created");
            }
            resetForm();
        }
        catch {
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
    const openEditDialog = (rule) => {
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
    const handleDelete = async (id) => {
        if (!confirm("Delete this rule?"))
            return;
        try {
            await http(`/auto-replies/${id}`, { method: "DELETE" });
            setAutoReplies(r => r.filter(a => a._id !== id));
            toast.success("Rule deleted");
        }
        catch {
            toast.error("Failed to delete rule");
        }
    };
    /* ================= UI ================= */
    return (_jsxs("main", { className: "p-8 max-w-6xl mx-auto space-y-6", children: [_jsxs("header", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-3xl font-bold", children: "Auto Replies" }), _jsxs(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { children: [_jsx(Plus, { className: "w-4 h-4 mr-1" }), "New Rule"] }) }), _jsxs(DialogContent, { children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: editingRule ? "Edit Auto Reply" : "Create Auto Reply" }) }), _jsxs("div", { className: "space-y-4", children: [_jsx(Input, { placeholder: "Rule name", value: formData.name, onChange: e => setFormData({ ...formData, name: e.target.value }) }), formData.keywords.map((kw, idx) => (_jsxs("div", { className: "border p-3 rounded space-y-2", children: [_jsx(Input, { placeholder: "Keyword", value: kw.word, onChange: e => {
                                                            const k = [...formData.keywords];
                                                            k[idx].word = e.target.value;
                                                            setFormData({ ...formData, keywords: k });
                                                        } }), _jsxs(Select, { value: kw.matchType, onValueChange: v => {
                                                            const k = [...formData.keywords];
                                                            k[idx].matchType = v;
                                                            setFormData({ ...formData, keywords: k });
                                                        }, children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "contains", children: "Contains" }), _jsx(SelectItem, { value: "exact", children: "Exact" }), _jsx(SelectItem, { value: "startsWith", children: "Starts With" }), _jsx(SelectItem, { value: "word", children: "Word" })] })] }), _jsx(Input, { placeholder: "Synonyms (comma separated)", value: kw.synonyms.join(", "), onChange: e => {
                                                            const k = [...formData.keywords];
                                                            k[idx].synonyms = e.target.value
                                                                .split(",")
                                                                .map(s => s.trim());
                                                            setFormData({ ...formData, keywords: k });
                                                        } }), _jsx(Button, { size: "sm", variant: "destructive", onClick: () => setFormData({
                                                            ...formData,
                                                            keywords: formData.keywords.filter((_, i) => i !== idx),
                                                        }), children: "Remove" })] }, idx))), _jsx(Button, { variant: "outline", onClick: () => setFormData({
                                                    ...formData,
                                                    keywords: [
                                                        ...formData.keywords,
                                                        { word: "", matchType: "contains", synonyms: [] },
                                                    ],
                                                }), children: "Add Keyword" }), _jsxs(Select, { value: formData.responseTemplate, onValueChange: v => setFormData({ ...formData, responseTemplate: v }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select template" }) }), _jsx(SelectContent, { children: templates.map(t => (_jsx(SelectItem, { value: t._id, children: t.name }, t._id))) })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { children: "Active" }), _jsx(Switch, { checked: formData.isActive, onCheckedChange: v => setFormData({ ...formData, isActive: v }) })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { variant: "outline", onClick: resetForm, children: "Cancel" }), _jsx(Button, { onClick: handleSave, children: "Save" })] })] })] })] }), !loading && autoReplies.length === 0 && (_jsx(Card, { className: "border-dashed", children: _jsxs(CardContent, { className: "py-12 text-center space-y-3", children: [_jsx("p", { className: "text-lg font-semibold", children: "No Auto Replies" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "You haven\u2019t created any auto reply rules yet." }), _jsxs(Button, { onClick: () => setIsDialogOpen(true), children: [_jsx(Plus, { className: "w-4 h-4 mr-1" }), "Create your first rule"] })] }) })), loading
                ? "Loading..."
                : autoReplies.map(rule => (_jsxs(Card, { className: !rule.isActive ? "opacity-60 grayscale-[0.2]" : "", children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsx(CardTitle, { className: "text-lg", children: rule.name }), _jsx(Switch, { checked: rule.isActive, onCheckedChange: async (v) => {
                                        const updated = await http(`/auto-replies/${rule._id}/toggle`, {
                                            method: "PATCH",
                                            body: JSON.stringify({ isActive: v }),
                                        });
                                        setAutoReplies(r => r.map(a => a._id === updated._id ? updated : a));
                                    } })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-sm font-semibold text-muted-foreground", children: "Trigger Keywords" }), rule.keywords.map((k, idx) => (_jsxs("div", { className: "space-y-1", children: [_jsxs(Badge, { variant: "secondary", className: "inline-flex items-center gap-1", children: [_jsx(Tag, { className: "w-3 h-3" }), _jsx("span", { className: "font-medium", children: k.word }), _jsxs("span", { className: "text-xs opacity-70", children: ["(", k.matchType, ")"] })] }), k.synonyms.length > 0 && (_jsxs("p", { className: "ml-6 text-xs text-muted-foreground", children: ["Synonyms: ", k.synonyms.join(", ")] }))] }, idx)))] }), _jsxs("div", { className: "space-y-1", children: [_jsx("p", { className: "text-sm font-semibold text-muted-foreground", children: "Response Template" }), _jsxs("div", { className: "rounded-md border p-3 text-sm italic bg-muted/30", children: ["\u201C", rule.responseTemplate.content, "\u201D"] })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { size: "icon", variant: "outline", onClick: () => openEditDialog(rule), title: "Edit rule", children: _jsx(Edit3, { className: "w-4 h-4" }) }), _jsx(Button, { size: "icon", variant: "destructive", onClick: () => handleDelete(rule._id), title: "Delete rule", children: _jsx(Trash2, { className: "w-4 h-4" }) })] })] })] }, rule._id)))] }));
}
