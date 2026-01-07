
import {api} from "./api";

export const sendBroadcast = async (payload) => {
  const res = await api.post("/broadcast", payload);
  return res.data;
};

