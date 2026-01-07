
import { Sidebar } from "@/components/Sidebar";



export default function AppLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}