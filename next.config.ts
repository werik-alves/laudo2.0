import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  distDir: "build",
  experimental: {
    outputFileTracing: false,
  },
};

export default nextConfig;
