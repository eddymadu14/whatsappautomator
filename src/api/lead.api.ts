
import { http } from "./http";
import type { Lead } from "@/types/lead";

export const getLeads = () =>
  http<Lead[]>("/leads");

export const updateLead = (id: number, updates: Partial<Lead>) =>
  http<Lead>(`/leads/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
