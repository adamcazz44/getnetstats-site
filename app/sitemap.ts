import type { MetadataRoute } from "next";

// Emit a static sitemap.xml for the GitHub Pages export.
export const dynamic = "force-static";

const SITE = "https://getnetstats.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/ping-test`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
