"use client";

import React from "react";
import Sidebar from "./sidebar";
import Header from "./header";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="ml-64 min-h-screen bg-gradient-to-br from-black via-gray-950 to-black flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
