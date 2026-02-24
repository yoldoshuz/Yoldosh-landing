import Script from "next/script";
import NotFound from "./not-found";

import { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { getOrganizationJsonLd } from "@/app/lib/jsonld";
import { Navbar } from "@/components/shared/widgets/Navbar";
import { LayoutProps } from "@/types";
import { routing } from "../i18n/routing";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProviders } from "./providers/ThemeProviders";

import "./globals.css";

const font = Nunito_Sans({
  variable: "--font-font",
  subsets: ["latin", "cyrillic"],
});

const SITE_URL = "https://yoldosh.uz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    return <NotFound />;
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const hreflangs = [
    { hreflang: "ru", href: `${SITE_URL}/ru` },
    { hreflang: "uz", href: `${SITE_URL}/uz` },
    { hreflang: "en", href: `${SITE_URL}/en` },
    { hreflang: "x-default", href: `${SITE_URL}/ru` },
  ];

  return (
    <html
      lang={locale}
      className="light"
      style={{ colorScheme: "light" }}
    >
      <head>
        {hreflangs.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
        ))}

        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/logo.svg" as="image" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        <Script
          id="jsonld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationJsonLd()) }}
        />
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyD5T6hjyhafvGhxq_vAiSiCn8n-KieShFk&libraries=places&language=en`}
          strategy="afterInteractive"
        />
      </head>
      <body className={`${font.variable} antialiased`}>
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