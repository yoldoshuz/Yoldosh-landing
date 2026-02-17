/**
 * SEO-страницы для популярных маршрутов.
 * URL: /ru/routes/tashkent-samarkand
 * Автоматически перенаправляют на /trips с координатами,
 * но сами индексируются Google как отдельные страницы под маршрутные запросы.
 */
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import { getTranslations } from 'next-intl/server';
import { Footer } from '@/components/shared/widgets/Footer';
import { Link } from '@/app/i18n/routing';
import { Button } from '@/components/ui/button';

// ===== База маршрутов =====
const ROUTES: Record<string, {
    fromRu: string; toRu: string;
    fromUz: string; toUz: string;
    fromEn: string; toEn: string;
    fromLat: number; fromLon: number;
    toLat: number; toLon: number;
    distanceKm: number;
    durationH: number;
}> = {
    'tashkent-samarkand': {
        fromRu: 'Ташкент', toRu: 'Самарканд',
        fromUz: 'Toshkent', toUz: 'Samarqand',
        fromEn: 'Tashkent', toEn: 'Samarkand',
        fromLat: 41.2995, fromLon: 69.2401,
        toLat: 39.6547, toLon: 66.9758,
        distanceKm: 325, durationH: 4,
    },
    'tashkent-bukhara': {
        fromRu: 'Ташкент', toRu: 'Бухара',
        fromUz: 'Toshkent', toUz: 'Buxoro',
        fromEn: 'Tashkent', toEn: 'Bukhara',
        fromLat: 41.2995, fromLon: 69.2401,
        toLat: 39.7747, toLon: 64.4286,
        distanceKm: 560, durationH: 6,
    },
    'tashkent-fergana': {
        fromRu: 'Ташкент', toRu: 'Фергана',
        fromUz: 'Toshkent', toUz: "Farg'ona",
        fromEn: 'Tashkent', toEn: 'Fergana',
        fromLat: 41.2995, fromLon: 69.2401,
        toLat: 40.3842, toLon: 71.7843,
        distanceKm: 420, durationH: 5,
    },
    'tashkent-andijan': {
        fromRu: 'Ташкент', toRu: 'Андижан',
        fromUz: 'Toshkent', toUz: 'Andijon',
        fromEn: 'Tashkent', toEn: 'Andijan',
        fromLat: 41.2995, fromLon: 69.2401,
        toLat: 40.7821, toLon: 72.3442,
        distanceKm: 450, durationH: 5,
    },
    'tashkent-namangan': {
        fromRu: 'Ташкент', toRu: 'Наманган',
        fromUz: 'Toshkent', toUz: 'Namangan',
        fromEn: 'Tashkent', toEn: 'Namangan',
        fromLat: 41.2995, fromLon: 69.2401,
        toLat: 41.0011, toLon: 71.6726,
        distanceKm: 400, durationH: 4,
    },
    'samarkand-bukhara': {
        fromRu: 'Самарканд', toRu: 'Бухара',
        fromUz: 'Samarqand', toUz: 'Buxoro',
        fromEn: 'Samarkand', toEn: 'Bukhara',
        fromLat: 39.6547, fromLon: 66.9758,
        toLat: 39.7747, toLon: 64.4286,
        distanceKm: 270, durationH: 3,
    },
    'tashkent-khiva': {
        fromRu: 'Ташкент', toRu: 'Хива',
        fromUz: 'Toshkent', toUz: 'Xiva',
        fromEn: 'Tashkent', toEn: 'Khiva',
        fromLat: 41.2995, fromLon: 69.2401,
        toLat: 41.3775, toLon: 60.3594,
        distanceKm: 880, durationH: 10,
    },
    'tashkent-nukus': {
        fromRu: 'Ташкент', toRu: 'Нукус',
        fromUz: 'Toshkent', toUz: "Nukus",
        fromEn: 'Tashkent', toEn: 'Nukus',
        fromLat: 41.2995, fromLon: 69.2401,
        toLat: 42.4530, toLon: 59.6103,
        distanceKm: 1100, durationH: 12,
    },
};

type Props = {
    params: Promise<{ locale: string; route: string }>;
};

export async function generateStaticParams() {
    return Object.keys(ROUTES).flatMap((route) =>
        ['ru', 'uz', 'en'].map((locale) => ({ locale, route }))
    );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, route } = await params;
    const r = ROUTES[route];
    if (!r) return {};

    const fromName = locale === 'ru' ? r.fromRu : locale === 'uz' ? r.fromUz : r.fromEn;
    const toName = locale === 'ru' ? r.toRu : locale === 'uz' ? r.toUz : r.toEn;
    const siteUrl = 'https://yoldosh.uz';

    const titles: Record<string, string> = {
        ru: `${fromName} → ${toName} попутчик — Yoldosh | Карпулинг Узбекистан`,
        uz: `${fromName} → ${toName} hamroh — Yoldosh | Carpooling O'zbekiston`,
        en: `${fromName} to ${toName} Carpool — Yoldosh | Uzbekistan Rideshare`,
    };
    const descs: Record<string, string> = {
        ru: `Найдите попутчика ${fromName}–${toName}. Расстояние ~${r.distanceKm} км, ~${r.durationH} ч. Проверенные водители, честные цены. Карпулинг Yoldosh.`,
        uz: `${fromName}–${toName} yo'nalishida hamroh toping. Masofa ~${r.distanceKm} km, ~${r.durationH} soat. Yoldosh carpooling.`,
        en: `Find a carpool from ${fromName} to ${toName}. Distance ~${r.distanceKm} km, ~${r.durationH} hrs. Verified drivers on Yoldosh.`,
    };

    return {
        title: titles[locale],
        description: descs[locale],
        keywords: [
            `${fromName} ${toName} попутчик`,
            `${fromName} ${toName} карпулинг`,
            `${fromName} ${toName} поездка`,
            `${r.fromEn} ${r.toEn} carpool`,
            `${r.fromEn} ${r.toEn} rideshare`,
        ],
        alternates: {
            canonical: `${siteUrl}/${locale}/routes/${route}`,
            languages: {
                ru: `${siteUrl}/ru/routes/${route}`,
                uz: `${siteUrl}/uz/routes/${route}`,
                en: `${siteUrl}/en/routes/${route}`,
            },
        },
        openGraph: {
            title: titles[locale],
            description: descs[locale],
            url: `${siteUrl}/${locale}/routes/${route}`,
            type: 'website',
        },
    };
}

export default async function RoutePage({ params }: Props) {
    const { locale, route } = await params;
    const r = ROUTES[route];

    if (!r) {
        redirect(`/${locale}`);
    }

    const fromName = locale === 'ru' ? r.fromRu : locale === 'uz' ? r.fromUz : r.fromEn;
    const toName = locale === 'ru' ? r.toRu : locale === 'uz' ? r.toUz : r.toEn;

    // URL для перехода на поиск с координатами
    const tripsUrl = `/${locale === 'ru' ? 'ru/%D0%BF%D0%BE%D0%B5%D0%B7%D0%B4%D0%BA%D0%B8' : locale === 'uz' ? 'uz/safarlar' : 'en/trips'}?from=${encodeURIComponent(fromName)}&to=${encodeURIComponent(toName)}&from_lat=${r.fromLat}&from_lon=${r.fromLon}&to_lat=${r.toLat}&to_lon=${r.toLon}&seats=1`;

    // JSON-LD для маршрута
    const routeJsonLd = {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: `${fromName} → ${toName}`,
        description: `Carpooling from ${fromName} to ${toName} in Uzbekistan`,
        touristType: "Budget travelers",
        itinerary: [
            { "@type": "City", name: fromName },
            { "@type": "City", name: toName },
        ],
        provider: {
            "@type": "Organization",
            name: "Yoldosh",
            url: "https://yoldosh.uz",
        },
    };

    const labels: Record<string, Record<string, string>> = {
        ru: {
            hero: `Попутчики ${fromName} → ${toName}`,
            sub: `Найдите попутчиков на маршруте ${fromName}–${toName}. Расстояние ~${r.distanceKm} км, время в пути ~${r.durationH} ч.`,
            cta: 'Найти поездки',
            dist: 'Расстояние',
            dur: 'Время в пути',
            km: 'км',
            h: 'ч',
        },
        uz: {
            hero: `${fromName} → ${toName} hamroh`,
            sub: `${fromName}–${toName} yo'nalishida hamroh toping. Masofa ~${r.distanceKm} km, yo'l vaqti ~${r.durationH} soat.`,
            cta: 'Safarlarni qidirish',
            dist: 'Masofa',
            dur: 'Yo\'l vaqti',
            km: 'km',
            h: 'soat',
        },
        en: {
            hero: `${fromName} to ${toName} Carpool`,
            sub: `Find travel companions from ${fromName} to ${toName}. Distance ~${r.distanceKm} km, travel time ~${r.durationH} hrs.`,
            cta: 'Find Trips',
            dist: 'Distance',
            dur: 'Duration',
            km: 'km',
            h: 'hrs',
        },
    };
    const l = labels[locale] ?? labels.en;

    return (
        <>
            <Script
                id="route-jsonld"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(routeJsonLd) }}
            />

            <article className="max-w-4xl mx-auto px-4 py-12">
                {/* Hero */}
                <div className="bg-emerald-500 rounded-3xl p-8 text-white mb-8">
                    <h1 className="text-3xl font-bold mb-3">{l.hero}</h1>
                    <p className="text-white/90 text-lg mb-6">{l.sub}</p>
                    <div className="flex gap-6 mb-6 text-sm">
                        <div>
                            <span className="text-white/70">{l.dist}: </span>
                            <strong>~{r.distanceKm} {l.km}</strong>
                        </div>
                        <div>
                            <span className="text-white/70">{l.dur}: </span>
                            <strong>~{r.durationH} {l.h}</strong>
                        </div>
                    </div>
                    <a href={tripsUrl}>
                        <Button className="bg-white text-emerald-600 hover:bg-neutral-100 font-bold rounded-full px-8">
                            {l.cta}
                        </Button>
                    </a>
                </div>
            </article>
            <Footer />
        </>
    );
}