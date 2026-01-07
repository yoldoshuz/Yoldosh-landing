import Head from "next/head";
import Script from "next/script";

import { Metadata } from "next";
import { Help } from "@/components/pages/home/Help";
import { Home } from "@/components/pages/home/Home";
import { HowItWorks } from "@/components/pages/home/HowItWorks";
import { Popular } from "@/components/pages/home/Popular";
import { Travel } from "@/components/pages/home/Travel";
import { WhyUs } from "@/components/pages/home/WhyUs";
import { Footer } from "@/components/shared/widgets/Footer";

export const metadata: Metadata = {
  title: "Yoldosh - Совместные поездки по Узбекистану и между городами",
  description:
    "Найдите попутчиков для поездок по Узбекистану. Сервис Yoldosh для комфортных и экономичных путешествий. Проверенные водители и прозрачные цены.",
  keywords: [
    "попутчики Узбекистан",
    "карпулинг Ташкент",
    "совместные поездки",
    "междугородние поездки Узбекистан",
    "Ташкент Самарканд попутчики",
    "дешевые поездки Узбекистан",
    "carpooling Uzbekistan",
    "ridesharing Central Asia",
  ],
  openGraph: {
    title: "Yoldosh - Найдите попутчиков для поездок по Узбекистану",
    description: "Безопасный сервис совместных поездок. Экономьте на транспорте, путешествуйте с комфортом!",
    url: "https://yoldosh.uz",
    siteName: "Yoldosh",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yoldosh Carpooling Service",
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
  alternates: {
    canonical: "https://yoldosh.uz",
  },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Yoldosh - Главная страница",
  description: "Сервис совместных поездок по Узбекистану",
  url: "https://yoldosh.uz",
  mainEntity: {
    "@type": "WebApplication",
    name: "Yoldosh",
    applicationCategory: "TravelApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "UZS",
    },
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
  ],
};

const Page = () => {
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://yoldosh.uz"
          key="canonical"
        />
      </Head>

      <Script
        id="webPageSchema-org"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <Script
        id="breadcrumbSchema-org"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <article>
        <Home />
        <HowItWorks />
        <Help />
        <WhyUs />
        <Popular />
        <Travel />
      </article>
      <Footer />
    </>
  );
};

export default Page;