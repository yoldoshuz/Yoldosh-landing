import Script from "next/script";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { Footer } from "@/components/shared/widgets/Footer";
import { Button } from "@/components/ui/button";

type RouteData = {
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
};

/** Mirror a route (B→A from A→B) */
const mirror = (r: RouteData): RouteData => ({
  fromRu: r.toRu,
  toRu: r.fromRu,
  fromUz: r.toUz,
  toUz: r.fromUz,
  fromEn: r.toEn,
  toEn: r.fromEn,
  fromLat: r.toLat,
  fromLon: r.toLon,
  toLat: r.fromLat,
  toLon: r.fromLon,
  distanceKm: r.distanceKm,
  durationH: r.durationH,
});

const slug = (a: string, b: string) =>
  `${a.toLowerCase().replace(/\s+/g, "-")}-${b.toLowerCase().replace(/\s+/g, "-")}`;

const BASE: Record<string, RouteData> = {
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
  "tashkent-termez": {
    fromRu: "Ташкент",
    toRu: "Термез",
    fromUz: "Toshkent",
    toUz: "Termiz",
    fromEn: "Tashkent",
    toEn: "Termez",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 37.2242,
    toLon: 67.2783,
    distanceKm: 650,
    durationH: 8,
  },
  "tashkent-navoi": {
    fromRu: "Ташкент",
    toRu: "Навои",
    fromUz: "Toshkent",
    toUz: "Navoiy",
    fromEn: "Tashkent",
    toEn: "Navoi",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 40.0843,
    toLon: 65.3791,
    distanceKm: 500,
    durationH: 6,
  },
  "tashkent-urgench": {
    fromRu: "Ташкент",
    toRu: "Ургенч",
    fromUz: "Toshkent",
    toUz: "Urganch",
    fromEn: "Tashkent",
    toEn: "Urgench",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 41.5503,
    toLon: 60.6347,
    distanceKm: 900,
    durationH: 11,
  },
  "tashkent-karshi": {
    fromRu: "Ташкент",
    toRu: "Карши",
    fromUz: "Toshkent",
    toUz: "Qarshi",
    fromEn: "Tashkent",
    toEn: "Karshi",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 38.8608,
    toLon: 65.7903,
    distanceKm: 520,
    durationH: 6,
  },
  "tashkent-jizzakh": {
    fromRu: "Ташкент",
    toRu: "Джизак",
    fromUz: "Toshkent",
    toUz: "Jizzax",
    fromEn: "Tashkent",
    toEn: "Jizzakh",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 40.1158,
    toLon: 67.8422,
    distanceKm: 200,
    durationH: 2,
  },
  "tashkent-gulistan": {
    fromRu: "Ташкент",
    toRu: "Гулистан",
    fromUz: "Toshkent",
    toUz: "Guliston",
    fromEn: "Tashkent",
    toEn: "Gulistan",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 40.4897,
    toLon: 68.7842,
    distanceKm: 140,
    durationH: 2,
  },
  "tashkent-kokand": {
    fromRu: "Ташкент",
    toRu: "Коканд",
    fromUz: "Toshkent",
    toUz: "Qo'qon",
    fromEn: "Tashkent",
    toEn: "Kokand",
    fromLat: 41.2995,
    fromLon: 69.2401,
    toLat: 40.5283,
    toLon: 70.9425,
    distanceKm: 330,
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
  "samarkand-navoi": {
    fromRu: "Самарканд",
    toRu: "Навои",
    fromUz: "Samarqand",
    toUz: "Navoiy",
    fromEn: "Samarkand",
    toEn: "Navoi",
    fromLat: 39.6547,
    fromLon: 66.9758,
    toLat: 40.0843,
    toLon: 65.3791,
    distanceKm: 130,
    durationH: 2,
  },
  "samarkand-karshi": {
    fromRu: "Самарканд",
    toRu: "Карши",
    fromUz: "Samarqand",
    toUz: "Qarshi",
    fromEn: "Samarkand",
    toEn: "Karshi",
    fromLat: 39.6547,
    fromLon: 66.9758,
    toLat: 38.8608,
    toLon: 65.7903,
    distanceKm: 220,
    durationH: 3,
  },
  "samarkand-termez": {
    fromRu: "Самарканд",
    toRu: "Термез",
    fromUz: "Samarqand",
    toUz: "Termiz",
    fromEn: "Samarkand",
    toEn: "Termez",
    fromLat: 39.6547,
    fromLon: 66.9758,
    toLat: 37.2242,
    toLon: 67.2783,
    distanceKm: 380,
    durationH: 5,
  },
  "samarkand-fergana": {
    fromRu: "Самарканд",
    toRu: "Фергана",
    fromUz: "Samarqand",
    toUz: "Farg'ona",
    fromEn: "Samarkand",
    toEn: "Fergana",
    fromLat: 39.6547,
    fromLon: 66.9758,
    toLat: 40.3842,
    toLon: 71.7843,
    distanceKm: 470,
    durationH: 6,
  },
  "bukhara-khiva": {
    fromRu: "Бухара",
    toRu: "Хива",
    fromUz: "Buxoro",
    toUz: "Xiva",
    fromEn: "Bukhara",
    toEn: "Khiva",
    fromLat: 39.7747,
    fromLon: 64.4286,
    toLat: 41.3775,
    toLon: 60.3594,
    distanceKm: 390,
    durationH: 5,
  },
  "bukhara-urgench": {
    fromRu: "Бухара",
    toRu: "Ургенч",
    fromUz: "Buxoro",
    toUz: "Urganch",
    fromEn: "Bukhara",
    toEn: "Urgench",
    fromLat: 39.7747,
    fromLon: 64.4286,
    toLat: 41.5503,
    toLon: 60.6347,
    distanceKm: 400,
    durationH: 5,
  },
  "bukhara-nukus": {
    fromRu: "Бухара",
    toRu: "Нукус",
    fromUz: "Buxoro",
    toUz: "Nukus",
    fromEn: "Bukhara",
    toEn: "Nukus",
    fromLat: 39.7747,
    fromLon: 64.4286,
    toLat: 42.453,
    toLon: 59.6103,
    distanceKm: 540,
    durationH: 7,
  },
  "bukhara-karshi": {
    fromRu: "Бухара",
    toRu: "Карши",
    fromUz: "Buxoro",
    toUz: "Qarshi",
    fromEn: "Bukhara",
    toEn: "Karshi",
    fromLat: 39.7747,
    fromLon: 64.4286,
    toLat: 38.8608,
    toLon: 65.7903,
    distanceKm: 260,
    durationH: 3,
  },
  "fergana-andijan": {
    fromRu: "Фергана",
    toRu: "Андижан",
    fromUz: "Farg'ona",
    toUz: "Andijon",
    fromEn: "Fergana",
    toEn: "Andijan",
    fromLat: 40.3842,
    fromLon: 71.7843,
    toLat: 40.7821,
    toLon: 72.3442,
    distanceKm: 80,
    durationH: 1,
  },
  "fergana-namangan": {
    fromRu: "Фергана",
    toRu: "Наманган",
    fromUz: "Farg'ona",
    toUz: "Namangan",
    fromEn: "Fergana",
    toEn: "Namangan",
    fromLat: 40.3842,
    fromLon: 71.7843,
    toLat: 41.0011,
    toLon: 71.6726,
    distanceKm: 110,
    durationH: 2,
  },
  "fergana-kokand": {
    fromRu: "Фергана",
    toRu: "Коканд",
    fromUz: "Farg'ona",
    toUz: "Qo'qon",
    fromEn: "Fergana",
    toEn: "Kokand",
    fromLat: 40.3842,
    fromLon: 71.7843,
    toLat: 40.5283,
    toLon: 70.9425,
    distanceKm: 70,
    durationH: 1,
  },
  "andijan-namangan": {
    fromRu: "Андижан",
    toRu: "Наманган",
    fromUz: "Andijon",
    toUz: "Namangan",
    fromEn: "Andijan",
    toEn: "Namangan",
    fromLat: 40.7821,
    fromLon: 72.3442,
    toLat: 41.0011,
    toLon: 71.6726,
    distanceKm: 100,
    durationH: 1,
  },
  "khiva-urgench": {
    fromRu: "Хива",
    toRu: "Ургенч",
    fromUz: "Xiva",
    toUz: "Urganch",
    fromEn: "Khiva",
    toEn: "Urgench",
    fromLat: 41.3775,
    fromLon: 60.3594,
    toLat: 41.5503,
    toLon: 60.6347,
    distanceKm: 35,
    durationH: 1,
  },
  "urgench-nukus": {
    fromRu: "Ургенч",
    toRu: "Нукус",
    fromUz: "Urganch",
    toUz: "Nukus",
    fromEn: "Urgench",
    toEn: "Nukus",
    fromLat: 41.5503,
    fromLon: 60.6347,
    toLat: 42.453,
    toLon: 59.6103,
    distanceKm: 160,
    durationH: 2,
  },
  "navoi-bukhara": {
    fromRu: "Навои",
    toRu: "Бухара",
    fromUz: "Navoiy",
    toUz: "Buxoro",
    fromEn: "Navoi",
    toEn: "Bukhara",
    fromLat: 40.0843,
    fromLon: 65.3791,
    toLat: 39.7747,
    toLon: 64.4286,
    distanceKm: 130,
    durationH: 2,
  },
  "karshi-termez": {
    fromRu: "Карши",
    toRu: "Термез",
    fromUz: "Qarshi",
    toUz: "Termiz",
    fromEn: "Karshi",
    toEn: "Termez",
    fromLat: 38.8608,
    fromLon: 65.7903,
    toLat: 37.2242,
    toLon: 67.2783,
    distanceKm: 260,
    durationH: 3,
  },
  "namangan-fergana": {
    fromRu: "Наманган",
    toRu: "Фергана",
    fromUz: "Namangan",
    toUz: "Farg'ona",
    fromEn: "Namangan",
    toEn: "Fergana",
    fromLat: 41.0011,
    fromLon: 71.6726,
    toLat: 40.3842,
    toLon: 71.7843,
    distanceKm: 110,
    durationH: 2,
  },
  "namangan-bukhara": {
    fromRu: "Наманган",
    toRu: "Бухара",
    fromUz: "Namangan",
    toUz: "Buxoro",
    fromEn: "Namangan",
    toEn: "Bukhara",
    fromLat: 41.0011,
    fromLon: 71.6726,
    toLat: 39.7747,
    toLon: 64.4286,
    distanceKm: 620,
    durationH: 8,
  },
  "urgench-fergana": {
    fromRu: "Ургенч",
    toRu: "Фергана",
    fromUz: "Urganch",
    toUz: "Farg'ona",
    fromEn: "Urgench",
    toEn: "Fergana",
    fromLat: 41.5503,
    fromLon: 60.6347,
    toLat: 40.3842,
    toLon: 71.7843,
    distanceKm: 980,
    durationH: 12,
  },
};

const ROUTES: Record<string, RouteData> = { ...BASE };

Object.entries(BASE).forEach(([key, data]) => {
  const [a, b] = key.split(/-(.+)/);
  const mirrorKey = slug(data.toEn, data.fromEn);
  if (!ROUTES[mirrorKey]) {
    ROUTES[mirrorKey] = mirror(data);
  }
});

const LOCALES = ["ru", "uz", "en"];
const siteUrl = "https://yoldosh.uz";

const tripsPathByLocale: Record<string, string> = {
  ru: "поездки",
  uz: "safarlar",
  en: "trips",
};

type Props = { params: Promise<{ locale: string; route: string }> };

export async function generateStaticParams() {
  return Object.keys(ROUTES).flatMap((route) => LOCALES.map((locale) => ({ locale, route })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, route } = await params;
  const r = ROUTES[route];

  // Return 404 metadata instead of redirecting
  if (!r) {
    return { title: "Not Found", robots: { index: false } };
  }

  const fromName = locale === "ru" ? r.fromRu : locale === "uz" ? r.fromUz : r.fromEn;
  const toName = locale === "ru" ? r.toRu : locale === "uz" ? r.toUz : r.toEn;

  const titles: Record<string, string> = {
    ru: `${fromName} — ${toName}: поездки, попутчики, цена | Yo'ldosh`,
    uz: `${fromName} — ${toName}: safarlar, yo'ldoshlar, narx | Yo'ldosh`,
    en: `${fromName} to ${toName}: Shared Rides & Prices | Yo'ldosh`,
  };
  const descs: Record<string, string> = {
    ru: `Найдите попутчика из ${fromName} в ${toName}. Расстояние ~${r.distanceKm} км, время ~${r.durationH} ч. Безопасные межгородские поездки на Yo'ldosh.`,
    uz: `${fromName}dan ${toName}ga yo'ldosh toping. Masofa ~${r.distanceKm} km, vaqt ~${r.durationH} soat. Yo'ldoshda xavfsiz shaharlararo safarlar.`,
    en: `Find a shared ride from ${fromName} to ${toName}. Distance ~${r.distanceKm} km, ~${r.durationH} hrs. Safe intercity carpooling on Yo'ldosh.`,
  };

  return {
    title: titles[locale],
    description: descs[locale],
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}/routes/${route}`,
      languages: Object.fromEntries([
        ...LOCALES.map((l) => [l, `${siteUrl}/${l}/routes/${route}`]),
        ["x-default", `${siteUrl}/ru/routes/${route}`],
      ]),
    },
    openGraph: {
      title: titles[locale],
      description: descs[locale],
      url: `${siteUrl}/${locale}/routes/${route}`,
      type: "website",
      siteName: "Yo'ldosh",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale],
      description: descs[locale],
    },
  };
}

export default async function RoutePage({ params }: Props) {
  const { locale, route } = await params;
  const r = ROUTES[route];

  if (!r) notFound();

  const t = await getTranslations({ locale, namespace: `metadata.routes.${route}` }).catch(() => null);

  const fromName = locale === "ru" ? r.fromRu : locale === "uz" ? r.fromUz : r.fromEn;
  const toName = locale === "ru" ? r.toRu : locale === "uz" ? r.toUz : r.toEn;

  const tripsSegment = tripsPathByLocale[locale] ?? "trips";
  const tripsUrl = `/${locale}/${tripsSegment}?from=${encodeURIComponent(fromName)}&to=${encodeURIComponent(toName)}&from_lat=${r.fromLat}&from_lon=${r.fromLon}&to_lat=${r.toLat}&to_lon=${r.toLon}&seats=1`;

  const labels = {
    cta: { ru: "Найти поездки", uz: "Safarlarni qidirish", en: "Find Trips" },
    dist: { ru: "Расстояние", uz: "Masofa", en: "Distance" },
    dur: { ru: "Время в пути", uz: "Yo'l vaqti", en: "Duration" },
    km: { ru: "км", uz: "km", en: "km" },
    h: { ru: "ч", uz: "soat", en: "hrs" },
    faqT: { ru: "Частые вопросы", uz: "Ko'p so'raladigan savollar", en: "FAQ" },
    h1: {
      ru: `Поездки из ${fromName} в ${toName}`,
      uz: `${fromName}dan ${toName}ga safarlar`,
      en: `Rides from ${fromName} to ${toName}`,
    },
    intro: {
      ru: `Ищете попутчика из ${fromName} в ${toName}? На Yo'ldosh вы найдёте проверенных водителей, безопасные поездки и честные цены. Расстояние около ${r.distanceKm} км, в дороге примерно ${r.durationH} ч.`,
      uz: `${fromName}dan ${toName}ga yo'ldosh qidiraysizmi? Yo'ldoshda tekshirilgan haydovchilar, xavfsiz safarlar va adolatli narxlarni topasiz. Masofa taxminan ${r.distanceKm} km, yo'lda taxminan ${r.durationH} soat.`,
      en: `Looking for a shared ride from ${fromName} to ${toName}? On Yo'ldosh you'll find verified drivers, safe trips and fair prices. Distance is about ${r.distanceKm} km, approximately ${r.durationH} hrs on the road.`,
    },
  };

  const faq: { q: string; a: string }[] = t?.has("faq") ? (t.raw("faq") as { q: string; a: string }[]) : [];

  const routeJsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `${fromName} → ${toName}`,
    description: labels.intro[locale as "ru" | "uz" | "en"],
    touristType: "Budget travelers",
    itinerary: [
      { "@type": "City", name: fromName },
      { "@type": "City", name: toName },
    ],
    provider: { "@type": "Organization", name: "Yo'ldosh", url: siteUrl },
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

  const l = locale as "ru" | "uz" | "en";

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
          <h1 className="text-3xl font-bold mb-3">{labels.h1[l]}</h1>
          <p className="text-white/90 text-lg mb-6">{labels.intro[l]}</p>
          <div className="flex gap-6 mb-6 text-sm">
            <div>
              <span className="text-white/70">{labels.dist[l]}: </span>
              <strong>
                ~{r.distanceKm} {labels.km[l]}
              </strong>
            </div>
            <div>
              <span className="text-white/70">{labels.dur[l]}: </span>
              <strong>
                ~{r.durationH} {labels.h[l]}
              </strong>
            </div>
          </div>
          <a href={tripsUrl}>
            <Button className="bg-white text-emerald-600 hover:bg-neutral-100 font-bold rounded-full px-8">
              {labels.cta[l]}
            </Button>
          </a>
        </div>

        {/* FAQ */}
        {faq.length > 0 && (
          <section className="w-full bg-white rounded-2xl shadow p-8">
            <h2 className="text-xl font-bold mb-4 text-neutral-800">{labels.faqT[l]}</h2>
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