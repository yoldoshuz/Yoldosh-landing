"use client";

import { useMemo } from "react";

/**
 * Tiny haptic helper for the tab bar.
 *
 * `navigator.vibrate` is Android-only and absent on iOS Safari and every
 * desktop browser, so every call is guarded — a missing API is the normal case,
 * not an error. Durations are short enough to read as a tick rather than a buzz.
 */
export const useHaptic = () =>
  useMemo(() => {
    const vibrate = (pattern: number | number[]) => {
      if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
      try {
        navigator.vibrate(pattern);
      } catch {
        /* Blocked by the browser (no user gesture yet, or a user setting). */
      }
    };

    return {
      /** Moving between tabs. */
      selection: () => vibrate(8),
      /** A more consequential tap, e.g. opening the composer. */
      medium: () => vibrate(14),
    };
  }, []);
