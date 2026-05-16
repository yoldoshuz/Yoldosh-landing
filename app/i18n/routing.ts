import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

// All localized pathnames use the same Latin canonical URL for every locale.
// Legacy Cyrillic / Uzbek-localized URLs are kept alive via 308 redirects
// configured in next.config.ts so accumulated link equity is preserved.
export const routing = defineRouting({
  locales: ["en", "ru", "uz"],
  defaultLocale: "ru",
  localePrefix: "always",
  pathnames: {
    "/": "/",
    "/trips": "/trips",
    "/trips/passengers/[passengerId]": "/trips/passengers/[passengerId]",
    "/trips/driver/[driverId]": "/trips/driver/[driverId]",
    "/trips/[tripId]": "/trips/[tripId]",
    "/about-us": "/about-us",
    "/public-offer": "/public-offer",
    "/privacy-policy": "/privacy-policy",
    "/delete-account": "/delete-account",
    "/routes/[route]": "/routes/[route]",
    "/for-drivers": "/for-drivers",
    "/for-passengers": "/for-passengers",
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
  },
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
