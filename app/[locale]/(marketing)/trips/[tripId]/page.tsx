import { cache } from "react";
import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

import { getDisplayName } from "@/app/lib/cities";
import { buildRouteSlug, resolveCity } from "@/app/lib/route-resolver";
import { TripDetailsPage } from "@/components/pages/trips/TripDetails";

const SITE_URL = "https://yoldosh.uz";
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.yoldosh.uz/api/v1";
const LOCALES = ["ru", "uz", "en"] as const;
type AppLocale = (typeof LOCALES)[number];

type Props = { params: Promise<{ locale: string; tripId: string }> };

/**
 * Trip pages stay indexable for their whole life, including after departure:
 * a finished trip renders with a "trip already happened" banner and links to
 * the evergreen `/routes/{slug}` page plus a prefilled search, so the URL
 * keeps returning useful 200 content instead of turning into a 404.
 * Only a trip the API no longer knows at all is 308-redirected to `/trips`.
 */
const getTrip = cache(async (tripId: string) => {
  try {
    const res = await fetch(`${API_BASE}/public/trips/details/${encodeURIComponent(tripId)}`, {
      next: { revalidate: 3600 },
    });
    if (res.status === 404 || res.status === 400) return { notFound: true as const };
    if (!res.ok) return { notFound: false as const, data: null };
    const json = await res.json();
    if (!json?.data?.trip) return { notFound: true as const };
    return { notFound: false as const, data: json };
  } catch {
    // Network / 5xx: let the client retry instead of redirecting a live trip.
    return { notFound: false as const, data: null };
  }
});

async function resolveTripRoute(trip: any, locale: AppLocale) {
  const fromName: string | undefined = trip?.from_location?.city;
  const toName: string | undefined = trip?.to_location?.city;
  if (!fromName || !toName) return null;
  const [from, to] = await Promise.all([resolveCity(fromName), resolveCity(toName)]);
  if (!from || !to || from.key === to.key) {
    return { fromName, toName, slug: null };
  }
  return {
    fromName: getDisplayName(from, locale),
    toName: getDisplayName(to, locale),
    slug: buildRouteSlug(from, to),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, tripId } = await params;
  const l: AppLocale = LOCALES.includes(locale as AppLocale) ? (locale as AppLocale) : "ru";
  const result = await getTrip(tripId);
  const trip = result.notFound ? null : result.data?.data?.trip;

  const languages: Record<string, string> = {};
  for (const lc of LOCALES) languages[lc] = `${SITE_URL}/${lc}/trips/${tripId}`;
  languages["x-default"] = `${SITE_URL}/ru/trips/${tripId}`;

  const route = trip ? await resolveTripRoute(trip, l) : null;
  if (!trip || !route) {
    return {
      title: "Trip details — Yoldosh",
      alternates: { canonical: `${SITE_URL}/${l}/trips/${tripId}`, languages },
    };
  }

  const dep = new Date(trip.departure_ts);
  const dateStr = isNaN(dep.getTime())
    ? ""
    : dep.toLocaleDateString(l === "ru" ? "ru-RU" : l === "uz" ? "uz-UZ" : "en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Tashkent",
      });
  const { fromName, toName } = route;

  const titles: Record<AppLocale, string> = {
    ru: `Поездка ${fromName} — ${toName}${dateStr ? `, ${dateStr}` : ""} | Yo'ldosh`,
    uz: `${fromName} — ${toName} safari${dateStr ? `, ${dateStr}` : ""} | Yo'ldosh`,
    en: `Ride ${fromName} — ${toName}${dateStr ? `, ${dateStr}` : ""} | Yo'ldosh`,
  };
  const descriptions: Record<AppLocale, string> = {
    ru: `Попутка ${fromName} — ${toName} на Yo'ldosh: водитель, автомобиль, цена и условия поездки. Найдите похожие поездки по этому направлению.`,
    uz: `Yo'ldoshda ${fromName} — ${toName} safari: haydovchi, avtomobil, narx va shartlar. Bu yo'nalishdagi o'xshash safarlarni toping.`,
    en: `Carpool ${fromName} — ${toName} on Yo'ldosh: driver, car, price and trip details. Find similar rides on this route.`,
  };

  return {
    title: titles[l],
    description: descriptions[l],
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: `${SITE_URL}/${l}/trips/${tripId}`, languages },
    openGraph: {
      title: titles[l],
      description: descriptions[l],
      url: `${SITE_URL}/${l}/trips/${tripId}`,
      type: "website",
      siteName: "Yoldosh",
      images: [{ url: `${SITE_URL}/og-trips-${l}.png`, width: 1200, height: 630, alt: titles[l] }],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

const Page = async ({ params }: Props) => {
  const { locale, tripId } = await params;
  const l: AppLocale = LOCALES.includes(locale as AppLocale) ? (locale as AppLocale) : "ru";
  const result = await getTrip(tripId);

  if (result.notFound) {
    permanentRedirect(`/${l}/trips`);
  }

  const trip = result.data?.data?.trip;
  const route = trip ? await resolveTripRoute(trip, l) : null;

  return <TripDetailsPage tripId={tripId} initialData={result.data ?? undefined} route={route} />;
};

export default Page;
