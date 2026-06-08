import type { MetadataRoute } from "next";

// Emit a static robots.txt for the GitHub Pages export.
export const dynamic = "force-static";

const SITE = "https://getnetstats.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
