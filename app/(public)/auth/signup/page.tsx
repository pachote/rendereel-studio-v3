"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center">Create your account</h1>
        <p className="mt-2 text-center text-gray-500">Fast signup with Google</p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full mt-6 bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-semibold"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link href="/auth/login" className="text-gray-900 font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}

