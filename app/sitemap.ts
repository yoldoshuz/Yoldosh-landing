import { MetadataRoute } from "next";

const BASE_URL = "https://yoldosh.uz";
const LOCALES = ["ru", "uz", "en"] as const;
const DEFAULT_LOCALE: (typeof LOCALES)[number] = "ru";

// All static, top-level pages. Every path is the Latin canonical form — old
// Cyrillic / Uzbek-localized URLs are kept alive via 308 redirects in
// next.config.ts so we never advertise legacy aliases here.
//
// Priority semantics (relative within this site):
//   1.0  — homepage, single most important conversion surface
//   0.9  — primary funnel pages (search hub, driver/passenger landing,
//          blog index — direct paths to traffic-monetising actions)
//   0.6  — supporting evergreen content (about)
//   0.2  — legal / compliance surfaces, kept indexable but de-emphasised
const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "", priority: 1.0, changeFrequency: "daily" },
  { path: "/trips", priority: 0.9, changeFrequency: "daily" },
  { path: "/for-drivers", priority: 0.9, changeFrequency: "weekly" },
  { path: "/for-passengers", priority: 0.9, changeFrequency: "weekly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/about-us", priority: 0.6, changeFrequency: "monthly" },
  { path: "/public-offer", priority: 0.2, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" },
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
            LOCALES.map((l) => [l, `${BASE_URL}/${l}${path}`]).concat([
              ["x-default", `${BASE_URL}/${DEFAULT_LOCALE}${path}`],
            ])
          ),
        },
      });
    }
  }

  return entries;
}
