import { getTranslations } from "next-intl/server";

import { getPageJsonLd } from "@/app/lib/jsonld";
import { generatePageMetadata } from "@/app/lib/seo";
import { ForDrivers } from "@/components/pages/for-drivers/ForDrivers";
import { Footer } from "@/components/shared/widgets/Footer";
import { PageProps } from "@/types";

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata((await params).locale, "forDrivers", "/for-drivers");
}

const ForDriversPage = async ({ params }: PageProps) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.forDrivers" });

  const { page, breadcrumb } = getPageJsonLd({
    locale,
    path: "/for-drivers",
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
      <ForDrivers />
      <Footer />
    </>
  );
};

export default ForDriversPage;
