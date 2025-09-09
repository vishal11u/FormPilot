import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ["@supabase/supabase-js"],
  },

  reactStrictMode: false,

  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
