import { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { Navbar } from "@/components/shared/widgets/Navbar";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProviders } from "./providers/ThemeProviders";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yoldosh.uz"),
  title: {
    default: "Yoldosh - Совместные поездки по Узбекистану | Каршеринг между городами",
    template: "%s | Yoldosh - Карпулинг Узбекистан",
  },
  description:
    "Yoldosh - безопасный и удобный сервис совместных поездок по Узбекистану. Найдите попутчиков для междугородних поездок по Ташкенту, Самарканду, Бухаре и другим городам. Экономьте на транспорте, путешествуйте комфортно!",
  keywords: [
    "Yoldosh",
    "карпулинг Узбекистан",
    "совместные поездки",
    "попутчики Узбекистан",
    "междугородние поездки",
    "Ташкент Самарканд",
    "Ташкент Бухара",
    "поездки по Узбекистану",
    "carpooling Uzbekistan",
    "ride sharing",
    "همسفران ازبکستان",
  ],
  authors: [{ name: "Yoldosh Team" }],
  creator: "OOO Milliy Yoldosh",
  publisher: "OOO Milliy Yoldosh",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    alternateLocale: ["uz_UZ", "en_US"],
    url: "https://yoldosh.uz",
    siteName: "Yoldosh",
    title: "Yoldosh - Совместные поездки по Узбекистану",
    description:
      "Безопасный сервис карпулинга для междугородних поездок по Узбекистану. Найдите попутчиков и экономьте на транспорте!",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Yoldosh - Carpooling Uzbekistan",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://yoldosh.uz",
  },
  category: "transportation",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Yoldosh",
  legalName: "OOO Milliy Yoldosh",
  url: "https://yoldosh.uz",
  logo: "https://yoldosh.uz/logo.svg",
  foundingDate: "2025",
  address: {
    "@type": "PostalAddress",
    addressCountry: "UZ",
    addressRegion: "Tashkent",
    addressLocality: "Tashkent",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@yoldosh.uz",
    availableLanguage: ["uz", "ru", "en"],
  },
  service: {
    "@type": "Service",
    serviceType: "Carpooling",
    provider: {
      "@type": "Organization",
      name: "Yoldosh",
    },
    areaServed: {
      "@type": "Country",
      name: "Uzbekistan",
    },
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Yoldosh",
  image: "https://yoldosh.uz/logo.svg",
  "@id": "https://yoldosh.uz",
  url: "https://yoldosh.uz",
  telephone: "+998-XX-XXX-XX-XX",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Юнусабадский район, Ташкент, Tashkent, Узбекистан, Zarbuloq-31",
    addressLocality: "Tashkent",
    postalCode: "100000",
    addressCountry: "UZ",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.355708169617124,
    longitude: 69.32520124699197,
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "9:00",
    closes: "18:00",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* Canonical Link */}
        <link rel="canonical" href="https://yoldosh.uz" />

        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* JSON-LD Structured Data */}
        <Script
          id="jsonld-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="localBusinessSchema-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {/* Yandex Metrika */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              k=e.createElement(t),a=e.getElementsByTagName(t)[0];
              k.async=1;k.src=r;a.parentNode.insertBefore(k,a);
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(105993566, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
            });
          `}
        </Script>

        {/* Yandex Metrika */}
        <noscript>
          <div>
            <img src="https://mc.yandex.ru/watch/105993566" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>

        <QueryProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProviders>
              <div className="flex flex-col min-h-screen">
                <header className="shrink-0 mb-16">
                  <Navbar />
                </header>
                <main className="flex-1" id="main-content" role="main">
                  {children}
                </main>
              </div>
            </ThemeProviders>
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
