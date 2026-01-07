import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/Broadcast.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, Users, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { http } from "@/api/http";
export default function BroadcastPage() {
    const [message, setMessage] = useState("");
    const [recipients, setRecipients] = useState("");
    const [scheduleMode, setScheduleMode] = useState("now");
    const [scheduledAt, setScheduledAt] = useState("");
    const [recipientMode, setRecipientMode] = useState("manual");
    const [isSending, setIsSending] = useState(false);
    const recipientList = recipientMode === "manual"
        ? recipients
            .split(",")
            .map((r) => r.trim())
            .filter(Boolean)
        : [];
    const handleSend = async () => {
        if (!message.trim()) {
            toast.error("Message cannot be empty");
            return;
        }
        if (recipientMode === "manual" && recipientList.length === 0) {
            toast.error("Please add at least one recipient");
            return;
        }
        if (scheduleMode === "later" && !scheduledAt) {
            toast.error("Please select a scheduled date & time");
            return;
        }
        setIsSending(true);
        try {
            // Convert datetime-local to full ISO string (UTC)
            const scheduleTime = scheduleMode === "later" && scheduledAt
                ? new Date(scheduledAt).toISOString()
                : undefined;
            const payload = {
                message,
                schedule: {
                    mode: scheduleMode,
                    time: scheduleTime,
                },
                recipients: {
                    mode: recipientMode,
                    manual: recipientMode === "manual" ? recipientList : [],
                    leadQuery: recipientMode === "leads" ? {} : null, // placeholder
                },
            };
            // Make the POST request
            const data = await http("/broadcast", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            // TypeScript-safe JSON parsing
            //const data: BroadcastResponse = await response.json();
            if (!data.success) {
                throw new Error(data.error || "Failed to process broadcast");
            }
            toast.success(scheduleMode === "now"
                ? "Broadcast queued successfully"
                : `Broadcast scheduled for ${new Date(data.scheduledFor).toLocaleString()}`);
            // Store the broadcast ID for possible cancel later
            // Uncomment if using cancel feature
            // setLastScheduledBroadcastId(data.broadcastId);
            // Reset fields
            setMessage("");
            setRecipients("");
            setScheduledAt("");
        }
        catch (err) {
            toast.error(err.message || "Failed to process broadcast");
        }
        finally {
            setIsSending(false);
        }
    };
    return (_jsx("div", { className: "flex h-screen overflow-hidden bg-background", children: _jsx("main", { className: "flex-1 overflow-y-auto p-8", children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-6", children: [_jsxs("header", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Broadcast" }), _jsx("p", { className: "text-muted-foreground", children: "Send or schedule bulk WhatsApp messages safely." })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Compose Message" }), _jsx(CardDescription, { children: "This message will be sent individually." })] }), _jsxs(CardContent, { children: [_jsx(Textarea, { className: "min-h-[180px]", placeholder: "Type your broadcast message\u2026", value: message, onChange: (e) => setMessage(e.target.value) }), _jsxs("div", { className: "text-xs text-muted-foreground mt-2", children: [message.length, " characters"] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Recipients" }), _jsx(CardDescription, { children: "Choose where recipients come from." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: recipientMode === "manual" ? "default" : "outline", size: "sm", onClick: () => setRecipientMode("manual"), children: "Manual" }), _jsx(Button, { variant: recipientMode === "leads" ? "default" : "outline", size: "sm", onClick: () => setRecipientMode("leads"), children: "Use Leads (Soon)" })] }), recipientMode === "manual" && (_jsxs(_Fragment, { children: [_jsx(Textarea, { className: "min-h-[140px] font-mono text-sm", placeholder: "2348012345678,2348098765432", value: recipients, onChange: (e) => setRecipients(e.target.value) }), _jsxs("div", { className: "text-xs text-primary flex items-center gap-2", children: [_jsx(Users, { className: "w-3 h-3" }), recipientList.length, " contacts detected"] })] })), recipientMode === "leads" && (_jsx("p", { className: "text-sm text-muted-foreground", children: "Lead selection will be available once the lead database is enabled." }))] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx(CardTitle, { children: "Schedule" }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: scheduleMode === "now" ? "default" : "outline", size: "sm", onClick: () => setScheduleMode("now"), children: "Send Now" }), _jsx(Button, { variant: scheduleMode === "later" ? "default" : "outline", size: "sm", onClick: () => setScheduleMode("later"), children: "Send Later" })] }), scheduleMode === "later" && (_jsx(Input, { type: "datetime-local", value: scheduledAt, onChange: (e) => setScheduledAt(e.target.value) })), _jsxs(Button, { className: "w-full gap-2", size: "lg", disabled: isSending, onClick: handleSend, children: [isSending
                                                                ? "Processing…"
                                                                : scheduleMode === "now"
                                                                    ? "Launch Broadcast"
                                                                    : "Schedule Broadcast", _jsx(Send, { className: "w-4 h-4" })] })] })] }), _jsxs("div", { className: "bg-amber-50 border rounded-xl p-4 flex gap-3", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-amber-600" }), _jsx("p", { className: "text-xs text-amber-800", children: "Always send messages to opted-in contacts to avoid account restrictions." })] })] })] })] }) }) }));
}
