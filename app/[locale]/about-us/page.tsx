import Script from "next/script";

import { PageProps } from "@/types";
import { getPageJsonLd } from "@/app/lib/jsonld";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/app/lib/seo";
import { Footer } from "@/components/shared/widgets/Footer";
import { AboutUs } from "@/components/pages/about-us/AboutUs";

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata((await params).locale, 'about', '/about-us');
};

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: 'metadata.trips'
  });

  const { page, breadcrumb } = getPageJsonLd({
    locale,
    path: '/about-us',
    type: 'AboutPage',
    name: t('title'),
    description: t('description')
  });

  return (
    <>
      <Script
        id="aboutPageSchema-org"
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

      <AboutUs />
      <Footer />
    </>
  );
};

export default Page;
