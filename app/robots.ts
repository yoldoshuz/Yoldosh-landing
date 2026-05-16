import { MetadataRoute } from "next";

const BASE_URL = "https://yoldosh.uz";

// Approach:
//   - Explicitly allow the canonical surface (homepage, trips, routes,
//     localized aliases, content pages).
//   - Explicitly disallow API endpoints and on-page UX widgets that don't
//     belong in search (e.g. /trips/passengers/, /trips/driver/, account
//     management). The /trips?from=... search permutations are NOT blocked
//     here anymore — they're now handled via noindex meta on the trips page,
//     which lets Google read the canonical we set there and consolidate
//     equity into the corresponding /routes/[slug] landing page.
//   - Reference all sitemap variants.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/api/",
          "/*/trips/passengers/",
          "/*/trips/driver/",
          "/*/delete-account",
        ],
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
