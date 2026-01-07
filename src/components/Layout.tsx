import type { ReactNode } from "react";
import { Toaster } from "../components/ui/sonner"; // adjust path
import {Sidebar} from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen font-sans antialiased bg-background text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-4 bg-[#1a1a1a] shadow-md text-primary font-bold">
          WhatsApp Business Automator
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>

        {/* Footer */}
        <footer className="p-4 bg-[#1a1a1a] text-sm text-gray-400 text-center">
          © 2025 WAutomator
        </footer>
      </div>

      {/* Global Toaster */}
      <Toaster position="top-right" />
    </div>
  );
}