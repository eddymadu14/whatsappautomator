
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { api } from "../services/api";

export default function Connect() {
  const [status, setStatus] = useState("disconnected");
  const [qr, setQr] = useState("");

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Fetch connection status
        const statusRes = await api.get("/whatsapp/status");
        setStatus(statusRes.data.status);

        // Fetch QR only if needed
        if (statusRes.data.status === "qr") {
          const qrRes = await api.get("/whatsapp/qr");
          setQr(qrRes.data.qr);
        } else {
          setQr("");
        }
      } catch (err) {
        console.error("Failed to fetch WhatsApp state", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>WhatsApp Status: {status}</h2>
      {qr && <QRCode value={qr} size={256} />}
      {status === "connected" && <p>WhatsApp is connected ✅</p>}
    </div>
  );
}









// import { useContext } from "react";
// import { AppContext } from "../context/AppContext";
// import QRCode from "react-qr-code";

// export default function Connect() {
//   const { whatsapp } = useContext(AppContext);

//   if (!whatsapp) return <p>Loading...</p>;

//   return (
//     <div>
//       <h2>WhatsApp Connection</h2>

//       {whatsapp.status === "qr" && (
//         <>
//           <p>Scan QR Code</p>
//           <QRCode value={whatsapp.qr} />
//         </>
//       )}

//       {whatsapp.status === "connected" && (
//         <p style={{ color: "green" }}>Connected</p>
//       )}

//       {whatsapp.status === "disconnected" && (
//         <p style={{ color: "red" }}>Disconnected</p>
//       )}
//     </div>
//   );
// }


