import { http } from "./http";

export type WhatsappStatus = {
  status: "qr" | "connected" | "disconnected";
  connected: boolean;
};

export const fetchWhatsappStatus = async (): Promise<WhatsappStatus> => {
  return http("/whatsapp/status");;
};

export const fetchWhatsappQR = async () => {
  return http("/whatsapp/qr");;
};