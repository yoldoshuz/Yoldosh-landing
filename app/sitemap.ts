import { MetadataRoute } from "next";

// ВАЖНО: все URL должны содержать локаль — без этого Google видит редирект и не индексирует
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://yoldosh.uz";
  const locales = ["ru", "uz", "en"] as const;

  // Пути с учётом локализованных slug'ов (из routing.ts)
  const pathsByLocale: Record<string, Record<string, string>> = {
    home: { ru: "", uz: "", en: "" },
    trips: {
      ru: "/%D0%BF%D0%BE%D0%B5%D0%B7%D0%B4%D0%BA%D0%B8",
      uz: "/safarlar",
      en: "/trips",
    },
    about: {
      ru: "/%D0%BE-%D0%BD%D0%B0%D1%81",
      uz: "/biz-haqimizda",
      en: "/about-us",
    },
    privacy: {
      ru: "/%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0-%D0%BA%D0%BE%D0%BD%D1%84%D0%B8%D0%B4%D0%B5%D0%BD%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D0%B8",
      uz: "/maxfiylik-siyosati",
      en: "/privacy-policy",
    },
    offer: {
      ru: "/%D0%BF%D1%83%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D0%B0%D1%8F-%D0%BE%D1%84%D1%84%D0%B5%D1%80%D1%82%D0%B0",
      uz: "/ommaviy-taklif",
      en: "/public-offer",
    },
  };

  const priorities: Record<string, number> = {
    home: 1.0,
    trips: 0.9,
    about: 0.8,
    privacy: 0.5,
    offer: 0.5,
  };

  const changeFreqs: Record<string, MetadataRoute.Sitemap[0]["changeFrequency"]> = {
    home: "daily",
    trips: "hourly",
    about: "monthly",
    privacy: "yearly",
    offer: "yearly",
  };

  const pages: MetadataRoute.Sitemap = [];

  for (const [pageKey, localePaths] of Object.entries(pathsByLocale)) {
    for (const locale of locales) {
      pages.push({
        url: `${base}/${locale}${localePaths[locale]}`,
        lastModified: new Date(),
        changeFrequency: changeFreqs[pageKey],
        priority: priorities[pageKey],
      });
    }
  }

  return pages;
}
