
import {api} from "./api";

export const fetchTemplates = async () => {
  const res = await api.get("/templates");
  return res.data;
};
