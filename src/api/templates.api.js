import { http } from "./http";
export const getTemplates = () => http("/templates");
export const createTemplate = (data) => http("/templates", {
    method: "POST",
    body: JSON.stringify(data),
});
