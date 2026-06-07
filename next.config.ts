import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Produces a minimal self-contained server for Docker
  output: "standalone",
};

export default nextConfig;
