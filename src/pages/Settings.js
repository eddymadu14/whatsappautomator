import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { QrCode, Shield, Bell, Clock, RefreshCcw, LogOut } from "lucide-react";
import { http } from "@/api/http";
export default function SettingsPage() {
    const navigate = useNavigate();
    const pollRef = useRef(null);
    const initialToastRef = useRef(true);
    const [settings, setSettings] = useState({});
    const [waStatus, setWaStatus] = useState(null);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [qrLoading, setQrLoading] = useState(false);
    const [refreshingQr, setRefreshingQr] = useState(false);
    const [connectingWA, setConnectingWA] = useState(false);
    /* ---------------- FETCHERS ---------------- */
    const fetchSettings = async () => {
        try {
            const res = await http("/settings");
            setSettings(res);
        }
        catch {
            toast.error("Failed to fetch settings");
        }
        finally {
            setLoadingSettings(false);
        }
    };
    const fetchWhatsAppStatus = async () => {
        try {
            const status = await http("/whatsapp/status");
            let qr = null;
            if (status.requiresQR) {
                setQrLoading(true);
                try {
                    const qrRes = await http("/whatsapp/qr");
                    qr = qrRes.qr;
                }
                catch {
                    qr = null;
                }
                finally {
                    setQrLoading(false);
                }
            }
            const finalStatus = { ...status, qr: qr || null };
            setWaStatus(finalStatus);
            if (status.connected && initialToastRef.current) {
                toast.success("WhatsApp connected");
                initialToastRef.current = false;
            }
            return finalStatus;
        }
        catch (err) {
            console.error("Failed to fetch WhatsApp status:", err);
            toast.error("Failed to fetch WhatsApp status");
            return null;
        }
    };
    /* ---------------- ACTIONS ---------------- */
    const connectWhatsApp = async () => {
        try {
            setConnectingWA(true);
            setQrLoading(true);
            const qrRes = await http("/whatsapp/connect", {
                method: "POST",
            });
            setWaStatus({
                connected: false,
                requiresQR: true,
                status: "qr",
                qr: qrRes.qr,
            });
            toast.info("WhatsApp initialized. Scan the QR code.");
        }
        catch (err) {
            console.error(err);
            toast.error("Failed to initialize WhatsApp: " + err.message);
        }
        finally {
            setQrLoading(false);
            setConnectingWA(false);
        }
    };
    const handleUpdate = async (key, value) => {
        try {
            const updated = { ...settings, [key]: value };
            setSettings(updated);
            await http("/settings", {
                method: "PUT",
                body: JSON.stringify({ [key]: value }),
            });
            toast.success("Setting updated");
        }
        catch {
            toast.error("Failed to update setting");
        }
    };
    const handleRefreshQr = async () => {
        try {
            setRefreshingQr(true);
            await connectWhatsApp(); // regenerate QR
            toast.info("Refreshing QR code...");
        }
        finally {
            setRefreshingQr(false);
        }
    };
    const handleDisconnectWhatsApp = async () => {
        try {
            await http("/whatsapp/disconnect", { method: "POST" });
            setWaStatus({
                connected: false,
                requiresQR: true,
                status: "disconnected",
                qr: null,
            });
            toast.success("WhatsApp disconnected successfully");
        }
        catch {
            toast.error("Failed to disconnect WhatsApp");
        }
    };
    /* ---------------- LIFECYCLE ---------------- */
    useEffect(() => {
        let isMounted = true;
        const init = async () => {
            await fetchSettings();
            if (!isMounted)
                return;
            // Fetch WhatsApp status
            const status = await fetchWhatsAppStatus();
            // Auto-init WhatsApp if not connected
            if (!status?.connected) {
                await connectWhatsApp();
            }
        };
        init();
        // Poll WhatsApp status every 4s
        pollRef.current = setInterval(fetchWhatsAppStatus, 4000);
        return () => {
            isMounted = false;
            if (pollRef.current)
                clearInterval(pollRef.current);
        };
    }, []);
    /* ---------------- RENDER ---------------- */
    return (_jsx("div", { className: "flex h-screen bg-background overflow-hidden", children: _jsx("main", { className: "flex-1 overflow-y-auto p-8", children: _jsxs("div", { className: "max-w-4xl mx-auto space-y-8", children: [_jsxs("header", { children: [_jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Settings" }), _jsx("p", { className: "text-muted-foreground", children: "Manage your automation rules and WhatsApp connection." })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [_jsxs("div", { className: "md:col-span-2 space-y-8", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex gap-2 items-center", children: [_jsx(Shield, { className: "w-5 h-5 text-primary" }), "Automation Rules"] }) }), _jsxs(CardContent, { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Label, { children: "Enable Auto-Reply" }), _jsx(Switch, { checked: settings.auto_reply_enabled === "true", onCheckedChange: (v) => handleUpdate("auto_reply_enabled", String(v)) })] }), _jsxs("div", { className: "space-y-2 pt-4 border-t", children: [_jsx(Label, { children: "Serious Keywords" }), _jsx(Input, { value: settings.serious_keywords
                                                                    ? JSON.parse(settings.serious_keywords).join(", ")
                                                                    : "", onChange: (e) => handleUpdate("serious_keywords", JSON.stringify(e.target.value.split(",").map((k) => k.trim()))) })] })] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex gap-2 items-center", children: [_jsx(Clock, { className: "w-5 h-5 text-primary" }), "Business Hours"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx(Switch, { checked: settings.business_hours_enabled === "true", onCheckedChange: (v) => handleUpdate("business_hours_enabled", String(v)) }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(Input, { type: "time", value: settings.business_hours_start || "09:00", onChange: (e) => handleUpdate("business_hours_start", e.target.value) }), _jsx(Input, { type: "time", value: settings.business_hours_end || "18:00", onChange: (e) => handleUpdate("business_hours_end", e.target.value) })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex gap-2 items-center", children: [_jsx(QrCode, { className: "w-4 h-4 text-primary" }), "WhatsApp Connection"] }) }), _jsxs(CardContent, { className: "space-y-4", children: [waStatus?.requiresQR ? (qrLoading ? (_jsx("div", { className: "flex items-center justify-center h-56", children: _jsx("div", { className: "animate-spin border-4 border-primary border-t-transparent w-16 h-16 rounded-full" }) })) : waStatus.qr ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg-white p-4 rounded-xl border flex justify-center", children: _jsx(QRCode, { value: waStatus.qr, size: 220, style: { width: "100%", height: "auto" } }) }), _jsxs(Button, { onClick: handleRefreshQr, disabled: refreshingQr, className: "w-full text-xs", children: [_jsx(RefreshCcw, { className: `w-3 h-3 mr-2 ${refreshingQr ? "animate-spin" : ""}` }), "Refresh QR"] })] })) : (_jsx(Button, { onClick: connectWhatsApp, disabled: connectingWA, className: "w-full text-xs", children: connectingWA ? "Connecting…" : "Connect WhatsApp" }))) : waStatus?.connected ? (_jsx("div", { className: "p-6 text-center bg-emerald-50 rounded-xl", children: _jsx("p", { className: "font-bold text-emerald-800", children: "Connected" }) })) : (_jsx("div", { className: "p-6 text-center bg-red-50 rounded-xl", children: _jsx("p", { className: "font-bold text-red-800", children: "Disconnected" }) })), waStatus?.connected && (_jsxs(Button, { variant: "destructive", onClick: handleDisconnectWhatsApp, className: "w-full mt-2 flex items-center justify-center gap-2", children: [_jsx(LogOut, { className: "w-4 h-4" }), "Disconnect"] }))] })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex gap-2 items-center", children: [_jsx(Bell, { className: "w-4 h-4 text-primary" }), "Notifications"] }) }), _jsx(CardContent, { className: "space-y-4", children: _jsx(Switch, { defaultChecked: true }) })] })] })] })] }) }) }));
}
