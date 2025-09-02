"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-black/40 backdrop-blur-sm border-b border-white/10 ml-64">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-white">
              AI Generation Platform
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 rounded-md text-sm font-medium text-white bg-black/40 border border-white/10 hover:bg-black/60 transition-colors">
              New Project
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
