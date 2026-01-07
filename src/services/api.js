
import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const fetchLeads = () => api.get("/leads");
export const updateLead = (id, status) =>
  api.put(`/leads/${id}`, { status });


