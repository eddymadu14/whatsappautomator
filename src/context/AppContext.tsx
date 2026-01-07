
import { createContext, useEffect, useState} from "react";
import type {ReactNode } from "react";

import * as React from "react";
import { fetchWhatsAppStatus } from "@/services/status.api";

// Define the shape of your WhatsApp state
interface WhatsAppStatus {
  status: "connected" | "disconnected" | "qr" | string;
  qr?: string;
}

// Define the context value type
interface AppContextType {
  whatsapp: WhatsAppStatus | null;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [whatsapp, setWhatsapp] = useState<WhatsAppStatus | null>(null);

  const refreshStatus = async () => {
    try {
      const data = await fetchWhatsAppStatus();
      setWhatsapp(data);
    } catch (e) {
      setWhatsapp({ status: "disconnected" });
    }
  };

  useEffect(() => {
    refreshStatus();
    const interval = setInterval(refreshStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AppContext.Provider value={{ whatsapp }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook for easier usage
export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};