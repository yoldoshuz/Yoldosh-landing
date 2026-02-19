import { Suspense } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getPageJsonLd } from "@/app/lib/jsonld";
import { generatePageMetadata } from "@/app/lib/seo";
import { SearchPage } from "@/components/pages/trips/TripPage";
import { PageProps } from "@/types";

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata((await params).locale, "trips", "/trips");
}

const Page = async ({ params }: PageProps) => {
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
        <div className="bg-zinc-100">
          <SearchPage />
        </div>
      </Suspense>
    </>
  );
};

export default Page;
