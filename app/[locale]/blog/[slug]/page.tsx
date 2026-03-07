import Script from "next/script";

import type { Metadata } from "next";
import { API_URL, BASE_URL } from "@/lib/api";
import { BlogDetail } from "@/components/pages/blog/BlogDetails";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Получаем данные блога на сервере для SEO
async function getBlog(slug: string, locale: string) {
    try {
        const res = await fetch(`${API_URL}/blog/${slug}`, {
            headers: { "Accept-Language": locale },
            next: { revalidate: 3600 }, // ISR — каждый час
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json?.data ?? null;
    } catch {
        return null;
    }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale, slug } = await params;
    const blog = await getBlog(slug, locale);

    if (!blog) {
        return { title: "Not Found" };
    }

    const localizedPath = `/blog/${slug}`;
    const canonicalUrl = `${BASE_URL}/${locale}${localizedPath}`;

    // Cover для OG
    const ogImage = blog.coverImage
        ? blog.coverImage.startsWith("http")
            ? blog.coverImage
            : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}${blog.coverImage.replace(/^\/public/, "")}`
        : `${BASE_URL}/og-default.png`;

    return {
        title: blog.seoTitle || blog.title,
        description: blog.seoDescription || blog.subtitle || "",
        metadataBase: new URL(BASE_URL),
        alternates: {
            canonical: canonicalUrl,
            languages: {
                ru: `${BASE_URL}/ru/blog/${slug}`,
                uz: `${BASE_URL}/uz/blog/${slug}`,
                en: `${BASE_URL}/en/blog/${slug}`,
                "x-default": `${BASE_URL}/ru/blog/${slug}`,
            },
        },
        openGraph: {
            title: blog.seoTitle || blog.title,
            description: blog.seoDescription || blog.subtitle || "",
            url: canonicalUrl,
            type: "article",
            publishedTime: blog.createdAt,
            modifiedTime: blog.updatedAt,
            authors: blog.author
                ? [`${blog.author.firstName} ${blog.author.lastName}`]
                : undefined,
            images: [{ url: ogImage, width: 1200, height: 630, alt: blog.title }],
            siteName: "Yoldosh",
            locale,
        },
        twitter: {
            card: "summary_large_image",
            title: blog.seoTitle || blog.title,
            description: blog.seoDescription || blog.subtitle || "",
            images: [ogImage],
        },
    };
}

export default async function BlogSlugPage({ params }: Props) {
    const { locale, slug } = await params;
    const blog = await getBlog(slug, locale);

    // JSON-LD — Article schema для Google
    const articleJsonLd = blog
        ? {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: blog.title,
            description: blog.subtitle || "",
            datePublished: blog.createdAt,
            dateModified: blog.updatedAt,
            author: blog.author
                ? {
                    "@type": "Person",
                    name: `${blog.author.firstName} ${blog.author.lastName}`,
                }
                : { "@type": "Organization", name: "Yoldosh" },
            publisher: {
                "@type": "Organization",
                name: "Yoldosh",
                logo: { "@type": "ImageObject", url: `${BASE_URL}/assets/logo.svg` },
            },
            image: blog.coverImage
                ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000"}${blog.coverImage.replace(/^\/public/, "")}`
                : undefined,
            url: `${BASE_URL}/${locale}/blog/${slug}`,
            inLanguage: locale,
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
                item: `${BASE_URL}/${locale}`,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: locale === "ru" ? "Блог" : locale === "uz" ? "Blog" : "Blog",
                item: `${BASE_URL}/${locale}/blog`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: blog?.title ?? slug,
                item: `${BASE_URL}/${locale}/blog/${slug}`,
            },
        ],
    };

    return (
        <>
            {articleJsonLd && (
                <Script
                    id="article-jsonld"
                    type="application/ld+json"
                    strategy="beforeInteractive"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
                />
            )}
            <Script
                id="blog-breadcrumb-jsonld"
                type="application/ld+json"
                strategy="beforeInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className="bg-gray-100 min-h-screen">
                <BlogDetail slug={slug} />
            </div>
        </>
    );
}