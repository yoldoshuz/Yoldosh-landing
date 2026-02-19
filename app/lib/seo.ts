import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const SITE_URL = "https://yoldosh.uz"; // БЕЗ www — единый canonical

// Локализованные slug'и из routing.ts (для canonical и hreflang)
const PAGE_SLUGS: Record<string, Record<string, string>> = {
  home: { ru: "", uz: "", en: "" },
  trips: { ru: "/%D0%BF%D0%BE%D0%B5%D0%B7%D0%B4%D0%BA%D0%B8", uz: "/safarlar", en: "/trips" },
  about: { ru: "/%D0%BE-%D0%BD%D0%B0%D1%81", uz: "/biz-haqimizda", en: "/about-us" },
  privacyPolicy: {
    ru: "/%D0%BF%D0%BE%D0%BB%D0%B8%D1%82%D0%B8%D0%BA%D0%B0-%D0%BA%D0%BE%D0%BD%D1%84%D0%B8%D0%B4%D0%B5%D0%BD%D1%86%D0%B8%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D1%81%D1%82%D0%B8",
    uz: "/maxfiylik-siyosati",
    en: "/privacy-policy",
  },
  publicOffer: {
    ru: "/%D0%BF%D1%83%D0%B1%D0%BB%D0%B8%D1%87%D0%BD%D0%B0%D1%8F-%D0%BE%D1%84%D1%84%D0%B5%D1%80%D1%82%D0%B0",
    uz: "/ommaviy-taklif",
    en: "/public-offer",
  },
};

export async function generatePageMetadata(
  locale: string,
  namespace: string,
  _path: string // больше не используем — берём из PAGE_SLUGS
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: `metadata.${namespace}` });

  const slugs = PAGE_SLUGS[namespace] ?? { ru: _path, uz: _path, en: _path };
  const canonicalPath = slugs[locale] ?? _path;

  return {
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords"),

    // ИСПРАВЛЕНИЕ: canonical должен указывать на локализованный URL с правильным slug'ом
    alternates: {
      canonical: `${SITE_URL}/${locale}${canonicalPath}`,
      languages: {
        ru: `${SITE_URL}/ru${slugs.ru}`,
        uz: `${SITE_URL}/uz${slugs.uz}`,
        en: `${SITE_URL}/en${slugs.en}`,
        "x-default": `${SITE_URL}/ru${slugs.ru}`,
      },
    },

    openGraph: {
      title: t("og.title"),
      description: t("og.description"),
      images: [{ url: t("og.image"), width: 1200, height: 630 }],
      locale: locale === "ru" ? "ru_RU" : locale === "uz" ? "uz_UZ" : "en_US",
      type: "website",
      siteName: "Yoldosh",
      url: `${SITE_URL}/${locale}${canonicalPath}`,
    },

    twitter: {
      card: "summary_large_image",
      title: t("og.title"),
      description: t("og.description"),
      images: [t("og.image")],
    },
  };
}
