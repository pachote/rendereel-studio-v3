"use client";

import React from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import { usePathname } from "next/navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const hideSidebar = pathname?.startsWith("/auth/") || pathname === "/";
  return (
    <div className="flex h-screen bg-gray-100">
      {!hideSidebar && <Sidebar />}
      <div className="flex flex-1 flex-col overflow-hidden">
        {!hideSidebar && <Header />}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
