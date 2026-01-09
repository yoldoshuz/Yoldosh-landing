import Head from "next/head";
import Script from "next/script";

import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { PublicOffer } from "@/components/pages/public-offer/PublicOffer";

export const metadata: Metadata = {
  title: "Публичная оферта | Yoldosh",
  description:
    "Публичная оферта на оказание услуг по предоставлению доступа к платформе Yo'ldosh",
  alternates: {
    canonical: "https://yoldosh.uz/public-offer",
  },
};

const offerSchema = {
  "@context": "https://schema.org",
  "@type": "LegalDocument",
  name: "Публичная оферта Yo'ldosh",
  datePublished: "2026-01-05",
  inLanguage: "ru",
  publisher: {
    "@type": "Organization",
    name: "MILLIY YOLDOSH",
    url: "https://yoldosh.uz",
  },
};

const Page = () => {
  return (
    <>
      <Head>
        <link
          rel="canonical"
          href="https://yoldosh.uz/public-offer"
          key="canonical"
        />
      </Head>

      <Script
        id="public-offer-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerSchema) }}
      />

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="size-8 animate-spin text-emerald-500" />
          </div>
        }
      >
        <div className="bg-neutral-100">
          <PublicOffer />
        </div>
      </Suspense>
    </>
  );
};

export default Page;
