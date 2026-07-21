"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

declare global {
    interface Window {
        ym?: (...args: any[]) => void;
    }
}

const COUNTER_ID = 105993566;

export default function YandexMetrika() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!window.ym) return;

        const url =
            pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

        window.ym(COUNTER_ID, "hit", url, {
            referer: document.referrer,
            title: document.title,
        });
    }, [pathname, searchParams]);

    return null;
}