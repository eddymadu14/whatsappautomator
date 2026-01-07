import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useEffect, useState } from "react";
import { fetchWhatsAppStatus } from "@/services/status.api";
export const AppContext = createContext(undefined);
export const AppProvider = ({ children }) => {
    const [whatsapp, setWhatsapp] = useState(null);
    const refreshStatus = async () => {
        try {
            const data = await fetchWhatsAppStatus();
            setWhatsapp(data);
        }
        catch (e) {
            setWhatsapp({ status: "disconnected" });
        }
    };
    useEffect(() => {
        refreshStatus();
        const interval = setInterval(refreshStatus, 3000);
        return () => clearInterval(interval);
    }, []);
    return (_jsx(AppContext.Provider, { value: { whatsapp }, children: children }));
};
// Custom hook for easier usage
export const useAppContext = () => {
    const context = React.useContext(AppContext);
    if (!context)
        throw new Error("useAppContext must be used within AppProvider");
    return context;
};
