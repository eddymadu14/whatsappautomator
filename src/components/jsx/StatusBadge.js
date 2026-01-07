import { jsx as _jsx } from "react/jsx-runtime";
export default function StatusBadge({ status }) {
    const map = {
        connected: "🟢 Connected",
        qr: "🟡 Awaiting QR Scan",
        disconnected: "🔴 Disconnected"
    };
    return _jsx("span", { children: map[status] || "Unknown" });
}
