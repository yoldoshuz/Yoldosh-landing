"use client";

import { useEffect } from "react";

import { authApi } from "@/hooks/api/useAuthApi";
import { createGuestId, getGuestId, setGuestId } from "@/lib/auth";

/**
 * Registers the visitor as a guest on their first load.
 *
 * The backend counts guests for traffic analytics and links one to the real
 * account when that device later verifies a phone number, so this runs for
 * everyone browsing the marketing site — not just people who reach the app.
 *
 * Deliberately fire-and-forget: a guest is a statistics nicety, and nothing on
 * the page should wait on it or break when the call fails.
 */
export const useGuestSession = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) return;

    // Already registered on this device — the id is reused, not regenerated,
    // or every reload would look like a brand-new visitor.
    const existing = getGuestId();
    if (existing) return;

    const guestId = createGuestId();
    let cancelled = false;

    void authApi
      .createGuest(guestId)
      .then((result) => {
        if (cancelled) return;
        // Trust the id the server echoes back: it may have de-duplicated.
        setGuestId(result?.guestId ?? guestId);
      })
      .catch(() => {
        /* Offline or the endpoint is down — try again on the next visit. */
      });

    return () => {
      cancelled = true;
    };
  }, [enabled]);
};
