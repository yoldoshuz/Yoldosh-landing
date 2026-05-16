import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const LOCALES = ["ru", "uz", "en"];
const SITE_URL = "https://yoldosh.uz";
const DEFAULT_LOCALE = "ru";

// All locales now share the same Latin canonical path. Per-locale Cyrillic /
// Uzbek aliases (e.g. /ru/поездки, /uz/safarlar) live as 308 redirects in
// next.config.ts so the canonical URL surfaced to search engines is unified.
type PageKey =
  | "home"
  | "about"
  | "trips"
  | "publicOffer"
  | "privacyPolicy"
  | "blog"
  | "forDrivers"
  | "forPassengers";

const NAMESPACE_MAP: Record<PageKey, string> = {
  home: "metadata.home",
  about: "metadata.about",
  trips: "metadata.trips",
  publicOffer: "metadata.publicOffer",
  privacyPolicy: "metadata.privacyPolicy",
  blog: "metadata.blog",
  forDrivers: "metadata.forDrivers",
  forPassengers: "metadata.forPassengers",
};

function buildLanguageAlternates(canonicalPath: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${SITE_URL}/${l}${canonicalPath}`;
  }
  languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${canonicalPath}`;
  return languages;
}

export async function generatePageMetadata(
  locale: string,
  pageKey: PageKey,
  canonicalPath: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: NAMESPACE_MAP[pageKey] });

  const title = t("title");
  const description = t("description");
  const ogImage = t.has("og.image") ? t("og.image") : "/og-default.png";
  const ogTitle = t.has("og.title") ? t("og.title") : title;
  const ogDescription = t.has("og.description") ? t("og.description") : description;

  return {
    title,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `${SITE_URL}/${locale}${canonicalPath}`,
      languages: buildLanguageAlternates(canonicalPath),
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: `${SITE_URL}/${locale}${canonicalPath}`,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      siteName: "Yo'ldosh",
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
