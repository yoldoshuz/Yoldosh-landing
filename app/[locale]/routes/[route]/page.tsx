import { Metadata } from "next";
import { redirect } from "next/navigation";
import Script from "next/script";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/shared/widgets/Footer";
import { Button } from "@/components/ui/button";

const ROUTES: Record<
  string,
  {
    fromRu: string;
    toRu: string;
    fromUz: string;
    toUz: string;
    fromEn: string;
    toEn: string;
    fromLat: number;
    fromLon: number;
    toLat: number;
    toLon: number;
    distanceKm: number;
    durationH: number;
  }
> = {
  "tashkent-samarkand": {
    fromRu: "Ташкент",
    toRu: "Самарканд",
    fromUz: "Toshkent",
    toUz: "Samarqand",
    fromEn: "Tashkent",
    toEn: "Samarkand",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 39.6547,
    toLon: 66.9758,
    distanceKm: 325,
    durationH: 4,
  },
  "tashkent-bukhara": {
    fromRu: "Ташкент",
    toRu: "Бухара",
    fromUz: "Toshkent",
    toUz: "Buxoro",
    fromEn: "Tashkent",
    toEn: "Bukhara",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 39.7747,
    toLon: 64.4286,
    distanceKm: 560,
    durationH: 6,
  },
  "tashkent-fergana": {
    fromRu: "Ташкент",
    toRu: "Фергана",
    fromUz: "Toshkent",
    toUz: "Farg'ona",
    fromEn: "Tashkent",
    toEn: "Fergana",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 40.3842,
    toLon: 71.7843,
    distanceKm: 420,
    durationH: 5,
  },
  "tashkent-andijan": {
    fromRu: "Ташкент",
    toRu: "Андижан",
    fromUz: "Toshkent",
    toUz: "Andijon",
    fromEn: "Tashkent",
    toEn: "Andijan",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 40.7821,
    toLon: 72.3442,
    distanceKm: 450,
    durationH: 5,
  },
  "tashkent-namangan": {
    fromRu: "Ташкент",
    toRu: "Наманган",
    fromUz: "Toshkent",
    toUz: "Namangan",
    fromEn: "Tashkent",
    toEn: "Namangan",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 41.0011,
    toLon: 71.6726,
    distanceKm: 400,
    durationH: 4,
  },
  "samarkand-bukhara": {
    fromRu: "Самарканд",
    toRu: "Бухара",
    fromUz: "Samarqand",
    toUz: "Buxoro",
    fromEn: "Samarkand",
    toEn: "Bukhara",
    fromLat: 39.6547,
    fromLon: 66.9758,
    toLat: 39.7747,
    toLon: 64.4286,
    distanceKm: 270,
    durationH: 3,
  },
  "tashkent-khiva": {
    fromRu: "Ташкент",
    toRu: "Хива",
    fromUz: "Toshkent",
    toUz: "Xiva",
    fromEn: "Tashkent",
    toEn: "Khiva",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 41.3775,
    toLon: 60.3594,
    distanceKm: 880,
    durationH: 10,
  },
  "tashkent-nukus": {
    fromRu: "Ташкент",
    toRu: "Нукус",
    fromUz: "Toshkent",
    toUz: "Nukus",
    fromEn: "Tashkent",
    toEn: "Nukus",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 42.453,
    toLon: 59.6103,
    distanceKm: 1100,
    durationH: 12,
  },
};

const tripsPathByLocale: Record<string, string> = { ru: "поездки", uz: "safarlar", en: "trips" };
const siteUrl = "https://yoldosh.uz";

type Props = { params: Promise<{ locale: string; route: string }> };

export async function generateStaticParams() {
  return Object.keys(ROUTES).flatMap((route) => ["ru", "uz", "en"].map((locale) => ({ locale, route })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, route } = await params;
  const r = ROUTES[route];
  if (!r) redirect(`/${locale}`);

  const t = await getTranslations({ locale, namespace: `metadata.routes.${route}` });

  return {
    title: t("title"),
    description: t("description"),
    keywords: t.raw("keywords") as string[],
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}/routes/${route}`,
      languages: {
        ru: `${siteUrl}/ru/routes/${route}`,
        uz: `${siteUrl}/uz/routes/${route}`,
        en: `${siteUrl}/en/routes/${route}`,
        "x-default": `${siteUrl}/ru/routes/${route}`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${siteUrl}/${locale}/routes/${route}`,
      type: "website",
      siteName: "Yoldosh",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function RoutePage({ params }: Props) {
  const { locale, route } = await params;
  const r = ROUTES[route];
  if (!r) redirect(`/${locale}`);

  const t = await getTranslations({ locale, namespace: `metadata.routes.${route}` });

  const fromName = locale === "ru" ? r.fromRu : locale === "uz" ? r.fromUz : r.fromEn;
  const toName = locale === "ru" ? r.toRu : locale === "uz" ? r.toUz : r.toEn;

  const tripsSegment = tripsPathByLocale[locale] ?? "trips";
  const tripsUrl = `/${locale}/${tripsSegment}?from=${encodeURIComponent(fromName)}&to=${encodeURIComponent(toName)}&from_lat=${r.fromLat}&from_lon=${r.fromLon}&to_lat=${r.toLat}&to_lon=${r.toLon}&seats=1`;

  const ctaLabels: Record<string, string> = { ru: "Найти поездки", uz: "Safarlarni qidirish", en: "Find Trips" };
  const distLabels: Record<string, string> = { ru: "Расстояние", uz: "Masofa", en: "Distance" };
  const durLabels: Record<string, string> = { ru: "Время в пути", uz: "Yo'l vaqti", en: "Duration" };
  const kmLabels: Record<string, string> = { ru: "км", uz: "km", en: "km" };
  const hLabels: Record<string, string> = { ru: "ч", uz: "soat", en: "hrs" };
  const faqTitle: Record<string, string> = { ru: "Частые вопросы", uz: "Ko'p so'raladigan savollar", en: "FAQ" };

  const faq = t.has("faq") ? (t.raw("faq") as { q: string; a: string }[]) : [];

  const routeJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `${fromName} → ${toName}`,
    description: t("description"),
    touristType: "Budget travelers",
    itinerary: [
      { "@type": "City", name: fromName },
      { "@type": "City", name: toName },
    ],
    provider: { "@type": "Organization", name: "Yoldosh", url: siteUrl },
  };

  const faqJsonLd =
    faq.length > 0
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

  return (
    <>
      <Script
        id="route-jsonld"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(routeJsonLd) }}
      />
      {faqJsonLd && (
        <Script
          id="faq-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <article className="flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-12 gap-8 min-h-[80vh]">
        {/* Hero card */}
        <div className="w-full bg-emerald-500 rounded-3xl shadow-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-3">{t("h1")}</h1>
          <p className="text-white/90 text-lg mb-6">{t("intro")}</p>
          <div className="flex gap-6 mb-6 text-sm">
            <div>
              <span className="text-white/70">{distLabels[locale]}: </span>
              <strong>
                ~{r.distanceKm} {kmLabels[locale]}
              </strong>
            </div>
            <div>
              <span className="text-white/70">{durLabels[locale]}: </span>
              <strong>
                ~{r.durationH} {hLabels[locale]}
              </strong>
            </div>
          </div>
          <a href={tripsUrl}>
            <Button className="bg-white text-emerald-600 hover:bg-neutral-100 font-bold rounded-full px-8">
              {ctaLabels[locale]}
            </Button>
          </a>
        </div>

        {/* FAQ section — renders only if faq array is non-empty */}
        {faq.length > 0 && (
          <section className="w-full bg-white rounded-2xl shadow p-8">
            <h2 className="text-xl font-bold mb-4 text-neutral-800">{faqTitle[locale]}</h2>
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
