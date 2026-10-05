"use client";

import { ReactNode, useEffect } from "react";
import { usePathname as useRawPathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useLocale } from "next-intl";

import { useRouter } from "@/app/i18n/routing";
import { useAuth } from "@/hooks/useAuth";

/**
 * Client-side gate for the app shell. The access token lives in localStorage,
 * which middleware cannot read, so the redirect happens here — the app routes
 * are `noindex` and carry no SSR-rendered private data, so there is nothing to
 * leak while this resolves.
 */
export const AuthGuard = ({ children }: { children: ReactNode }) => {
  /*
    Gated on reading the token, not on `/user/me` coming back. Waiting for the
    profile put a full round trip — two when the token needed refreshing — in
    front of every screen's own requests: a search sat on a spinner for the
    profile before it even asked for trips. A dead token still lands on
    /login, through the 401 handler, a moment later.
  */
  const { isAuthenticated, isRestoring: isLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  // next-intl's `usePathname` hands back the *template* (`/ride/[tripId]`),
  // which is useless as a redirect target. The raw one is concrete, so take
  // that and strip the locale prefix the localized router will re-add.
  const rawPathname = useRawPathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const pathname = rawPathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";
      // Carry the query along too — a deep link like /ride/<id>?seats=2 has to
      // survive the round trip through /login. Read straight off `location`
      // rather than `useSearchParams`, which would opt every app route out of
      // static prerendering unless the whole shell sat behind a Suspense
      // boundary; this effect is client-only anyway.
      const query = window.location.search;
      const next = `${pathname}${query}`;
      router.replace({ pathname: "/login", query: { next } });
    }
  }, [isAuthenticated, isLoading, rawPathname, locale, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen grid place-items-center">
        <Loader2 className="size-7 animate-spin text-emerald-500" />
      </div>
    );
  }

  return <>{children}</>;
};
