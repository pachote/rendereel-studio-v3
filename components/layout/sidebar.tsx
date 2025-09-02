"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/", icon: "🏠" },
  { name: "Generate Image", href: "/generate/image", icon: "🖼️" },
  { name: "Generate Video", href: "/generate/video", icon: "🎬" },
  { name: "Projects", href: "/projects", icon: "📁" },
  { name: "Renders", href: "/renders", icon: "⚡" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden md:flex fixed top-0 left-0 h-screen w-60 flex-col border-r border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px]">
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 pb-4">
        <div className="flex items-center px-4">
          <h1 className="text-base font-semibold text-white tracking-tight">Rendereel Studio</h1>
        </div>
        <nav className="mt-6 flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                  isActive
                    ? "bg-[rgba(255,255,255,0.08)] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_10px_30px_rgba(0,0,0,0.5)]"
                    : "text-[rgba(255,255,255,0.8)] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
