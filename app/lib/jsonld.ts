/**
 * JSON-LD builders. Functions in this file produce schema.org payloads
 * that are serialized into `<script type="application/ld+json">` tags on
 * every page. Crawlers (Google, Bing, Yandex, ChatGPT, Perplexity) parse
 * the structured data to populate rich results, Knowledge Graph entries,
 * AI Overview citations, and entity authority signals.
 */

type PageType = "WebPage" | "AboutPage" | "SearchResultsPage" | "LegalDocument" | "CollectionPage";

type JsonLdOptions = {
  locale: string;
  path: string;
  type?: PageType;
  name: string;
  description: string;
  /** ISO date string for `dateModified` — improves freshness signals. */
  dateModified?: string;
};

const SITE_URL = "https://yoldosh.uz";
const LOCALES = ["ru", "uz", "en"] as const;

/**
 * Organization schema — the single source of truth for the business
 * entity. Lifted into the root layout so every page in every locale
 * advertises a consistent identity to crawlers. Anchored on a stable
 * `@id` so other schema blocks can reference it without duplication.
 */
export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}#organization`,
    name: "Yoldosh",
    alternateName: ["Yo'ldosh", "Йолдош", "Йўлдош"],
    legalName: "OOO Milliy Yoldosh",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/assets/logo.svg`,
      width: 512,
      height: 512,
    },
    image: `${SITE_URL}/og-home-ru.png`,
    description:
      "Yoldosh — сервис совместных поездок и карпулинга по Узбекистану. Поиск попутчиков на междугородних маршрутах: Ташкент, Самарканд, Бухара, Фергана и другие города.",
    foundingDate: "2025",
    address: {
      "@type": "PostalAddress",
      addressCountry: "UZ",
      addressLocality: "Tashkent",
      addressRegion: "Toshkent shahri",
    },
    areaServed: [
      { "@type": "Country", name: "Uzbekistan" },
      { "@type": "AdministrativeArea", name: "Republic of Karakalpakstan" },
    ],
    knowsLanguage: ["ru", "uz", "en"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@yoldosh.uz",
        telephone: "+998-94-000-12-58",
        availableLanguage: ["Russian", "Uzbek", "English"],
        areaServed: "UZ",
      },
    ],
    sameAs: [
      "https://t.me/yoldosh_uz",
      "https://instagram.com/yoldosh_uz",
      "https://www.facebook.com/people/Yoldosh/61587373291432",
      "https://www.youtube.com/@Yoldosh_uzbekistan",
    ],
  };
}

/**
 * WebSite schema — required for Google to surface a Sitelinks Searchbox
 * in SERP, and for AI search engines to identify the canonical site
 * search endpoint when answering route-shaped queries. The `potentialAction`
 * points at the public `/trips` search interface with the `q` template
 * variable so Google can build a query that resolves to a real result.
 */
export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}#website`,
    name: "Yoldosh",
    alternateName: "Yo'ldosh",
    url: SITE_URL,
    description:
      "Сервис совместных поездок Yoldosh — карпулинг и междугородние поездки по Узбекистану.",
    inLanguage: ["ru", "uz", "en"],
    publisher: { "@id": `${SITE_URL}#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/ru/trips?from={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Page-level schema. Emits both a typed Page (WebPage / AboutPage /
 * CollectionPage / ...) and a matching BreadcrumbList so the SERP can
 * render the page hierarchy. Both blocks reference the Organization
 * publisher and the canonical WebSite via stable `@id` URIs so the
 * crawler can build a connected entity graph rather than treating each
 * schema block in isolation.
 */
export function getPageJsonLd({
  locale,
  path,
  type = "WebPage",
  name,
  description,
  dateModified,
}: JsonLdOptions) {
  const url = `${SITE_URL}/${locale}${path}`;
  const languageAlternates = LOCALES.map((l) => ({
    "@type": "Language",
    name: l,
    alternateName: `${SITE_URL}/${l}${path}`,
  }));

  return {
    page: {
      "@context": "https://schema.org",
      "@type": type,
      "@id": `${url}#webpage`,
      name,
      description,
      url,
      inLanguage: locale,
      isPartOf: { "@id": `${SITE_URL}#website` },
      about: { "@id": `${SITE_URL}#organization` },
      publisher: { "@id": `${SITE_URL}#organization` },
      dateModified: dateModified ?? new Date().toISOString(),
      potentialAction: languageAlternates,
    },

    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: locale === "ru" ? "Главная" : locale === "uz" ? "Bosh sahifa" : "Home",
          item: `${SITE_URL}/${locale}`,
        },
        ...(path
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name,
                item: url,
              },
            ]
          : []),
      ],
    },
  };
}

/**
 * Trip schema builder for the rare cases an indexable, evergreen trip
 * surface needs structured data (e.g. a route landing page that lists
 * a representative offer). The per-trip detail page itself is noindexed
 * because trips expire — this helper is kept for /routes/[slug] usage.
 */
export function generateTripJsonLd(trip: {
  from: string;
  to: string;
  price: number | string;
  currency?: string;
  slug: string;
  departure?: string;
  seatsAvailable?: number;
}, locale: string) {
  const url = `${SITE_URL}/${locale}/routes/${trip.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Trip",
    name: `${trip.from} → ${trip.to}`,
    description: `Поездка с попутчиком ${trip.from} — ${trip.to} на Yoldosh.`,
    departureTime: trip.departure,
    itinerary: [
      { "@type": "City", name: trip.from },
      { "@type": "City", name: trip.to },
    ],
    provider: { "@id": `${SITE_URL}#organization` },
    offers: {
      "@type": "Offer",
      priceCurrency: trip.currency ?? "UZS",
      price: trip.price,
      availability:
        typeof trip.seatsAvailable === "number" && trip.seatsAvailable > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      url,
    },
    url,
  };
}
