import type { MetadataRoute } from "next";

const SITE = "https://getnetstats.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/ping-test`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/whois`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
