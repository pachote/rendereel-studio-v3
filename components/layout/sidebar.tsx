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
    <aside className="fixed left-0 top-0 h-full w-64 bg-black border-r border-white/10">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8">Rendereel Studio</h1>
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all border border-transparent ${
                  isActive
                    ? "bg-white/10 text-white border-white/10"
                    : "text-gray-300 hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <span className="mr-1 text-lg">{item.icon}</span>
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
