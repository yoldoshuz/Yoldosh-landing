import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getPageJsonLd } from "@/app/lib/jsonld";
import { generatePageMetadata } from "@/app/lib/seo";
import { PrivacyPolicy } from "@/components/pages/privacy-policy/page";
import { PageProps } from "@/types";

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata((await params).locale, "privacyPolicy", "/privacy-policy");
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "metadata.privacyPolicy",
  });

  const { page, breadcrumb } = getPageJsonLd({
    locale,
    path: "/privacy-policy",
    type: "LegalDocument",
    name: t("title"),
    description: t("description"),
  });

  return (
    <>
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
          <div className="flex items-center justify-center min-h-[50vh]">
            <Loader2 className="size-8 animate-spin text-emerald-500" />
          </div>
        }
      >
        <div className="bg-neutral-100">
          <PrivacyPolicy />
        </div>
      </Suspense>
    </>
  );
};

export default Page;
