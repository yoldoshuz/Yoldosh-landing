import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import axios from "axios";

import { API_URL } from "@/lib/api";

// Создаём отдельный инстанс с нужным Accept-Language
const blogAxios = (locale: string) =>
    axios.create({
        baseURL: API_URL,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            "Accept-Language": locale,
        },
    });

const blogApi = {
    getPublicBlogs: async (
        locale: string,
        params: { page?: number; limit?: number; search?: string }
    ) => {
        const cleaned = Object.fromEntries(
            Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== null)
        );
        const res = await blogAxios(locale).get("/blog", { params: cleaned });
        return res.data;
    },

    // countView=false — бэкенд не будет инкрементить (только SSR считает)
    getBlogBySlug: async (slug: string, locale: string) => {
        const res = await blogAxios(locale).get(`/blog/${slug}`, {
            params: { countView: "false" },
        });
        return res.data;
    },
};

export const usePublicBlogs = (search?: string) => {
    const locale = useLocale();

    return useInfiniteQuery({
        queryKey: ["blogs", "public", locale, search ?? ""],
        initialPageParam: 1,
        queryFn: async ({ pageParam }) =>
            blogApi.getPublicBlogs(locale, {
                page: pageParam as number,
                limit: 9,
                ...(search ? { search } : {}),
            }),
        getNextPageParam: (lastPage) => {
            const current = lastPage?.data?.currentPage;
            const total = lastPage?.data?.totalPages;
            if (!current || !total || current >= total) return undefined;
            return current + 1;
        },
        staleTime: 5 * 60 * 1000,
    });
};

export const useBlogBySlug = (slug: string) => {
    const locale = useLocale();

    return useQuery({
        // locale в ключе → при смене языка новый запрос с новым Accept-Language
        queryKey: ["blogs", "detail", slug, locale],
        queryFn: () => blogApi.getBlogBySlug(slug, locale),
        staleTime: 10 * 60 * 1000,
        enabled: !!slug,
    });
};