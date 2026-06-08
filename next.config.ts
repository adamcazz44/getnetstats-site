import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root: a stray package-lock.json in the parent home dir
  // otherwise makes Next infer the wrong root for output file tracing.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
