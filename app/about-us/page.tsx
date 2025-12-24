import { Metadata } from "next";
import Script from "next/script";

import { AboutUs } from "@/components/pages/about/AboutUs";

export const metadata: Metadata = {
  title: "О нас - Yoldosh | История и миссия сервиса совместных поездок",
  description:
    "Узнайте больше о Yoldosh - ведущем сервисе карпулинга в Узбекистане. Наша миссия - сделать междугородние поездки доступными, безопасными и экологичными для всех жителей Узбекистана. Читайте о нашей истории, ценностях и планах развития.",
  keywords: [
    "Yoldosh о компании",
    "карпулинг Узбекистан история",
    "миссия Yoldosh",
    "о сервисе совместных поездок",
    "команда Yoldosh",
  ],
  openGraph: {
    title: "О нас - Yoldosh",
    description: "История и миссия ведущего сервиса карпулинга в Узбекистане",
    url: "https://yoldosh.uz/about-us",
    siteName: "Yoldosh",
    images: [
      {
        url: "/og-about.jpg",
        width: 1200,
        height: 630,
        alt: "О компании Yoldosh",
      },
    ],
    type: "website",
  },
  alternates: {
    canonical: "https://yoldosh.uz/about-us",
  },
};

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "О компании Yoldosh",
  description: "Информация о сервисе совместных поездок Yoldosh",
  url: "https://yoldosh.uz/about-us",
  mainEntity: {
    "@type": "Organization",
    name: "Yoldosh",
    description: "Сервис совместных поездок по Узбекистану",
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
      name: "О нас",
      item: "https://yoldosh.uz/about-us",
    },
  ],
};

const Page = () => {
  return (
    <>
      <Script
        id="aboutPageSchema-org"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageSchema) }}
      />
      <Script
        id="breadcrumbSchema-org"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <AboutUs />
    </>
  );
};

export default Page;
