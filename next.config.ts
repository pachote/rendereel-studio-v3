import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow builds to complete on Vercel even if ESLint finds issues
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
