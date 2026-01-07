import {api} from "./api";
/**
 * Fetch current WhatsApp connection status from backend
 * @returns {Promise<{status: string, qr?: string}>}
 */
export const fetchWhatsAppStatus = async () => {
  try {
    const response = await axios.get(`${api}/status`);
    // expected backend response: { status: "connected" | "disconnected" | "qr", qr?: "base64string" }
    return response.data;
  } catch (err) {
    console.error("Failed to fetch WhatsApp status:", err.message);
    throw err;
  }
};


