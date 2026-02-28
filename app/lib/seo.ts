import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const locales = ["ru", "uz", "en"];
const baseUrl = "https://yoldosh.uz";

// Localized path map — must match i18n/routing.ts pathnames
const localizedPaths: Record<string, Record<string, string>> = {
  "": { ru: "", uz: "", en: "" },
  "/about-us": { ru: "/о-нас", uz: "/biz-haqimizda", en: "/about-us" },
  "/trips": { ru: "/поездки", uz: "/safarlar", en: "/trips" },
  "/public-offer": { ru: "/публичная-офферта", uz: "/ommaviy-taklif", en: "/public-offer" },
  "/privacy-policy": { ru: "/политика-конфиденциальности", uz: "/maxfiylik-siyosati", en: "/privacy-policy" },
  "/delete-account": { ru: "/удалить-аккаунт", uz: "/hisobni-ochirish", en: "/delete-account" },
};

type PageKey = "home" | "about" | "trips" | "publicOffer" | "privacyPolicy";

const namespaceMap: Record<PageKey, string> = {
  home: "metadata.home",
  about: "metadata.about",
  trips: "metadata.trips",
  publicOffer: "metadata.publicOffer",
  privacyPolicy: "metadata.privacyPolicy",
};

export async function generatePageMetadata(
  locale: string,
  pageKey: PageKey,
  canonicalPath: string // e.g. '', '/about-us', '/trips'
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: namespaceMap[pageKey] });

  const title = t("title");
  const description = t("description");
  const ogImage = t.has("og.image") ? t("og.image") : "/og-default.png";
  const ogTitle = t.has("og.title") ? t("og.title") : title;
  const ogDescription = t.has("og.description") ? t("og.description") : description;

  // Build language alternates with localized paths
  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    const localePath = localizedPaths[canonicalPath]?.[l] ?? canonicalPath;
    languages[l] = `${baseUrl}/${l}${localePath}`;
  });
  languages["x-default"] = `${baseUrl}/ru${localizedPaths[canonicalPath]?.["ru"] ?? canonicalPath}`;

  const canonicalLocPath = localizedPaths[canonicalPath]?.[locale] ?? canonicalPath;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}${canonicalLocPath}`,
      languages,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `${baseUrl}/${locale}${canonicalLocPath}`,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      siteName: "Yoldosh",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
      },
    },
  };
}
