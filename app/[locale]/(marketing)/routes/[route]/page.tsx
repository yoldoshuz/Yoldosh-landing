import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getDisplayName } from "@/app/lib/cities";
import {
  listPopularRouteSlugs,
  ResolvedRoute,
  resolveRoute,
  resolveRouteWithLiveStats,
} from "@/app/lib/route-resolver";
import { Footer } from "@/components/shared/widgets/Footer";
import { Button } from "@/components/ui/button";

const SITE_URL = "https://yoldosh.uz";
const LOCALES = ["ru", "uz", "en"] as const;
type AppLocale = (typeof LOCALES)[number];

// Page is revalidated hourly so live trip data and route stats refresh
// without manual deploys. dynamicParams = true means city pairs outside the
// pre-rendered popular set still render on demand (no 404 for long tail).
export const revalidate = 3600;
export const dynamicParams = true;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yoldosh.uz/api/v1";

type Props = { params: Promise<{ locale: string; route: string }> };

interface LiveTrip {
  id: string;
  departure_ts: string;
  price_per_person: string | number;
  seats_available: number;
  duration?: number; // minutes
  distance?: number; // km, often 0 from API
  driver?: { firstName?: string; rating?: number };
  car?: { make?: string; model?: string };
  from_location?: { city?: string };
  to_location?: { city?: string };
}

/**
 * Fetches a few upcoming trips for this city pair and derives:
 *   - liveTrips (rendered as ItemList JSON-LD + visible mini list)
 *   - avgDurationH (replaces estimated duration when available)
 *   - avgDistanceKm (replaces haversine fallback when API has real values)
 */
async function fetchLiveStats(route: ResolvedRoute): Promise<{
  trips: LiveTrip[];
  avgDurationH?: number;
  avgDistanceKm?: number;
}> {
  try {
    const params = new URLSearchParams({
      from_lat: String(route.fromCity.lat),
      from_lon: String(route.fromCity.lon),
      to_lat: String(route.toCity.lat),
      to_lon: String(route.toCity.lon),
      seats: "1",
      page: "1",
      limit: "10",
    });
    const res = await fetch(`${API_BASE}/public/trips/popular?${params.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { trips: [] };
    const json = await res.json();
    const trips: LiveTrip[] = (json?.data?.trips ?? []).slice(0, 10);

    // Aggregate non-zero stats — API often returns distance: 0 even for real trips.
    const validDurations = trips.map((t) => (typeof t.duration === "number" ? t.duration : 0)).filter((m) => m > 0);
    const validDistances = trips.map((t) => (typeof t.distance === "number" ? t.distance : 0)).filter((k) => k > 0);

    const avgDurationMin = validDurations.length
      ? validDurations.reduce((a, b) => a + b, 0) / validDurations.length
      : undefined;
    const avgDistanceKm = validDistances.length
      ? validDistances.reduce((a, b) => a + b, 0) / validDistances.length
      : undefined;

    return {
      trips: trips.slice(0, 5),
      avgDurationH: avgDurationMin ? avgDurationMin / 60 : undefined,
      avgDistanceKm,
    };
  } catch {
    return { trips: [] };
  }
}

export async function generateStaticParams() {
  const popularSlugs = listPopularRouteSlugs();
  return popularSlugs.flatMap((route) => LOCALES.map((locale) => ({ locale, route })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, route } = await params;
  const resolved = await resolveRoute(route);

  if (!resolved) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }

  if (!resolved.isCanonical) {
    return { robots: { index: false, follow: true } };
  }

  const l = (LOCALES.includes(locale as AppLocale) ? locale : "ru") as AppLocale;
  const fromName = getDisplayName(resolved.fromCity, l);
  const toName = getDisplayName(resolved.toCity, l);
  const { distanceKm, durationH, canonicalSlug } = resolved;

  const titles: Record<AppLocale, string> = {
    ru: `${fromName} ${toName} попутчики: цена, расписание, BlaBlaCar Узбекистан | Yo'ldosh`,
    uz: `${fromName} ${toName} yo'ldoshlar: narx, jadval, BlaBlaCar O'zbekiston | Yo'ldosh`,
    en: `${fromName} ${toName} carpool: rideshare, price, schedule | Yo'ldosh`,
  };
  const descriptions: Record<AppLocale, string> = {
    ru: `Поездка ${fromName} — ${toName} с попутчиком от ${fromName} до ${toName}. Расстояние ~${distanceKm} км, ~${durationH} ч в пути. Проверенные водители, цены ниже такси. Карпулинг Узбекистан на Yo'ldosh.`,
    uz: `${fromName}dan ${toName}ga yo'ldosh bilan safar. ${fromName} ${toName} masofa ~${distanceKm} km, ~${durationH} soat. Tekshirilgan haydovchilar, narxlar taksidan arzon. Yo'ldoshda karpuling.`,
    en: `Travel ${fromName} ${toName} with a verified driver. Distance ~${distanceKm} km, ~${durationH} hrs en route. Daily shared rides between ${fromName} and ${toName}. Affordable carpool on Yo'ldosh.`,
  };
  const keywords: Record<AppLocale, string[]> = {
    ru: [
      `${fromName} ${toName}`,
      `${fromName} ${toName} попутчик`,
      `${fromName} ${toName} попутчики`,
      `${fromName} ${toName} карпулинг`,
      `${fromName} ${toName} поездка`,
      `${fromName} ${toName} такси`,
      `${fromName} ${toName} цена`,
      `${fromName} ${toName} расстояние`,
      `попутчик из ${fromName} в ${toName}`,
      `BlaBlaCar ${fromName} ${toName}`,
    ],
    uz: [
      `${fromName} ${toName}`,
      `${fromName} ${toName} yo'ldosh`,
      `${fromName} ${toName} taksi`,
      `${fromName} ${toName} narx`,
      `${fromName} ${toName} masofa`,
      `${fromName}dan ${toName}ga safar`,
      `BlaBlaCar ${fromName} ${toName}`,
    ],
    en: [
      `${fromName} ${toName}`,
      `${fromName} to ${toName}`,
      `${fromName} ${toName} carpool`,
      `${fromName} ${toName} rideshare`,
      `${fromName} ${toName} price`,
      `${fromName} ${toName} distance`,
      `BlaBlaCar ${fromName} ${toName}`,
    ],
  };

  const languages: Record<string, string> = {};
  for (const lc of LOCALES) {
    languages[lc] = `${SITE_URL}/${lc}/routes/${canonicalSlug}`;
  }
  languages["x-default"] = `${SITE_URL}/ru/routes/${canonicalSlug}`;

  return {
    title: titles[l],
    description: descriptions[l],
    keywords: keywords[l],
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: `${SITE_URL}/${l}/routes/${canonicalSlug}`,
      languages,
    },
    openGraph: {
      title: titles[l],
      description: descriptions[l],
      url: `${SITE_URL}/${l}/routes/${canonicalSlug}`,
      type: "website",
      siteName: "Yoldosh",
      // Open Graph expects BCP-47 form (ru_RU, uz_UZ, en_US) — raw
      // 2-letter codes are silently dropped by Facebook's parser.
      locale: l === "ru" ? "ru_RU" : l === "uz" ? "uz_UZ" : "en_US",
      alternateLocale: LOCALES.filter((x) => x !== l).map((x) =>
        x === "ru" ? "ru_RU" : x === "uz" ? "uz_UZ" : "en_US"
      ),
      images: [
        {
          url: `${SITE_URL}/og-trips-${l}.png`,
          width: 1200,
          height: 630,
          alt: titles[l],
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: titles[l],
      description: descriptions[l],
      images: [`${SITE_URL}/og-trips-${l}.png`],
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

export default async function RoutePage({ params }: Props) {
  const { locale, route } = await params;
  const baseResolved = await resolveRoute(route);

  if (!baseResolved) {
    notFound();
  }

  if (!baseResolved.isCanonical) {
    permanentRedirect(`/${locale}/routes/${baseResolved.canonicalSlug}`);
  }

  // Sample live trips, then re-resolve with averaged stats so distance and
  // duration reflect what real drivers report rather than haversine guesses.
  const liveStats = await fetchLiveStats(baseResolved);
  const resolved =
    (await resolveRouteWithLiveStats(route, {
      distanceKm: liveStats.avgDistanceKm,
      durationH: liveStats.avgDurationH,
    })) ?? baseResolved;
  const liveTrips = liveStats.trips;

  const safeLocale: AppLocale = LOCALES.includes(locale as AppLocale) ? (locale as AppLocale) : "ru";

  const fromName = getDisplayName(resolved.fromCity, safeLocale);
  const toName = getDisplayName(resolved.toCity, safeLocale);
  const { distanceKm, durationH, canonicalSlug } = resolved;

  const t = await getTranslations({
    locale: safeLocale,
    namespace: `metadata.routes.${canonicalSlug}`,
  }).catch(() => null);

  const tripsSearchUrl =
    `/${safeLocale}/trips` +
    `?from=${encodeURIComponent(fromName)}&to=${encodeURIComponent(toName)}` +
    `&from_lat=${resolved.fromCity.lat}&from_lon=${resolved.fromCity.lon}` +
    `&to_lat=${resolved.toCity.lat}&to_lon=${resolved.toCity.lon}&seats=1`;

  const labels = {
    cta: { ru: "Найти поездки", uz: "Safarlarni qidirish", en: "Find Trips" },
    dist: { ru: "Расстояние", uz: "Masofa", en: "Distance" },
    dur: { ru: "Время в пути", uz: "Yo'l vaqti", en: "Duration" },
    km: { ru: "км", uz: "km", en: "km" },
    h: { ru: "ч", uz: "soat", en: "hrs" },
    faqT: { ru: "Частые вопросы", uz: "Ko'p so'raladigan savollar", en: "FAQ" },
    upcomingT: {
      ru: `Ближайшие поездки ${fromName} — ${toName}`,
      uz: `${fromName} — ${toName} eng yaqin safarlar`,
      en: `Upcoming rides ${fromName} — ${toName}`,
    },
    seatsLabel: { ru: "мест", uz: "joy", en: "seats" },
    departsLabel: { ru: "Отправление", uz: "Jo'nash", en: "Departs" },
    bookCta: { ru: "Забронировать", uz: "Bron qilish", en: "Book" },
    h1: {
      ru: `${fromName} ${toName}: поездки с попутчиком`,
      uz: `${fromName} ${toName}: yo'ldosh bilan safarlar`,
      en: `${fromName} ${toName}: shared rides`,
    },
    intro: {
      ru: `Поездка ${fromName} ${toName} с проверенными водителями. Расстояние около ${distanceKm} км, в дороге примерно ${durationH} ч. На Yoldosh ежедневно публикуются попутные машины из ${fromName} в ${toName} — дешевле такси, удобнее автобуса. Цены формируют сами водители, оплата только за свободное место.`,
      uz: `${fromName} ${toName} yo'nalishida tekshirilgan haydovchilar bilan safar. Masofa taxminan ${distanceKm} km, yo'lda ${durationH} soat. Yo'ldoshda har kuni ${fromName}dan ${toName}ga yo'ldosh mashinalar e'lon qilinadi — taksidan arzon, avtobusdan qulay.`,
      en: `Shared rides from ${fromName} to ${toName} with verified drivers. The distance is around ${distanceKm} km and the trip takes roughly ${durationH} hours. Yoldosh lists daily ${fromName} ${toName} carpools — cheaper than a taxi, more flexible than the bus.`,
    },
  };

  const h1 = t?.has("h1") ? t("h1") : labels.h1[safeLocale];
  const intro = t?.has("intro") ? t("intro") : labels.intro[safeLocale];
  const faq: { q: string; a: string }[] = t?.has("faq")
    ? (t.raw("faq") as { q: string; a: string }[])
    : defaultFaq(fromName, toName, distanceKm, durationH, safeLocale);

  const pageUrl = `${SITE_URL}/${safeLocale}/routes/${canonicalSlug}`;

  // TouristTrip describes the journey itself; we wrap it with a Service
  // node so Google can also surface the offering as a "carpooling service
  // between cityA and cityB" in AI Overviews and Knowledge Graph cards.
  // Both nodes reference the central Organization via stable `@id`.
  const tripJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristTrip",
        "@id": `${pageUrl}#trip`,
        name: `${fromName} → ${toName}`,
        description: intro,
        touristType: ["Budget travelers", "Commuters", "Carpoolers"],
        itinerary: [
          {
            "@type": "City",
            name: fromName,
            geo: {
              "@type": "GeoCoordinates",
              latitude: resolved.fromCity.lat,
              longitude: resolved.fromCity.lon,
            },
          },
          {
            "@type": "City",
            name: toName,
            geo: {
              "@type": "GeoCoordinates",
              latitude: resolved.toCity.lat,
              longitude: resolved.toCity.lon,
            },
          },
        ],
        provider: { "@id": `${SITE_URL}#organization` },
        url: pageUrl,
        inLanguage: safeLocale,
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#service`,
        name: `Carpooling ${fromName} ${toName}`,
        serviceType: "Carpooling",
        provider: { "@id": `${SITE_URL}#organization` },
        areaServed: [
          { "@type": "City", name: fromName },
          { "@type": "City", name: toName },
        ],
        description: intro,
        url: pageUrl,
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "UZS",
          availability: "https://schema.org/InStock",
          offerCount: liveTrips.length || undefined,
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: safeLocale === "ru" ? "Главная" : safeLocale === "uz" ? "Bosh sahifa" : "Home",
        item: `${SITE_URL}/${safeLocale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: safeLocale === "ru" ? "Маршруты" : safeLocale === "uz" ? "Yo'nalishlar" : "Routes",
        item: `${SITE_URL}/${safeLocale}/routes`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${fromName} → ${toName}`,
        item: `${SITE_URL}/${safeLocale}/routes/${canonicalSlug}`,
      },
    ],
  };

  const faqJsonLd = faq.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      }
    : null;

  const itemListJsonLd =
    liveTrips.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: liveTrips.map((trip, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            item: {
              "@type": "Trip",
              name: `${fromName} → ${toName}`,
              departureTime: trip.departure_ts,
              offers: {
                "@type": "Offer",
                price: trip.price_per_person,
                priceCurrency: "UZS",
                availability: "https://schema.org/InStock",
                url: `${SITE_URL}/${safeLocale}/trips/${trip.id}`,
              },
              provider: {
                "@type": "Organization",
                name: trip.driver?.firstName ?? "Yo'ldosh driver",
              },
            },
          })),
        }
      : null;

  return (
    <>
      {/*
        JSON-LD blocks are inlined as plain `<script type="application/ld+json">`
        — they ship with the server-rendered HTML so crawlers parse them on
        first byte, without the client-side scheduling overhead of `<Script>`
        (which `beforeInteractive` would only honor in the root layout).
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tripJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}

      <article className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-12 gap-8 min-h-[80vh]">
        <div className="w-full bg-emerald-500 rounded-3xl shadow-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-3">{h1}</h1>
          <p className="text-white/90 text-lg mb-6">{intro}</p>
          <div className="flex gap-6 mb-6 text-sm">
            <div>
              <span className="text-white/70">{labels.dist[safeLocale]}: </span>
              <strong>
                ~{distanceKm} {labels.km[safeLocale]}
              </strong>
            </div>
            <div>
              <span className="text-white/70">{labels.dur[safeLocale]}: </span>
              <strong>
                ~{durationH} {labels.h[safeLocale]}
              </strong>
            </div>
          </div>
          <a href={tripsSearchUrl}>
            <Button className="bg-white text-emerald-600 hover:bg-neutral-100 font-bold rounded-full px-8">
              {labels.cta[safeLocale]}
            </Button>
          </a>
        </div>

        {liveTrips.length > 0 && (
          <section className="w-full bg-white rounded-2xl shadow p-8">
            <h2 className="text-xl font-bold mb-4 text-neutral-800">{labels.upcomingT[safeLocale]}</h2>
            <ul className="space-y-3">
              {liveTrips.map((trip) => {
                const dep = new Date(trip.departure_ts);
                const depStr = isNaN(dep.getTime())
                  ? trip.departure_ts
                  : dep.toLocaleString(safeLocale === "ru" ? "ru-RU" : safeLocale === "uz" ? "uz-UZ" : "en-US", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                return (
                  <li
                    key={trip.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3 last:border-b-0"
                  >
                    <div className="text-sm text-neutral-700">
                      <div className="font-medium">
                        {trip.from_location?.city || fromName} → {trip.to_location?.city || toName}
                      </div>
                      <div className="text-neutral-500">
                        {labels.departsLabel[safeLocale]}: {depStr} · {trip.seats_available}{" "}
                        {labels.seatsLabel[safeLocale]}
                      </div>
                    </div>
                    <a
                      href={`/${safeLocale}/trips/${trip.id}`}
                      className="text-emerald-600 font-semibold text-sm hover:underline"
                    >
                      {labels.bookCta[safeLocale]}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {faq.length > 0 && (
          <section className="w-full bg-white rounded-2xl shadow p-8">
            <h2 className="text-xl font-bold mb-4 text-neutral-800">{labels.faqT[safeLocale]}</h2>
            <div className="space-y-4">
              {faq.map(({ q, a }, i) => (
                <div key={i}>
                  <p className="font-semibold text-neutral-800">{q}</p>
                  <p className="text-muted-foreground text-sm mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
      <Footer />
    </>
  );
}

function defaultFaq(
  fromName: string,
  toName: string,
  distanceKm: number,
  durationH: number,
  locale: AppLocale
): { q: string; a: string }[] {
  if (locale === "uz") {
    return [
      {
        q: `${fromName}dan ${toName}ga qancha vaqt yo'lda bo'lasiz?`,
        a: `O'rtacha ${durationH} soat. Masofa taxminan ${distanceKm} km.`,
      },
      {
        q: `${fromName} ${toName} yo'ldosh narxi qancha?`,
        a: `Narxni haydovchining o'zi belgilaydi. Yo'ldoshda taksidan 30-50% arzon takliflarni topishingiz mumkin.`,
      },
      {
        q: `${fromName} ${toName} yo'nalishida har kuni safarlar bormi?`,
        a: `Ha, Yo'ldoshda bu yo'nalishda har kuni o'nlab takliflar e'lon qilinadi.`,
      },
    ];
  }
  if (locale === "en") {
    return [
      {
        q: `How long does the ${fromName} ${toName} trip take?`,
        a: `On average ${durationH} hours. The distance is around ${distanceKm} km.`,
      },
      {
        q: `How much does a ${fromName} to ${toName} carpool cost?`,
        a: `Drivers set their own price. On Yoldosh you'll find rides 30-50% cheaper than a private taxi.`,
      },
      {
        q: `Are there daily rides between ${fromName} and ${toName}?`,
        a: `Yes — Yoldosh lists dozens of new ${fromName} ${toName} trips every day.`,
      },
    ];
  }
  return [
    {
      q: `Сколько ехать ${fromName} ${toName}?`,
      a: `В среднем ${durationH} часов. Расстояние около ${distanceKm} км.`,
    },
    {
      q: `Сколько стоит поездка ${fromName} — ${toName}?`,
      a: `Цену устанавливает сам водитель. На Yoldosh обычно можно найти попутку на 30-50% дешевле такси.`,
    },
    {
      q: `Есть ли ежедневные поездки ${fromName} — ${toName}?`,
      a: `Да, на Yoldosh в этом направлении каждый день публикуются десятки предложений.`,
    },
  ];
}
