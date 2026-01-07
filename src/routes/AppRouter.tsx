
import { Routes, Route } from "react-router-dom";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/connect" element={<Connect />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/broadcast" element={<Broadcast />} />
      <Route path="/templates" element={<Templates />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}