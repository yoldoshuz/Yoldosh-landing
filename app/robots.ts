import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://yoldosh.uz";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/*?*from=", "/*?*to=", "/*?*seats=", "/api/*"],
    },
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      `${baseUrl}/sitemap-trips.xml`,
      `${baseUrl}/sitemap-blogs.xml`, // ← добавили
    ],
  };
}