import { getTranslations } from "next-intl/server";

import { generatePageMetadata } from "@/app/lib/seo";
import { Help } from "@/components/pages/home/Help";
import { Home } from "@/components/pages/home/Home";
import { HowItWorks } from "@/components/pages/home/HowItWorks";
import { Popular } from "@/components/pages/home/Popular";
import { Travel } from "@/components/pages/home/Travel";
import { WhyUs } from "@/components/pages/home/WhyUs";
import { Footer } from "@/components/shared/widgets/Footer";
import { PageProps } from "@/types";
import { getPageJsonLd } from "../lib/jsonld";

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata((await params).locale, "home", "");
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;

  const t = await getTranslations({
    locale,
    namespace: "metadata.home",
  });

  const { page, breadcrumb } = getPageJsonLd({
    locale,
    path: "",
    name: t("title"),
    description: t("description"),
  });

  return (
    <>
      {/*
        JSON-LD is structured data, not executable script — emit it as a
        plain `<script type="application/ld+json">` so it ships with the
        initial server-rendered HTML. `<Script strategy="beforeInteractive">`
        is silently downgraded in nested route segments and has no benefit
        here (LD payloads don't execute).
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <article>
        <Home />
        <Popular />
        <HowItWorks />
        <Help />
        <WhyUs />
        <Travel />
      </article>
      <Footer />
    </>
  );
};

export default Page;
