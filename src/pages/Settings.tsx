import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { QrCode, Shield, Bell, Clock, RefreshCcw, LogOut } from "lucide-react";

import { http } from "@/api/http";

interface SettingsType {
  auto_reply_enabled?: string;
  serious_keywords?: string;
  business_hours_enabled?: string;
  business_hours_start?: string;
  business_hours_end?: string;
  [key: string]: any;
}

interface WhatsAppStatus {
  status: "qr" | "connected" | "disconnected";
  connected: boolean;
  requiresQR: boolean;
  qr?: string | null;
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const pollRef = useRef<NodeJS.Timer | null>(null);
  const initialToastRef = useRef(true);

  const [settings, setSettings] = useState<SettingsType>({});
  const [waStatus, setWaStatus] = useState<WhatsAppStatus | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [qrLoading, setQrLoading] = useState(false);
  const [refreshingQr, setRefreshingQr] = useState(false);
  const [connectingWA, setConnectingWA] = useState(false);

  /* ---------------- FETCHERS ---------------- */
  const fetchSettings = async () => {
    try {
      const res = await http<SettingsType>("/settings");
      setSettings(res);
    } catch {
      toast.error("Failed to fetch settings");
    } finally {
      setLoadingSettings(false);
    }
  };

  const fetchWhatsAppStatus = async (): Promise<WhatsAppStatus | null> => {
    try {
      const status = await http<WhatsAppStatus>("/whatsapp/status");
      let qr: string | null = null;

      if (status.requiresQR) {
        setQrLoading(true);
        try {
          const qrRes = await http<{ qr: string }>("/whatsapp/qr");
          qr = qrRes.qr;
        } catch {
          qr = null;
        } finally {
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
    } catch (err) {
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
      const qrRes = await http<{ qr: string }>("/whatsapp/connect", {
        method: "POST",
      });
      setWaStatus({
        connected: false,
        requiresQR: true,
        status: "qr",
        qr: qrRes.qr,
      });
      toast.info("WhatsApp initialized. Scan the QR code.");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to initialize WhatsApp: " + err.message);
    } finally {
      setQrLoading(false);
      setConnectingWA(false);
    }
  };

  const handleUpdate = async (key: string, value: string) => {
    try {
      const updated = { ...settings, [key]: value };
      setSettings(updated);

      await http("/settings", {
        method: "PUT",
        body: JSON.stringify({ [key]: value }),
      });

      toast.success("Setting updated");
    } catch {
      toast.error("Failed to update setting");
    }
  };

  const handleRefreshQr = async () => {
    try {
      setRefreshingQr(true);
      await connectWhatsApp(); // regenerate QR
      toast.info("Refreshing QR code...");
    } finally {
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
    } catch {
      toast.error("Failed to disconnect WhatsApp");
    }
  };

  /* ---------------- LIFECYCLE ---------------- */
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      await fetchSettings();

      if (!isMounted) return;

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
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  /* ---------------- RENDER ---------------- */
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your automation rules and WhatsApp connection.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* LEFT: Automation & Business Hours */}
            <div className="md:col-span-2 space-y-8">
              {/* Automation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center">
                    <Shield className="w-5 h-5 text-primary" />
                    Automation Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex justify-between items-center">
                    <Label>Enable Auto-Reply</Label>
                    <Switch
                      checked={settings.auto_reply_enabled === "true"}
                      onCheckedChange={(v) =>
                        handleUpdate("auto_reply_enabled", String(v))
                      }
                    />
                  </div>

                  <div className="space-y-2 pt-4 border-t">
                    <Label>Serious Keywords</Label>
                    <Input
                      value={
                        settings.serious_keywords
                          ? JSON.parse(settings.serious_keywords).join(", ")
                          : ""
                      }
                      onChange={(e) =>
                        handleUpdate(
                          "serious_keywords",
                          JSON.stringify(
                            e.target.value.split(",").map((k) => k.trim())
                          )
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center">
                    <Clock className="w-5 h-5 text-primary" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Switch
                    checked={settings.business_hours_enabled === "true"}
                    onCheckedChange={(v) =>
                      handleUpdate("business_hours_enabled", String(v))
                    }
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="time"
                      value={settings.business_hours_start || "09:00"}
                      onChange={(e) =>
                        handleUpdate("business_hours_start", e.target.value)
                      }
                    />
                    <Input
                      type="time"
                      value={settings.business_hours_end || "18:00"}
                      onChange={(e) =>
                        handleUpdate("business_hours_end", e.target.value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT: WhatsApp & Notifications */}
            <div className="space-y-6">
              {/* WhatsApp */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center">
                    <QrCode className="w-4 h-4 text-primary" />
                    WhatsApp Connection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {waStatus?.requiresQR ? (
                    qrLoading ? (
                      <div className="flex items-center justify-center h-56">
                        <div className="animate-spin border-4 border-primary border-t-transparent w-16 h-16 rounded-full"></div>
                      </div>
                    ) : waStatus.qr ? (
                      <>
                        <div className="bg-white p-4 rounded-xl border flex justify-center">
                          <QRCode
                            value={waStatus.qr}
                            size={220}
                            style={{ width: "100%", height: "auto" }}
                          />
                        </div>
                        <Button
                          onClick={handleRefreshQr}
                          disabled={refreshingQr}
                          className="w-full text-xs"
                        >
                          <RefreshCcw
                            className={`w-3 h-3 mr-2 ${
                              refreshingQr ? "animate-spin" : ""
                            }`}
                          />
                          Refresh QR
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={connectWhatsApp}
                        disabled={connectingWA}
                        className="w-full text-xs"
                      >
                        {connectingWA ? "Connecting…" : "Connect WhatsApp"}
                      </Button>
                    )
                  ) : waStatus?.connected ? (
                    <div className="p-6 text-center bg-emerald-50 rounded-xl">
                      <p className="font-bold text-emerald-800">Connected</p>
                    </div>
                  ) : (
                    <div className="p-6 text-center bg-red-50 rounded-xl">
                      <p className="font-bold text-red-800">Disconnected</p>
                    </div>
                  )}

                  {waStatus?.connected && (
                    <Button
                      variant="destructive"
                      onClick={handleDisconnectWhatsApp}
                      className="w-full mt-2 flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center">
                    <Bell className="w-4 h-4 text-primary" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Switch defaultChecked />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}