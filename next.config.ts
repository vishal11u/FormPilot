import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },

  basePath: isProd ? "/<your-repo-name>" : "",
  assetPrefix: isProd ? "/<your-repo-name>/" : "",
  trailingSlash: true,
};

export default nextConfig;
