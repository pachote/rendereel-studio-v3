"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.15),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_35%),radial-gradient(circle_at_0%_100%,rgba(255,255,255,0.1),transparent_40%)]" />

      <div className="relative z-10">
        <header className="flex items-center justify-between px-6 py-5">
          <div className="text-white font-bold text-lg">Rendereel Studio</div>
          <div className="space-x-3">
            <Link href="/auth/login" className="text-white/90 hover:text-white font-medium">Log in</Link>
            <Link href="/auth/signup" className="inline-block bg-white text-purple-600 px-4 py-2 rounded-md font-semibold hover:bg-gray-100">Sign up</Link>
          </div>
        </header>

        <main className="px-6">
          <div className="max-w-5xl mx-auto text-center pt-10 pb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
              Create next‑level images and videos with AI
            </h1>
            <p className="mt-4 text-white/90 text-lg md:text-xl">
              Flux and SDXL for images. Kling and WAN for video. One professional studio.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/auth/signup" className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Get started
              </Link>
              <Link href="#features" className="text-white/90 hover:text-white font-medium">
                Learn more →
              </Link>
            </div>
          </div>

          <section id="features" className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 pb-16">
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="text-3xl">🖼️</div>
              <h3 className="mt-3 text-white text-xl font-semibold">AI Image Generation</h3>
              <p className="mt-2 text-white/80 text-sm">
                Forge‑style advanced controls with Negative Prompt, Samplers, Upscalers, ADetailer.
              </p>
              <Link href="/auth/signup" className="inline-block mt-4 text-white font-medium hover:underline">
                Try image studio →
              </Link>
            </div>
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="text-3xl">🎬</div>
              <h3 className="mt-3 text-white text-xl font-semibold">AI Video Creation</h3>
              <p className="mt-2 text-white/80 text-sm">
                Kling v1.6/v2.1 and WAN 2.2 with LoRA support in a pro‑grade interface.
              </p>
              <Link href="/auth/signup" className="inline-block mt-4 text-white font-medium hover:underline">
                Try video studio →
              </Link>
            </div>
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
              <div className="text-3xl">📚</div>
              <h3 className="mt-3 text-white text-xl font-semibold">Your Asset Library</h3>
              <p className="mt-2 text-white/80 text-sm">
                Manage prompts, LoRAs, outputs, and projects in one secure workspace.
              </p>
              <Link href="/auth/signup" className="inline-block mt-4 text-white font-medium hover:underline">
                Explore assets →
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
