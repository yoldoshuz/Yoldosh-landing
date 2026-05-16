import { Suspense } from "react";
import Script from "next/script";
import { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getPageJsonLd } from "@/app/lib/jsonld";
import { generatePageMetadata } from "@/app/lib/seo";
import { resolveCitySync } from "@/app/lib/route-resolver";
import { SearchPage } from "@/components/pages/trips/TripPage";

type TripsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const SITE_URL = "https://yoldosh.uz";

function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * If the request has city search params and they resolve to two valid cities,
 * the canonical URL is the corresponding /routes/[slug] landing page — that
 * page is the indexable hub. The raw search URL itself is noindexed to avoid
 * thin/duplicate SERP entries.
 */
export async function generateMetadata({ params, searchParams }: TripsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const search = await searchParams;
  const baseMeta = await generatePageMetadata(locale, "trips", "/trips");

  const hasAnySearchParam = ["from", "to", "from_lat", "from_lon", "to_lat", "to_lon", "seats", "date"].some(
    (k) => pickFirst(search[k]) != null,
  );

  if (!hasAnySearchParam) {
    return baseMeta;
  }

  // Try to resolve the search into a canonical /routes/[slug] page.
  let canonicalTarget = `${SITE_URL}/${locale}/trips`;
  const fromName = pickFirst(search.from);
  const toName = pickFirst(search.to);
  if (fromName && toName) {
    // Sync seed-only lookup keeps generateMetadata snappy. If the user's
    // search query references a long-tail API-only city, the canonical
    // falls back to the generic /trips entry, which is acceptable since
    // such combinations are rare in raw search traffic.
    const fromCity = resolveCitySync(fromName);
    const toCity = resolveCitySync(toName);
    if (fromCity && toCity && fromCity.key !== toCity.key) {
      canonicalTarget = `${SITE_URL}/${locale}/routes/${fromCity.key}-${toCity.key}`;
    }
  }

  return {
    ...baseMeta,
    alternates: {
      ...baseMeta.alternates,
      canonical: canonicalTarget,
    },
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
  };
}

const Page = async ({ params }: TripsPageProps) => {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "metadata.trips" });
  const { page, breadcrumb } = getPageJsonLd({
    locale,
    path: "/trips",
    type: "SearchResultsPage",
    name: t("title"),
    description: t("description"),
  });

  return (
    <>
      <Script
        id="trips-page-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }}
      />
      <Script
        id="trips-breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="size-8 animate-spin text-emerald-500" />
          </div>
        }
      >
        <div className="bg-gray-100">
          <SearchPage />
        </div>
      </Suspense>
    </>
  );
};

export default Page;
