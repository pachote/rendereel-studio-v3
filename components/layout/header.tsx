"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-900">Rendereel Studio</h2>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/assets" className="text-sm font-medium text-gray-700 hover:text-gray-900">Assets</Link>
            {session ? (
              <button onClick={() => signOut({ callbackUrl: "/" })} className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium">
                Log out
              </button>
            ) : (
              <Link href="/auth/login" className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium">Log in</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
