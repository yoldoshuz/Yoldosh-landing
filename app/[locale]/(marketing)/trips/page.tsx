import { Suspense } from "react";
import { Metadata } from "next";
import { Loader2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getPageJsonLd } from "@/app/lib/jsonld";
import { resolveCitySync } from "@/app/lib/route-resolver";
import { generatePageMetadata } from "@/app/lib/seo";
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
 * The bare `/trips` page is the indexable search hub. Variants that carry
 * specific filter params (from/to/date/seats) are tagged `noindex, follow`
 * so Google doesn't bloat the SERP with thin filter permutations. We keep
 * the canonical self-referential to the unfiltered `/trips` URL — Google's
 * documented guidance is *not* to combine `noindex` with a `rel=canonical`
 * pointing to a different URL, because the canonical hint then conflicts
 * with the explicit "don't index" signal. Equity for known city pairs
 * flows into `/routes/[slug]` via the trips list internal links and the
 * `sitemap-trips.xml` feed, which is the documented consolidation path.
 */
export async function generateMetadata({ params, searchParams }: TripsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const search = await searchParams;
  const baseMeta = await generatePageMetadata(locale, "trips", "/trips");

  const hasAnySearchParam = ["from", "to", "from_lat", "from_lon", "to_lat", "to_lon", "seats", "date"].some(
    (k) => pickFirst(search[k]) != null
  );

  if (!hasAnySearchParam) {
    return baseMeta;
  }

  // When the filter resolves to a known city pair, surface the canonical
  // landing page in OG metadata so social previews still point at the
  // SEO-target URL.
  const fromName = pickFirst(search.from);
  const toName = pickFirst(search.to);
  let routeUrl: string | null = null;
  if (fromName && toName) {
    const fromCity = resolveCitySync(fromName);
    const toCity = resolveCitySync(toName);
    if (fromCity && toCity && fromCity.key !== toCity.key) {
      routeUrl = `${SITE_URL}/${locale}/routes/${fromCity.key}-${toCity.key}`;
    }
  }

  return {
    ...baseMeta,
    alternates: {
      ...baseMeta.alternates,
      canonical: `${SITE_URL}/${locale}/trips`,
    },
    openGraph: {
      ...baseMeta.openGraph,
      url: routeUrl ?? `${SITE_URL}/${locale}/trips`,
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
      {/*
        JSON-LD is metadata, not executable script. `<Script strategy="beforeInteractive">`
        is only honored in the root layout — in nested segments Next.js silently
        downgrades the strategy. A plain `<script type="application/ld+json">`
        inlined in JSX is delivered with the initial HTML, which is exactly
        what crawlers expect, with no client-side scheduling overhead.
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }}
      />
      <script
        type="application/ld+json"
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
