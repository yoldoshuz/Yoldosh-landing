import Script from "next/script";
import { getTranslations } from "next-intl/server";

import { getPageJsonLd } from "@/app/lib/jsonld";
import { generatePageMetadata } from "@/app/lib/seo";
import { ForPassengers } from "@/components/pages/for-passengers/ForPassengers";
import { Footer } from "@/components/shared/widgets/Footer";
import { PageProps } from "@/types";

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata((await params).locale, "forPassengers", "/for-passengers");
}

const ForPassengersPage = async ({ params }: PageProps) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.forPassengers" });

  const { page, breadcrumb } = getPageJsonLd({
    locale,
    path: "/for-passengers",
    name: t("title"),
    description: t("description"),
  });

  return (
    <>
      <Script
        id="for-passengers-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }}
      />
      <Script
        id="for-passengers-breadcrumb"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <ForPassengers />
      <Footer />
    </>
  );
};

export default ForPassengersPage;
