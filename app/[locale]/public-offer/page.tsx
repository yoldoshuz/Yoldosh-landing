import { Suspense } from "react";
import Script from "next/script";
import { Loader2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getPageJsonLd } from "@/app/lib/jsonld";
import { generatePageMetadata } from "@/app/lib/seo";
import { PublicOffer } from "@/components/pages/public-offer/PublicOffer";
import { PageProps } from "@/types";

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata((await params).locale, "publicOffer", "");
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "metadata.publicOffer",
  });

  const { page, breadcrumb } = getPageJsonLd({
    locale,
    path: "/public-offer",
    type: "LegalDocument",
    name: t("title"),
    description: t("description"),
  });

  return (
    <>
      <Script
        id="public-offer-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }}
      />
      <Script
        id="breadcrumbSchema-org"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
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
