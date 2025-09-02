"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-sm font-medium text-white tracking-tight">
              AI Generation Platform
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-[#0066ff] hover:bg-[#0052cc] text-white px-4 py-2 rounded-md text-xs font-medium transition-colors duration-300">
              New Project
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
