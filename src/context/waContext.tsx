// WAContext.tsx
import React, { createContext, useState, useRef, useContext, ReactNode } from "react";

// ----------------------
// Types for WhatsApp state
// ----------------------
export interface WAStatus {
  connected: boolean;
  qr?: string;       // QR code string if needed
  loading?: boolean; // true when init in progress
}

export interface WAContextType {
  waStatus: WAStatus;
  pollRef: React.MutableRefObject<number | null>; // ✅ browser-friendly
  initWhatsAppForUser: () => Promise<void>;
  terminateInit: () => Promise<void>;
}

// ----------------------
// Context creation
// ----------------------
export const WAContext = createContext<WAContextType | undefined>(undefined);

// ----------------------
// Provider
// ----------------------
interface WAProviderProps {
  children: ReactNode;
}

export const WAProvider: React.FC<WAProviderProps> = ({ children }) => {
  const [waStatus, setWaStatus] = useState<WAStatus>({ connected: false, loading: false });
  const pollRef = useRef<number | null>(null);

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
        } catch (err) {
          console.error("Error fetching WhatsApp status:", err);
        }
      }, 3000);
    } catch (err) {
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
    } catch (err) {
      console.error("Terminate WhatsApp init failed:", err);
    }
  };

  return (
    <WAContext.Provider value={{ waStatus, pollRef, initWhatsAppForUser, terminateInit }}>
      {children}
    </WAContext.Provider>
  );
};

// ----------------------
// Hook for easier consumption
// ----------------------
export const useWA = (): WAContextType => {
  const context = useContext(WAContext);
  if (!context) throw new Error("useWA must be used within WAProvider");
  return context;
};