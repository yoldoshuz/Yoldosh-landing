import Script from "next/script";
import NotFound from "./not-found";
import YandexMetrika from "@/components/functional/YandexMetrika";

import { Metadata } from "next";
import { Chiron_GoRound_TC } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { getOrganizationJsonLd, getWebSiteJsonLd } from "@/app/lib/jsonld";
import { Navbar } from "@/components/shared/widgets/Navbar";
import { LayoutProps } from "@/types";
import { routing } from "../i18n/routing";
import { QueryProvider } from "./providers/QueryProvider";
import { ThemeProviders } from "./providers/ThemeProviders";

import "./globals.css";

const font = Chiron_GoRound_TC({
  variable: "--font-font",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: true,
});

const SITE_URL = "https://yoldosh.uz";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Yoldosh",
  authors: [{ name: "Yoldosh", url: SITE_URL }],
  creator: "Yoldosh",
  publisher: "OOO Milliy Yoldosh",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
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
  // Google verification ships as /public/google298d1de612ac4217.html.
  // Yandex verification is wired through Yandex.Metrika initialization in
  // the body — no meta tag fallback needed.
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

  return (
    <html lang={locale} className="light" style={{ colorScheme: "light" }}>
      <head>
        {/*
          Resource hints — `preconnect` for assets the browser will request
          on every navigation (fonts), `dns-prefetch` for hosts only used
          opportunistically (analytics, Maps). Order matters: keep the
          critical preconnects first.
        */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://maps.googleapis.com" />
        <link rel="dns-prefetch" href="https://api.yoldosh.uz" />

        <link rel="preload" href="/assets/logo.svg" as="image" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/*
          JSON-LD is data, not script. Inline `<script type="application/ld+json">`
          in the head delivers it with the initial HTML — crawlers see it
          immediately, no client-side scheduling required. Organization +
          WebSite together form a connected entity graph that powers
          Sitelinks Searchbox eligibility and Knowledge Graph signals.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getOrganizationJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebSiteJsonLd()) }}
        />
      </head>
      <body className={`${font.className} antialiased`}>
        <YandexMetrika />
        {/*
          Google Maps Places API is only required on pages that mount the
          search autocomplete. Deferring with `lazyOnload` keeps it out of
          the LCP path on content-heavy surfaces (blog, routes landings,
          static pages) without breaking the autocomplete on /trips and
          the homepage — the script still loads after the browser hits
          idle, before any meaningful user search interaction.
        */}
        <Script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD5T6hjyhafvGhxq_vAiSiCn8n-KieShFk&libraries=places&language=en&loading=async"
          strategy="lazyOnload"
        />

        {/*
          Yandex.Metrika is moved to `lazyOnload`. Webvisor + clickmap
          payloads weigh ~30kb and impact INP — delaying them until the
          browser is idle dramatically improves Core Web Vitals without
          losing any analytical signal.
        */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {
                if (document.scripts[j].src === r) return;
              }
              k=e.createElement(t),a=e.getElementsByTagName(t)[0];
              k.async=1;
              k.src=r;
              a.parentNode.insertBefore(k,a);
            })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=105993566", "ym");

            ym(105993566, "init", {
              ssr: true,
              webvisor: true,
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              ecommerce: "dataLayer",
              referrer: document.referrer,
              url: location.href
            });
          `}
        </Script>

        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/105993566"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
              width={1}
              height={1}
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
