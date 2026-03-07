const locales = ["ru", "uz", "en"];
const baseUrl = "https://yoldosh.uz";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.yoldosh.uz/api/v1";

export async function GET() {
    try {
        // Берём все опубликованные блоги (limit большой, чтобы захватить все)
        const res = await fetch(`${API_URL}/blog?limit=500&page=1`, {
            next: { revalidate: 3600 },
        });

        if (!res.ok) throw new Error("Failed to fetch blogs");

        const json = await res.json();
        const blogs: any[] = json?.data?.blogs ?? [];

        if (blogs.length === 0) throw new Error("No blogs found");

        let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" `;
        xml += `xmlns:xhtml="http://www.w3.org/1999/xhtml">\n`;

        blogs.forEach((blog) => {
            const slug: string = blog.slug;
            const lastmod = blog.updatedAt || blog.createdAt || new Date().toISOString();

            locales.forEach((locale) => {
                xml += `  <url>\n`;
                xml += `    <loc>${baseUrl}/${locale}/blog/${slug}</loc>\n`;
                xml += `    <lastmod>${new Date(lastmod).toISOString()}</lastmod>\n`;
                xml += `    <changefreq>weekly</changefreq>\n`;
                xml += `    <priority>0.8</priority>\n`;

                locales.forEach((alt) => {
                    xml += `    <xhtml:link rel="alternate" hreflang="${alt}" href="${baseUrl}/${alt}/blog/${slug}"/>\n`;
                });
                xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/ru/blog/${slug}"/>\n`;

                xml += `  </url>\n`;
            });
        });

        xml += `</urlset>`;

        return new Response(xml, {
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate",
            },
        });
    } catch (err) {
        console.error("Blog sitemap error:", err);
        return new Response(
            '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>',
            { headers: { "Content-Type": "application/xml" } }
        );
    }
}