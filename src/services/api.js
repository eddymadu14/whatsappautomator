
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not defined in .env");
}


export const api = axios.create({
  baseURL: `${API_BASE_URL}`,
});

export const fetchLeads = () => api.get("/leads");
export const updateLead = (id, status) =>
  api.put(`/leads/${id}`, { status });


