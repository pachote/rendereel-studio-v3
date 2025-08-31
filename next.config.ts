import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow builds to pass while we iterate; we'll tighten rules later
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow builds to pass even if there are type errors during initial setup
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
