import type { NextConfig } from "next";
import path from "node:path";

// Optional base path for a GitHub Pages *project* site served at
// https://<user>.github.io/<repo>/ — set PAGES_BASE_PATH=/<repo> in that case.
// Leave unset for a custom domain (getnetstats.com) or a user/org site.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static HTML export → GitHub Pages (Tier 1 is fully client-side, no server).
  output: "export",
  // No Next Image Optimization server on a static host.
  images: { unoptimized: true },
  // Emit /route/index.html so clean URLs resolve reliably on a static host.
  trailingSlash: true,
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  // Pin the workspace root: a stray package-lock.json in the parent home dir
  // otherwise makes Next infer the wrong root for output file tracing.
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
