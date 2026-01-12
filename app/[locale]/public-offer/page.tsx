import Script from "next/script";

import { Suspense } from "react";
import { PageProps } from "@/types";
import { Loader2 } from "lucide-react";
import { getPageJsonLd } from "@/app/lib/jsonld";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/app/lib/seo";

import { PublicOffer } from "@/components/pages/public-offer/PublicOffer";

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata((await params).locale, 'publicOffer', '');
};

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'metadata.publicOffer'
  });

  const { page, breadcrumb } = getPageJsonLd({
    locale,
    path: '/public-offer',
    type: 'LegalDocument',
    name: t('title'),
    description: t('description')
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
