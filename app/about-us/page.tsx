import Head from "next/head";
import Script from "next/script";

import { Metadata } from "next";
import { AboutUs } from "@/components/pages/about/AboutUs";

export const metadata: Metadata = {
  title: "О нас - Yoldosh | Миссия сервиса совместных поездок",
  description:
    "Узнайте больше о Yoldosh - ведущем сервисе карпулинга в Узбекистане. Наша миссия - сделать междугородние поездки доступными и безопасными для всех жителей Узбекистана.",
  keywords: [
    "Yoldosh о компании",
    "карпулинг Узбекистан история",
    "миссия Yoldosh",
    "о сервисе совместных поездок",
    "команда Yoldosh",
  ],
  openGraph: {
    title: "О нас - Yoldosh",
    description: "Миссия ведущего сервиса карпулинга в Узбекистане",
    url: "https://yoldosh.uz/about-us",
    siteName: "Yoldosh",
    images: [
      {
        url: "/og-image.png",
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
      <Head>
        <link
          rel="canonical"
          href="https://yoldosh.uz/about-us"
          key="canonical"
        />
      </Head>

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
