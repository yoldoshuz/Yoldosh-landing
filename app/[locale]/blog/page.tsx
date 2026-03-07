import Script from "next/script";
import { getTranslations } from "next-intl/server";

import { generatePageMetadata } from "@/app/lib/seo";
import { getPageJsonLd } from "@/app/lib/jsonld";
import { Blog } from "@/components/pages/blog/Blog";
import { PageProps } from "@/types";

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata((await params).locale, "blog", "/blog");
}

const BlogPage = async ({ params }: PageProps) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.blog" });

  const { page, breadcrumb } = getPageJsonLd({
    locale,
    path: "/blog",
    name: t("title"),
    description: t("description"),
  });

  return (
    <>
      <Script
        id="blog-page-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }}
      />
      <Script
        id="blog-breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <div className="bg-gray-100 min-h-screen">
        <Blog />
      </div>
    </>
  );
};

export default BlogPage;