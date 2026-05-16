import {
  buildRouteSlug,
  listPopularRouteSlugs,
  resolveCity,
} from "@/app/lib/route-resolver";

// /sitemap-trips.xml — exposes every indexable city-pair landing page.
//
// Pipeline:
//   1. Paginate the public trips API and collect the unique (from_city,
//      to_city) tuples seen on real upcoming trips.
//   2. Resolve each city to a canonical slug via the live catalog (which
//      itself merges the seed dictionary with API-discovered cities).
//   3. Union with the static popular routes list so the sitemap never
//      regresses if the API window is empty for a moment.
//   4. Emit every URL with hreflang alternates pointing at all locales.

const LOCALES = ["ru", "uz", "en"] as const;
const DEFAULT_LOCALE = "ru";
const BASE_URL = "https://yoldosh.uz";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yoldosh.uz/api/v1";

const PAGE_COUNT = 10;
const PAGE_SIZE = 500;

interface ApiTrip {
  updatedAt?: string;
  from_location?: { city?: string };
  to_location?: { city?: string };
}

async function fetchTripsPage(page: number): Promise<ApiTrip[]> {
  try {
    const res = await fetch(
      `${API_URL}/public/trips/popular?page=${page}&limit=${PAGE_SIZE}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json?.data?.trips ?? [];
  } catch {
    return [];
  }
}

function xmlEscape(value: string): string {
  return value.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export async function GET() {
  const routeMap = new Map<string, { lastmod: string }>();

  try {
    const tripPages = await Promise.all(
      Array.from({ length: PAGE_COUNT }, (_, i) => fetchTripsPage(i + 1)),
    );

    for (const page of tripPages) {
      for (const trip of page) {
        const fromCityName = trip.from_location?.city;
        const toCityName = trip.to_location?.city;
        if (!fromCityName || !toCityName) continue;

        // Async catalog lookup — seed first, falls through to the live
        // catalog populated from the same API surface.
        const [from, to] = await Promise.all([
          resolveCity(fromCityName),
          resolveCity(toCityName),
        ]);
        if (!from || !to || from.key === to.key) continue;

        const slug = buildRouteSlug(from, to);
        const lastmod = trip.updatedAt || new Date().toISOString();
        const existing = routeMap.get(slug);
        if (!existing || existing.lastmod < lastmod) {
          routeMap.set(slug, { lastmod });
        }
      }
    }
  } catch (err) {
    console.error("Sitemap trips API fetch failed:", err);
  }

  for (const slug of listPopularRouteSlugs()) {
    if (!routeMap.has(slug)) {
      routeMap.set(slug, { lastmod: new Date().toISOString() });
    }
  }

  if (routeMap.size === 0) {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>',
      { headers: { "Content-Type": "application/xml" } },
    );
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" `;
  xml += `xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  for (const [slug, { lastmod }] of routeMap) {
    const iso = (() => {
      try {
        return new Date(lastmod).toISOString();
      } catch {
        return new Date().toISOString();
      }
    })();
    for (const locale of LOCALES) {
      const loc = `${BASE_URL}/${locale}/routes/${xmlEscape(slug)}`;
      xml += `  <url>\n`;
      xml += `    <loc>${loc}</loc>\n`;
      xml += `    <lastmod>${iso}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>0.9</priority>\n`;
      for (const alt of LOCALES) {
        xml += `    <xhtml:link rel="alternate" hreflang="${alt}" href="${BASE_URL}/${alt}/routes/${xmlEscape(slug)}"/>\n`;
      }
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/${DEFAULT_LOCALE}/routes/${xmlEscape(slug)}"/>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate",
    },
  });
}
