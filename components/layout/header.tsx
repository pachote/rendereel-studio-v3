"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { User, CreditCard } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-gray-900">Rendereel Studio</h2>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CreditCard className="h-4 w-4" />
              <span className="font-medium">Credits: 1,250</span>
            </div>
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    {session.user?.image ? (
                      <img src={session.user.image} alt="Profile" className="h-8 w-8 rounded-full" />
                    ) : (
                      <User className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {session.user?.name || session.user?.email || "User"}
                  </span>
                </div>
                <button onClick={() => signOut({ callbackUrl: "/" })} className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium">
                  Log out
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-md text-sm font-medium">Log in</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
