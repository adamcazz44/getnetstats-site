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
    { url: `${SITE}/vpn-guide/`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/about/`, lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE}/privacy/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/terms/`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
