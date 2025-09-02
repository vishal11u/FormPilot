import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed output: "export" to enable dynamic features like middleware and API routes
  // This allows the authentication system to work properly
  images: {
    unoptimized: true,
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
};

export default nextConfig;
