import type { MetadataRoute } from "next";

// Emit a static sitemap.xml for the GitHub Pages export.
export const dynamic = "force-static";

const SITE = "https://getnetstats.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // Build-time date — represents when the static site was last generated.
  const lastModified = new Date();
  return [
    { url: `${SITE}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/ping-test/`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
