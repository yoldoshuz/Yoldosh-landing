import Head from "next/head";
import Script from "next/script";

import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { SearchPage } from "@/components/pages/trips/TripPage";

export const metadata: Metadata = {
  title: "Поиск поездок - Найдите попутчиков по Узбекистану | Yoldosh",
  description:
    "Найдите попутчиков для междугородних поездок по Узбекистану. Удобный поиск, проверенные водители, низкие цены. Бронируйте поездку онлайн за пару минут!",
  keywords: [
    "поиск попутчиков Узбекистан",
    "Ташкент Самарканд попутчики",
    "Ташкент Бухара поездки",
    "междугородние поездки онлайн",
    "забронировать поездку Узбекистан",
    "карпулинг поиск",
    "дешевые поездки между городами",
  ],
  openGraph: {
    title: "Поиск поездок по Узбекистану - Yoldosh",
    description: "Найдите идеальную поездку с попутчиками. Тысячи маршрутов по всему Узбекистану",
    url: "https://yoldosh.uz/trips",
    siteName: "Yoldosh",
    images: [
      {
        url: "/assets/og-trips.jpg",
        width: 1200,
        height: 630,
        alt: "Поиск поездок Yoldosh",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://yoldosh.uz/trips",
  },
};

const searchPageSchema = {
  "@context": "https://schema.org",
  "@type": "SearchResultsPage",
  name: "Поиск поездок",
  description: "Страница поиска попутчиков и междугородних поездок",
  url: "https://yoldosh.uz/trips",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://yoldosh.uz/trips?from={from}&to={to}&date={date}",
    },
    "query-input": "required name=from, required name=to, optional name=date",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Главная",
      item: "https://yoldosh.uz",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Поиск поездок",
      item: "https://yoldosh.uz/trips",
    },
  ],
};

const Page = () => {
  return (
    <>
      {/* <Head>
        <link
          rel="canonical"
          href="https://yoldosh.uz/trips"
          key="canonical"
        />
      </Head> */}

      <Script
        id="searchPageSchema-org"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(searchPageSchema) }}
      />
      <Script
        id="searchPageSchema-org"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="size-8 animate-spin text-emerald-500" />
          </div>
        }
      >
        <SearchPage />
      </Suspense>
    </>
  );
};

export default Page;
