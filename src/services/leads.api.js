import {api} from "./api";

export const fetchLeads = async () => {
  const res = await api.get("/leads");
  return res.data;
};