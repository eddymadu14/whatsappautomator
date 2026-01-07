import { http } from "./http";
export const getLeads = () => http("/leads");
export const updateLead = (id, updates) => http(`/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
});
