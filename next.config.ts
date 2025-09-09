import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },

  experimental: {
    optimizePackageImports: ["@supabase/supabase-js"],
  },

  reactStrictMode: false,

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
