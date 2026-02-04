import Script from "next/script";

import { PageProps } from "@/types";
import { getPageJsonLd } from "../lib/jsonld";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from '@/app/lib/seo';

import { Help } from "@/components/pages/home/Help";
import { Home } from "@/components/pages/home/Home";
import { WhyUs } from "@/components/pages/home/WhyUs";
import { Travel } from "@/components/pages/home/Travel";
import { Popular } from "@/components/pages/home/Popular";
import { Footer } from "@/components/shared/widgets/Footer";
import { HowItWorks } from "@/components/pages/home/HowItWorks";

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata((await params).locale, 'home', '');
};

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: 'metadata.home'
  });

  const { page, breadcrumb } = getPageJsonLd({
    locale,
    path: '',
    name: t('title'),
    description: t('description')
  });

  return (
    <>

      <Script
        id="webPageSchema-org"
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

      <article>
        <Home />
        <HowItWorks />
        <Help />
        <WhyUs />
        <Popular />
        <Travel />
      </article>
      <Footer />
    </>
  );
};

export default Page;