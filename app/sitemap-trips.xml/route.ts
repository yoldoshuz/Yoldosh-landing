import { fetchAllTrips } from "@/app/lib/city-catalog";
import ROUTE_SNAPSHOT from "@/app/lib/route-snapshot.json";
import { buildRouteSlug, listPopularRouteSlugs, resolveCity } from "@/app/lib/route-resolver";

// /sitemap-trips.xml — exposes every indexable city-pair landing page and
// every live trip detail page.
//
// Pipeline:
//   1. Paginate the public trips API and collect the unique (from_city,
//      to_city) tuples seen on real upcoming trips.
//   2. Resolve each city to a canonical slug via the live catalog (which
//      itself merges the seed dictionary with API-discovered cities).
//   3. Union with route-snapshot.json (every pair that ever had a trip,
//      see scripts/snapshot-cities.mjs) and the static popular routes list,
//      so a route never drops out once its last trip departs.
//   4. Emit every URL with hreflang alternates pointing at all locales.

const LOCALES = ["ru", "uz", "en"] as const;
const DEFAULT_LOCALE = "ru";
const BASE_URL = "https://yoldosh.uz";
interface ApiTrip {
  id?: string;
  updatedAt?: string;
  from_location?: { city?: string };
  to_location?: { city?: string };
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
  const tripMap = new Map<string, { lastmod: string }>();

  try {
    for (const trip of await fetchAllTrips<ApiTrip>()) {
      // Trip detail pages are indexable too — list every live trip.
      if (trip.id) tripMap.set(trip.id, { lastmod: trip.updatedAt || new Date().toISOString() });

      const fromCityName = trip.from_location?.city;
      const toCityName = trip.to_location?.city;
      if (!fromCityName || !toCityName) continue;

      // Async catalog lookup — seed first, falls through to the live
      // catalog populated from the same API surface.
      const [from, to] = await Promise.all([resolveCity(fromCityName), resolveCity(toCityName)]);
      if (!from || !to || from.key === to.key) continue;

      const slug = buildRouteSlug(from, to);
      const lastmod = trip.updatedAt || new Date().toISOString();
      const existing = routeMap.get(slug);
      if (!existing || existing.lastmod < lastmod) {
        routeMap.set(slug, { lastmod });
      }
    }
  } catch (err) {
    console.error("Sitemap trips API fetch failed:", err);
  }

  // Every city pair that ever had a trip stays listed, even with no live
  // trips right now — one trip is enough for a route to stay in the index.
  for (const [fromName, toName] of ROUTE_SNAPSHOT) {
    const [from, to] = await Promise.all([resolveCity(fromName), resolveCity(toName)]);
    if (!from || !to || from.key === to.key) continue;
    const slug = buildRouteSlug(from, to);
    if (!routeMap.has(slug)) {
      routeMap.set(slug, { lastmod: new Date().toISOString() });
    }
  }

  for (const slug of listPopularRouteSlugs()) {
    if (!routeMap.has(slug)) {
      routeMap.set(slug, { lastmod: new Date().toISOString() });
    }
  }

  if (routeMap.size === 0) {
    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>',
      { headers: { "Content-Type": "application/xml" } }
    );
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" `;
  xml += `xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

  const entries = [
    ...[...routeMap].map(([slug, v]) => ({ path: `/routes/${slug}`, priority: "0.9", ...v })),
    ...[...tripMap].map(([id, v]) => ({ path: `/trips/${id}`, priority: "0.6", ...v })),
  ];

  for (const { path, lastmod, priority } of entries) {
    const iso = (() => {
      try {
        return new Date(lastmod).toISOString();
      } catch {
        return new Date().toISOString();
      }
    })();
    for (const locale of LOCALES) {
      const loc = `${BASE_URL}/${locale}${xmlEscape(path)}`;
      xml += `  <url>\n`;
      xml += `    <loc>${loc}</loc>\n`;
      xml += `    <lastmod>${iso}</lastmod>\n`;
      xml += `    <changefreq>daily</changefreq>\n`;
      xml += `    <priority>${priority}</priority>\n`;
      for (const alt of LOCALES) {
        xml += `    <xhtml:link rel="alternate" hreflang="${alt}" href="${BASE_URL}/${alt}${xmlEscape(path)}"/>\n`;
      }
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}/${DEFAULT_LOCALE}${xmlEscape(path)}"/>\n`;
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
