import type { Metadata } from "next";

import { BlogDetail } from "@/components/pages/blog/BlogDetails";
import { API_URL, BASE_URL } from "@/lib/api";

// Public site URL is fixed — independent from the API/CMS asset host
// (BASE_URL). All SEO-facing URLs (canonical, og:url, breadcrumbs, JSON-LD
// `url`) MUST resolve to the user-visible site, otherwise Google indexes
// the api.* subdomain instead of yoldosh.uz.
const SITE_URL = "https://yoldosh.uz";
const LOCALES = ["ru", "uz", "en"] as const;

type Props = { params: Promise<{ locale: string; slug: string }> };

interface BlogAuthor {
  firstName?: string;
  lastName?: string;
}
interface BlogPayload {
  title?: string;
  subtitle?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[] | string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  author?: BlogAuthor;
  category?: { name?: string; slug?: string };
  readingTime?: number;
  wordCount?: number;
}

/**
 * Server-side fetch reused across generateMetadata + render. Next.js
 * dedupes identical fetch calls within the same request, so the upstream
 * is only hit once per slug per request.
 */
async function getBlog(slug: string, locale: string): Promise<BlogPayload | null> {
  try {
    const res = await fetch(`${API_URL}/blog/${slug}`, {
      headers: { "Accept-Language": locale },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Resolves a cover image stored on the CMS into an absolute, crawlable URL.
 * Returns null if no cover image is set — caller is expected to fall back
 * to a generic site-wide OG asset.
 */
function resolveCoverImage(coverImage: string | undefined): string | null {
  if (!coverImage) return null;
  if (coverImage.startsWith("http")) return coverImage;
  const normalized = coverImage.replace(/^\/public/, "");
  return `${BASE_URL}${normalized.startsWith("/") ? "" : "/"}${normalized}`;
}

function languageAlternates(slug: string) {
  const out: Record<string, string> = {};
  for (const l of LOCALES) out[l] = `${SITE_URL}/${l}/blog/${slug}`;
  out["x-default"] = `${SITE_URL}/ru/blog/${slug}`;
  return out;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const blog = await getBlog(slug, locale);

  if (!blog) {
    return {
      title: "Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${SITE_URL}/${locale}/blog/${slug}`;
  const cover = resolveCoverImage(blog.coverImage);
  const ogImage = cover ?? `${SITE_URL}/og-home-${locale === "uz" || locale === "en" ? locale : "ru"}.png`;

  const title = blog.seoTitle || blog.title || "Yoldosh blog";
  const description = blog.seoDescription || blog.subtitle || "";
  const keywords = Array.isArray(blog.seoKeywords)
    ? blog.seoKeywords
    : typeof blog.seoKeywords === "string"
      ? blog.seoKeywords.split(",").map((k) => k.trim()).filter(Boolean)
      : undefined;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
      languages: languageAlternates(slug),
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      publishedTime: blog.publishedAt || blog.createdAt,
      modifiedTime: blog.updatedAt,
      authors: blog.author ? [`${blog.author.firstName ?? ""} ${blog.author.lastName ?? ""}`.trim()] : undefined,
      section: blog.category?.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
      siteName: "Yoldosh",
      locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function BlogSlugPage({ params }: Props) {
  const { locale, slug } = await params;
  const blog = await getBlog(slug, locale);

  const canonicalUrl = `${SITE_URL}/${locale}/blog/${slug}`;
  const cover = resolveCoverImage(blog?.coverImage);

  // Article schema — emitted only when the blog payload resolved so we
  // never advertise a non-existent post to Google.
  const articleJsonLd = blog
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: blog.title,
        description: blog.subtitle || blog.seoDescription || "",
        datePublished: blog.publishedAt || blog.createdAt,
        dateModified: blog.updatedAt || blog.publishedAt || blog.createdAt,
        wordCount: blog.wordCount,
        timeRequired: blog.readingTime ? `PT${blog.readingTime}M` : undefined,
        articleSection: blog.category?.name,
        inLanguage: locale,
        mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
        author: blog.author
          ? {
              "@type": "Person",
              name: `${blog.author.firstName ?? ""} ${blog.author.lastName ?? ""}`.trim(),
            }
          : { "@type": "Organization", name: "Yoldosh" },
        publisher: {
          "@type": "Organization",
          name: "Yoldosh",
          logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/logo.svg` },
        },
        image: cover ? [cover] : undefined,
        url: canonicalUrl,
        isAccessibleForFree: true,
      }
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "ru" ? "Главная" : locale === "uz" ? "Bosh sahifa" : "Home",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: locale === "ru" ? "Блог" : locale === "uz" ? "Blog" : "Blog",
        item: `${SITE_URL}/${locale}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: blog?.title ?? slug,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="bg-gray-100 min-h-screen">
        <BlogDetail slug={slug} />
      </div>
    </>
  );
}
