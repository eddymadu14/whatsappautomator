import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import QRCode from "react-qr-code";
export default function QRBox({ whatsapp }) {
    if (whatsapp.status === "connected") {
        return _jsx("p", { style: { color: "green" }, children: "\uD83D\uDFE2 WhatsApp Connected" });
    }
    if (whatsapp.status === "qr") {
        return (_jsxs(_Fragment, { children: [_jsx("p", { children: "Scan QR Code" }), _jsx(QRCode, { value: whatsapp.qr })] }));
    }
    return _jsx("p", { style: { color: "red" }, children: "\uD83D\uDD34 Disconnected" });
}
