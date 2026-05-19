import { getTranslations } from "next-intl/server";

import { getPageJsonLd } from "@/app/lib/jsonld";
import { generatePageMetadata } from "@/app/lib/seo";
import { AboutUs } from "@/components/pages/about-us/AboutUs";
import { Footer } from "@/components/shared/widgets/Footer";
import { PageProps } from "@/types";

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata((await params).locale, "about", "/about-us");
}

const Page = async ({ params }: PageProps) => {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "metadata.about",
  });

  const { page, breadcrumb } = getPageJsonLd({
    locale,
    path: "/about-us",
    type: "AboutPage",
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

      <AboutUs />
      <Footer />
    </>
  );
};

export default Page;
