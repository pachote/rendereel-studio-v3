"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Log in to Rendereel</h1>
        <p className="mt-2 text-center text-gray-500">Use your Google account</p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full mt-6 bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-semibold"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don\'t have an account? <Link href="/auth/signup" className="text-gray-900 font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

