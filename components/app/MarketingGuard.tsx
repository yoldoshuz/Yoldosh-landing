"use client";

import { ReactNode, useEffect } from "react";

import { usePathname, useRouter } from "@/app/i18n/routing";
import { useAuth } from "@/hooks/useAuth";

/**
 * Landing pages that stay reachable while signed in. Legal documents have to
 * be readable from inside the app (the settings screen links straight at
 * them), and the account-deletion page is a store-compliance requirement.
 */
const ALWAYS_PUBLIC = ["/privacy-policy", "/public-offer", "/delete-account"];

export const MarketingGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const exempt = ALWAYS_PUBLIC.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const shouldRedirect = isAuthenticated && !exempt;

  useEffect(() => {
    if (shouldRedirect) router.replace("/search");
  }, [shouldRedirect, router]);

  // Rendering the landing for a split second before the redirect lands would
  // be a visible flash of the wrong app, so hold the frame instead.
  if (shouldRedirect) return null;

  return <>{children}</>;
};
