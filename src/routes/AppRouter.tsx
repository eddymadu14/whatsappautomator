import { Routes, Route } from "react-router-dom";

import Dashboard from "@/pages/Dashboard";
import AutoRepliesPage from "@/pages/AutoReply";
import Leads from "@/pages/Leads";
import Broadcast from "@/pages/Broadcast";
import Templates from "@/pages/Templates";
import Settings from "@/pages/Settings";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/connect" element={<AutoRepliesPage />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/broadcast" element={<Broadcast />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}