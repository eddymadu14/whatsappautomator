// src/pages/Broadcast.tsx
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Send, Users, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { http } from "@/api/http";

type ScheduleMode = "now" | "later";
type RecipientMode = "manual" | "leads";

export default function BroadcastPage() {
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState("");

  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>("now");
  const [scheduledAt, setScheduledAt] = useState<string>("");

  const [recipientMode, setRecipientMode] =
    useState<RecipientMode>("manual");

  const [isSending, setIsSending] = useState(false);

  const recipientList =
    recipientMode === "manual"
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
    const scheduleTime =
      scheduleMode === "later" && scheduledAt
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

    // Define expected response type
    type BroadcastResponse = {
      success: boolean;
      status: string;
      broadcastId?: string;
      scheduledFor?: string;
      error?: string;
    };

    // Make the POST request
    const data: BroadcastResponse = await http<BroadcastResponse>("/broadcast", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    // TypeScript-safe JSON parsing
    //const data: BroadcastResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to process broadcast");
    }

    toast.success(
      scheduleMode === "now"
        ? "Broadcast queued successfully"
        : `Broadcast scheduled for ${new Date(data.scheduledFor!).toLocaleString()}`
    );

    // Store the broadcast ID for possible cancel later
    // Uncomment if using cancel feature
    // setLastScheduledBroadcastId(data.broadcastId);

    // Reset fields
    setMessage("");
    setRecipients("");
    setScheduledAt("");
  } catch (err: any) {
    toast.error(err.message || "Failed to process broadcast");
  } finally {
    setIsSending(false);
  }
};

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <header>
            <h2 className="text-3xl font-bold tracking-tight">Broadcast</h2>
            <p className="text-muted-foreground">
              Send or schedule bulk WhatsApp messages safely.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">
              {/* Message */}
              <Card>
                <CardHeader>
                  <CardTitle>Compose Message</CardTitle>
                  <CardDescription>
                    This message will be sent individually.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="min-h-[180px]"
                    placeholder="Type your broadcast message…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                  <div className="text-xs text-muted-foreground mt-2">
                    {message.length} characters
                  </div>
                </CardContent>
              </Card>

              {/* Recipients */}
              <Card>
                <CardHeader>
                  <CardTitle>Recipients</CardTitle>
                  <CardDescription>
                    Choose where recipients come from.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Recipient Mode */}
                  <div className="flex gap-2">
                    <Button
                      variant={recipientMode === "manual" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRecipientMode("manual")}
                    >
                      Manual
                    </Button>
                    <Button
                      variant={recipientMode === "leads" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRecipientMode("leads")}
                    >
                      Use Leads (Soon)
                    </Button>
                  </div>

                  {recipientMode === "manual" && (
                    <>
                      <Textarea
                        className="min-h-[140px] font-mono text-sm"
                        placeholder="2348012345678,2348098765432"
                        value={recipients}
                        onChange={(e) => setRecipients(e.target.value)}
                      />
                      <div className="text-xs text-primary flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        {recipientList.length} contacts detected
                      </div>
                    </>
                  )}

                  {recipientMode === "leads" && (
                    <p className="text-sm text-muted-foreground">
                      Lead selection will be available once the lead database is
                      enabled.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant={scheduleMode === "now" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setScheduleMode("now")}
                    >
                      Send Now
                    </Button>
                    <Button
                      variant={scheduleMode === "later" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setScheduleMode("later")}
                    >
                      Send Later
                    </Button>
                  </div>

                  {scheduleMode === "later" && (
                    <Input
                      type="datetime-local"
                      value={scheduledAt}
                      onChange={(e) => setScheduledAt(e.target.value)}
                    />
                  )}

                  <Button
                    className="w-full gap-2"
                    size="lg"
                    disabled={isSending}
                    onClick={handleSend}
                  >
                    {isSending
                      ? "Processing…"
                      : scheduleMode === "now"
                      ? "Launch Broadcast"
                      : "Schedule Broadcast"}
                    <Send className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              <div className="bg-amber-50 border rounded-xl p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <p className="text-xs text-amber-800">
                  Always send messages to opted-in contacts to avoid account
                  restrictions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}