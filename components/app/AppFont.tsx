"use client";

import { useEffect } from "react";

/**
 * Extends the app's typeface to portalled UI.
 *
 * The shells carry `font-app` themselves, which covers everything rendered
 * inside them with no flash on first paint. Sheets, dialogs, selects and
 * dropdowns are portalled to `<body>` instead, outside that subtree — so the
 * class goes on the body too, for as long as an app screen is mounted. Those
 * only ever appear after an interaction, well past hydration, so moving this
 * one costs nothing visually.
 */
export const AppFont = () => {
  useEffect(() => {
    document.body.classList.add("font-app");
    return () => document.body.classList.remove("font-app");
  }, []);

  return null;
};
