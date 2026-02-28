import { MetadataRoute } from "next";

const baseUrl = "https://yoldosh.uz";
const locales = ["ru", "uz", "en"];

// Пример статических роутов. Если используешь localized pathnames,
// создай словарь маппинга: { 'about-us': { ru: '/о-нас', en: '/about-us', uz: '/biz-haqimiz' } }
const routes = ["", "/about-us", "/trips", "/public-offer", "/privacy-policy"];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "daily" : "weekly",
        priority: route === "" ? 1.0 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
