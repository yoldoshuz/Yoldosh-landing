import { MetadataRoute } from "next";

const BASE_URL = "https://yoldosh.uz";
const LOCALES = ["ru", "uz", "en"] as const;

// All static, top-level pages. Every path is the Latin canonical form — old
// Cyrillic / Uzbek-localized URLs are kept alive via 308 redirects in
// next.config.ts so we never advertise legacy aliases here.
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/trips", priority: 0.9, changeFrequency: "daily" },
  { path: "/about-us", priority: 0.7, changeFrequency: "monthly" },
  { path: "/for-drivers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/for-passengers", priority: 0.8, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/public-offer", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  for (const { path, priority, changeFrequency } of STATIC_ROUTES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${BASE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency,
        priority,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`]).concat([["x-default", `${BASE_URL}/ru${path}`]]),
          ),
        },
      });
    }
  }

  return entries;
}
