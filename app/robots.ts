import { MetadataRoute } from "next";

const BASE_URL = "https://yoldosh.uz";

// robots.txt policy.
//
// Strategy:
//   - Explicitly allow the canonical crawl surface (homepage, trips,
//     routes, content pages, blog).
//   - Disallow API endpoints and account-management flows. The per-trip
//     detail pages under each locale's /trips/<id> path are ephemeral and
//     now ship with `noindex, follow` metadata directly from the page —
//     we don't block them in robots.txt because that would prevent
//     Googlebot from reading the meta robots directive.
//   - Mirror Googlebot's policy to all known LLM / AI search crawlers so
//     Yoldosh stays eligible for AI Overview citations, ChatGPT search
//     attributions, and Perplexity answers — an increasingly meaningful
//     traffic source in 2026.
//   - Reference every sitemap variant so all indexable URLs are
//     discoverable from a single robots.txt fetch.
export default function robots(): MetadataRoute.Robots {
  const sharedDisallow = [
    "/api/",
    "/*/trips/passengers/",
    "/*/trips/driver/",
    "/*/trips/*/passengers/",
    "/*/trips/*/driver/",
    "/*/delete-account",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: sharedDisallow,
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/assets/", "/og-", "/icon"],
        disallow: sharedDisallow,
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "OAI-SearchBot",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "ClaudeBot",
          "anthropic-ai",
          "CCBot",
        ],
        allow: ["/"],
        disallow: sharedDisallow,
      },
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/sitemap-trips.xml`,
      `${BASE_URL}/sitemap-blogs.xml`,
    ],
    host: BASE_URL,
  };
}
