import { jsx as _jsx } from "react/jsx-runtime";
// WAContext.tsx
import { createContext, useState, useRef, useContext } from "react";
// ----------------------
// Context creation
// ----------------------
export const WAContext = createContext(undefined);
export const WAProvider = ({ children }) => {
    const [waStatus, setWaStatus] = useState({ connected: false, loading: false });
    const pollRef = useRef(null);
    // ----------------------
    // Initialize WhatsApp session
    // ----------------------
    const initWhatsAppForUser = async () => {
        try {
            setWaStatus((prev) => ({ ...prev, loading: true }));
            // Call backend to start WhatsApp init
            const res = await fetch("/whatsapp/init", { method: "POST" });
            const data = await res.json();
            if (data.qr) {
                setWaStatus({ connected: false, qr: data.qr, loading: false });
            }
            // Start polling for connection status
            pollRef.current = window.setInterval(async () => {
                try {
                    const statusRes = await fetch("/whatsapp/status");
                    const statusData = await statusRes.json();
                    setWaStatus({ connected: !!statusData.connected, loading: false });
                    // Stop polling if connected
                    if (statusData.connected && pollRef.current) {
                        clearInterval(pollRef.current);
                        pollRef.current = null;
                    }
                }
                catch (err) {
                    console.error("Error fetching WhatsApp status:", err);
                }
            }, 3000);
        }
        catch (err) {
            console.error("WhatsApp init failed:", err);
            setWaStatus({ connected: false, loading: false });
        }
    };
    // ----------------------
    // Terminate QR/init session (QR killer)
    // ----------------------
    const terminateInit = async () => {
        try {
            if (pollRef.current) {
                clearInterval(pollRef.current);
                pollRef.current = null;
            }
            await fetch("/whatsapp/terminate-init", { method: "POST" });
            setWaStatus({ connected: false, loading: false });
        }
        catch (err) {
            console.error("Terminate WhatsApp init failed:", err);
        }
    };
    return (_jsx(WAContext.Provider, { value: { waStatus, pollRef, initWhatsAppForUser, terminateInit }, children: children }));
};
// ----------------------
// Hook for easier consumption
// ----------------------
export const useWA = () => {
    const context = useContext(WAContext);
    if (!context)
        throw new Error("useWA must be used within WAProvider");
    return context;
};
