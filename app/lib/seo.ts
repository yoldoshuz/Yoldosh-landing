import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const LOCALES = ["ru", "uz", "en"] as const;
const SITE_URL = "https://yoldosh.uz";
const DEFAULT_LOCALE: (typeof LOCALES)[number] = "ru";

// All locales share the same Latin canonical path. Per-locale Cyrillic /
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

/**
 * Builds the `<link rel="alternate" hreflang="...">` map that Next.js
 * emits into the page head. `x-default` points at the highest-traffic
 * locale (Russian) — Google uses this fallback when no exact locale
 * match is found for the user.
 */
function buildLanguageAlternates(canonicalPath: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[l] = `${SITE_URL}/${l}${canonicalPath}`;
  }
  languages["x-default"] = `${SITE_URL}/${DEFAULT_LOCALE}${canonicalPath}`;
  return languages;
}

/**
 * Resolves an OG locale code in the BCP-47 form Open Graph parsers
 * expect (e.g. `ru_RU`, `uz_UZ`, `en_US`).
 */
function ogLocale(locale: string): string {
  switch (locale) {
    case "ru":
      return "ru_RU";
    case "uz":
      return "uz_UZ";
    case "en":
    default:
      return "en_US";
  }
}

/**
 * Per-locale fallback OG image. Used when the page's translation
 * namespace does not declare its own `og.image`.
 */
function fallbackOgImage(locale: string): string {
  if (locale === "uz") return "/og-home-uz.png";
  if (locale === "en") return "/og-home-en.png";
  return "/og-home-ru.png";
}

/**
 * Site-wide metadata generator. Every indexable page in the app calls
 * this — keeping the canonical / hreflang / OG / Twitter / robots shape
 * consistent across the whole surface.
 *
 * IMPORTANT: pass a non-empty `canonicalPath` (e.g. `/about-us`) for any
 * subpage. Passing `""` makes the canonical resolve to the homepage,
 * which silently breaks SEO for that subpage. The homepage is the only
 * legitimate caller with an empty path.
 */
export async function generatePageMetadata(
  locale: string,
  pageKey: PageKey,
  canonicalPath: string
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: NAMESPACE_MAP[pageKey] });

  const title = t("title");
  const description = t("description");
  const ogImage = t.has("og.image") ? t("og.image") : fallbackOgImage(locale);
  const ogTitle = t.has("og.title") ? t("og.title") : title;
  const ogDescription = t.has("og.description") ? t("og.description") : description;
  const keywords = t.has("keywords")
    ? (t.raw("keywords") as string[] | string | undefined)
    : undefined;

  const canonicalUrl = `${SITE_URL}/${locale}${canonicalPath}`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: buildLanguageAlternates(canonicalPath),
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogTitle }],
      siteName: "Yoldosh",
      locale: ogLocale(locale),
      alternateLocale: LOCALES.filter((l) => l !== locale).map(ogLocale),
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
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
