"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to Rendereel Studio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/generate/image" className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
          <div className="text-2xl mb-2">🖼️</div>
          <p className="font-medium text-blue-900">Generate Image</p>
        </Link>
        <Link href="/generate/video" className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg text-center transition-colors">
          <div className="text-2xl mb-2">🎬</div>
          <p className="font-medium text-purple-900">Generate Video</p>
        </Link>
        <Link href="/assets" className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-center transition-colors">
          <div className="text-2xl mb-2">📚</div>
          <p className="font-medium text-green-900">Assets</p>
        </Link>
        <Link href="/renders" className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg text-center transition-colors">
          <div className="text-2xl mb-2">⚡</div>
          <p className="font-medium text-orange-900">View Renders</p>
        </Link>
      </div>
    </div>
  );
}

