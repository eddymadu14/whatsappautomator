
export default function StatusBadge({ status }) {
  const map = {
    connected: "🟢 Connected",
    qr: "🟡 Awaiting QR Scan",
    disconnected: "🔴 Disconnected"
  };

  return <span>{map[status] || "Unknown"}</span>;
}
