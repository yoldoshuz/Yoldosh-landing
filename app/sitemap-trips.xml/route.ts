const locales = ["ru", "uz", "en"];
const baseUrl = "https://yoldosh.uz";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
}

export async function GET() {
  try {
    const response = await fetch("https://api.yoldosh.uz/api/v1/public/trips/popular", {
      cache: "no-store",
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch trips");
    }

    const json = await response.json();

    const trips = json?.data?.trips;

    if (!trips || trips.length === 0) {
      throw new Error("No trips found");
    }

    // Убираем дубликаты маршрутов
    const uniqueRoutes = new Map();

    trips.forEach((trip: any) => {
      const from = slugify(trip.from_location.city);
      const to = slugify(trip.to_location.city);
      const slug = `${from}-${to}`;

      if (!uniqueRoutes.has(slug)) {
        uniqueRoutes.set(slug, {
          slug,
          lastmod: trip.updatedAt || new Date().toISOString(),
        });
      }
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" `;
    xml += `xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

    uniqueRoutes.forEach(({ slug, lastmod }) => {
      locales.forEach((locale) => {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/${locale}/routes/${slug}</loc>\n`;
        xml += `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>\n`;
        xml += `    <changefreq>daily</changefreq>\n`;
        xml += `    <priority>0.9</priority>\n`;

        locales.forEach((altLocale) => {
          xml += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}/routes/${slug}"/>\n`;
        });

        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/ru/routes/${slug}"/>\n`;

        xml += `  </url>\n`;
      });
    });

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate",
      },
    });
  } catch (error) {
    console.error("Sitemap trips error:", error);

    return new Response(
      '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>',
      { headers: { "Content-Type": "application/xml" } }
    );
  }
}
