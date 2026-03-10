"use client";

import Image from "next/image";
import { CalendarDays, ChevronLeft, Eye } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

import { Link } from "@/app/i18n/routing";
import { ScrollToTop } from "@/components/shared/widgets/ScrollToTop";
import { useBlogBySlug } from "@/hooks/useBlog";
import { BASE_URL } from "@/lib/api";

const formatImgUrl = (url?: string) => {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  let p = url;
  if (p.startsWith("/public/")) p = p.slice("/public".length);
  return `${BASE_URL}${p}`;
};

const formatDate = (dateString: string, locale: string) =>
  new Date(dateString).toLocaleDateString(locale === "ru" ? "ru-RU" : locale === "uz" ? "uz-UZ" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

interface Props {
  slug: string;
}

export const BlogDetail = ({ slug }: Props) => {
  const t = useTranslations("Pages.Blog");
  const locale = useLocale();
  const { data, isLoading, isError } = useBlogBySlug(slug);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-8 bg-muted rounded w-3/4" />
        <div className="h-64 bg-muted rounded-2xl" />
        <div className="space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`h-4 bg-muted rounded ${i % 3 === 2 ? "w-2/3" : "w-full"}`} />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <p className="text-2xl font-bold mb-4">404</p>
        <p className="text-muted-foreground mb-8">{t("notFound")}</p>
        <Link
          href={"/blog" as any}
          className="text-emerald-600 font-medium hover:underline flex items-center justify-center gap-1"
        >
          <ChevronLeft className="size-4" /> {t("backToList")}
        </Link>
      </div>
    );
  }

  const blog = data.data;
  const img = formatImgUrl(blog.coverImage);

  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      {/* Back */}
      <Link
        href={"/blog" as any}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-emerald-600 transition-colors mb-8"
      >
        <ChevronLeft className="size-4" /> {t("backToList")}
      </Link>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <CalendarDays className="size-3.5" />
          {formatDate(blog.createdAt, locale)}
        </span>
        <span className="flex items-center gap-1">
          <Eye className="size-3.5" />
          {blog.views ?? 0}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white leading-tight mb-3">
        {blog.title}
      </h1>

      {/* Subtitle */}
      {blog.subtitle && (
        <p className="text-base text-justify text-muted-foreground mb-8 leading-relaxed">{blog.subtitle}</p>
      )}

      {/* Cover */}
      {img && (
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-10">
          <Image
            src={img}
            alt={blog.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </div>
      )}

      {/* Markdown Content */}
      {blog.content && (
        <div className="mx-auto max-w-3xl">
          <article
            className="prose dark:prose-invert max-w-none wrap-break-word
                            prose-headings:font-bold
                            prose-a:text-emerald-600
                            prose-img:rounded-xl
                            prose-pre:rounded-xl"
          >
            <Markdown
              remarkPlugins={[remarkGfm, remarkMath, remarkBreaks]}
              rehypePlugins={[rehypeKatex, rehypeHighlight]}
              components={{
                img: ({ src, alt }) => {
                  const formatted = formatImgUrl(src as string) ?? src ?? "";
                  return <img src={formatted} alt={alt ?? ""} className="rounded-xl shadow-md max-w-full" />;
                },
              }}
            >
              {blog.content}
            </Markdown>
          </article>
        </div>
      )}
      <ScrollToTop />
    </article>
  );
};
