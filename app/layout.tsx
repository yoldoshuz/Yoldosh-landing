import Script from "next/script";

import { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { Navbar } from "@/components/shared/widgets/Navbar";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProviders } from "./providers/ThemeProviders";

import "./globals.css";

// Оптимизация шрифта с preload
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://yoldosh.uz"),
  title: {
    default: "Yoldosh - Совместные поездки по Узбекистану",
    template: "%s | Yoldosh",
  },
  description:
    "Найдите попутчиков для междугородних поездок по Узбекистану. Безопасный сервис Yoldosh соединяет водителей и пассажиров. Проверенные водители, низкие цены.",
  keywords: [
    "карпулинг Узбекистан",
    "попутчики Узбекистан",
    "Ташкент Самарканд",
    "междугородние поездки",
    "совместные поездки",
    "carpooling Uzbekistan",
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
    description: "Безопасный сервис карпулинга для междугородних поездок.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Yoldosh Carpooling",
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
    languages: {
      'ru': 'https://yoldosh.uz',
      'uz': 'https://yoldosh.uz',
      'en': 'https://yoldosh.uz',
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
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
    streetAddress: "Zarbuloq-31",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@yoldosh.uz",
    availableLanguage: ["uz", "ru", "en"],
  },
  sameAs: [
    "https://t.me/yoldosh_uz",
    "https://instagram.com/yoldosh_uz",
  ],
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
        {/* DNS Prefetch для внешних ресурсов */}
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />

        {/* Preconnect для критичных ресурсов */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload критичных ресурсов */}
        <link
          rel="preload"
          href="/assets/logo.svg"
          as="image"
          type="image/svg+xml"
        />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />

        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <link rel="alternate" hrefLang="ru" href="https://www.yoldosh.uz" />
        <link rel="alternate" hrefLang="uz" href="https://www.yoldosh.uz" />
        <link rel="alternate" hrefLang="en" href="https://www.yoldosh.uz" />
        <link rel="alternate" hrefLang="x-default" href="https://www.yoldosh.uz" />

        {/* JSON-LD - критичный для SEO */}
        <Script
          id="jsonld-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {/* Yandex Metrika - загружается асинхронно */}
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

        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/105993566"
              style={{ position: "absolute", left: "-9999px" }}
              alt="yandex"
            />
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