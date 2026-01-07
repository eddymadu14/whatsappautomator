
export interface Lead {
  id: number;
  phone: string;
  name: string;
  message: string;
  status: "pending" | "contacted" | "converted" | "cold";
  is_serious: number;
  created_at: string;
}
