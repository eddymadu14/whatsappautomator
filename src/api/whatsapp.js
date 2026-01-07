import { http } from "./http";
export const fetchWhatsappStatus = async () => {
    return http("/whatsapp/status");
    ;
};
export const fetchWhatsappQR = async () => {
    return http("/whatsapp/qr");
    ;
};
