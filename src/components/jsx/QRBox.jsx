
import QRCode from "react-qr-code";

export default function QRBox({ whatsapp }) {
  if (whatsapp.status === "connected") {
    return <p style={{ color: "green" }}>🟢 WhatsApp Connected</p>;
  }

  if (whatsapp.status === "qr") {
    return (
      <>
        <p>Scan QR Code</p>
        <QRCode value={whatsapp.qr} />
      </>
    );
  }

  return <p style={{ color: "red" }}>🔴 Disconnected</p>;
}

