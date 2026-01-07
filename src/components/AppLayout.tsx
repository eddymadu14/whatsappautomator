// src/components/AppLayout.tsx
import React, { ReactNode } from "react";
import { Sidebar } from "@/components/Sidebar";

interface AppLayoutProps {
  children: ReactNode; // explicitly type children
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}