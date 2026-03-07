"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, ChevronRight, Search } from "lucide-react";

import { Link } from "@/app/i18n/routing";
import { BASE_URL } from "@/lib/api";
import { usePublicBlogs } from "@/hooks/useBlog";

// Форматируем URL картинки (та же логика что в админке)
const formatImgUrl = (url?: string) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    let p = url;
    if (p.startsWith("/public/")) p = p.slice("/public".length);
    return `${BASE_URL}${p}`;
};

const formatDate = (dateString: string, locale: string) =>
    new Date(dateString).toLocaleDateString(
        locale === "ru" ? "ru-RU" : locale === "uz" ? "uz-UZ" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
    );

export const Blog = () => {
    const t = useTranslations("Pages.Blog");
    const locale = useLocale();

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const loaderRef = useRef<HTMLDivElement>(null);

    // Debounce поиска
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(search), 400);
        return () => clearTimeout(timer);
    }, [search]);

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
        usePublicBlogs(debouncedSearch || undefined);

    const blogs = data?.pages.flatMap((p: any) => p?.data?.blogs ?? []) ?? [];

    // Infinite scroll через IntersectionObserver
    useEffect(() => {
        if (!loaderRef.current) return;
        const obs = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting && hasNextPage) fetchNextPage(); },
            { threshold: 0.1 }
        );
        obs.observe(loaderRef.current);
        return () => obs.disconnect();
    }, [hasNextPage, fetchNextPage]);

    return (
        <section className="max-w-7xl mx-auto px-4 pt-12 pb-0">
            {/* Header */}
            <div className="mb-4">
                <h1 className="title-2 text-start!">
                    {t("title")}
                </h1>
                <p className="text-muted-foreground text-base">{t("subtitle")}</p>
            </div>

            {/* Search */}
            <div className="relative max-w-full mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background text-sm outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-2xl border bg-muted/30 animate-pulse h-80" />
                    ))}
                </div>
            ) : blogs.length === 0 ? (
                <div className="text-center py-24 text-muted-foreground">
                    {t("empty")}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog: any) => {
                        const img = formatImgUrl(blog.coverImage);
                        return (
                            <Link
                                key={blog.id}
                                href={`/blog/${blog.slug}` as any}
                                className="group flex flex-col rounded-2xl border bg-white dark:bg-neutral-900 overflow-hidden hover:shadow-lg hover:border-emerald-500 transition-all duration-300"
                            >
                                {/* Cover */}
                                <div className="relative h-48 bg-muted overflow-hidden shrink-0">
                                    {img ? (
                                        <Image
                                            src={img}
                                            alt={blog.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-5xl">
                                            📝
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col flex-1 p-5 gap-3">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <CalendarDays className="size-3.5" />
                                        {formatDate(blog.createdAt, locale)}
                                    </div>

                                    <h2 className="font-semibold text-lg leading-snug line-clamp-2 text-neutral-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                                        {blog.title}
                                    </h2>

                                    {blog.subtitle && (
                                        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
                                            {blog.subtitle}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium mt-auto">
                                        {t("readMore")}
                                        <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}

            {/* Infinite scroll loader */}
            <div ref={loaderRef} className="h-12 flex items-center justify-center mt-6">
                {isFetchingNextPage && (
                    <div className="size-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                )}
            </div>
        </section>
    );
};