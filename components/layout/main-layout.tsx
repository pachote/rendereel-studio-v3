"use client";

import React from "react";
import Sidebar from "./sidebar";
import Header from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gradient-to-b from-black to-[#0a0a0a]">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col overflow-hidden md:ml-60">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
