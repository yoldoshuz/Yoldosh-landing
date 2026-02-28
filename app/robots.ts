import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://yoldosh.uz";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Запрещаем индексировать результаты поиска с параметрами
      disallow: ["/*?*from=", "/*?*to=", "/*?*seats=", "/api/*"],
    },
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/sitemap-trips.xml`],
  };
}
