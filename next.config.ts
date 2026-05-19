import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* ===== Base ===== */
  reactStrictMode: true,
  compress: true,
  devIndicators: false,
  poweredByHeader: false,
  generateEtags: true,
  output: "standalone",

  turbopack: {},

  /* ===== Images ===== */
  images: {
    minimumCacheTTL: 60,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yoldosh.uz",
      },
      {
        protocol: "https",
        hostname: "api.yoldosh.uz",
      },
    ],
  },

  /* ===== Experimental ===== */
  experimental: {
    scrollRestoration: true,
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
    ],
  },

  /* ===== Headers (SEO + Security) =====
   *
   * Notes:
   *  - `X-XSS-Protection` is deliberately omitted. The header is
   *    deprecated across modern browsers (Chrome removed the XSS auditor
   *    entirely in M78) and its legacy `1; mode=block` value can introduce
   *    XSS vectors of its own in some edge cases. CSP/Trusted Types are
   *    the modern replacement.
   *  - `Cross-Origin-Opener-Policy` and `Cross-Origin-Resource-Policy`
   *    are set to defaults that improve isolation without breaking
   *    third-party widgets (Google Maps, Yandex.Metrika).
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
        ],
      },
      {
        // robots.txt, sitemap and llms.txt must not be aggressively cached
        // by intermediary CDNs — let our route handlers govern freshness.
        source: "/(robots.txt|sitemap.xml|sitemap-trips.xml|sitemap-blogs.xml|llms.txt)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=3600, must-revalidate" },
          { key: "X-Robots-Tag", value: "noindex" },
        ],
      },
      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:all*(svg|jpg|png|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /* ===== Redirects =====
   *
   * Legacy Cyrillic / Uzbek-localized pathnames are kept alive with 308
   * permanent redirects so previously indexed URLs are funneled into the
   * Latin canonical equivalents without losing accumulated SEO equity.
   *
   * Order matters: more specific paths come before generic ones.
   */
  async redirects() {
    return [
      // === Russian Cyrillic legacy URLs ===
      { source: "/ru/маршруты/:slug*", destination: "/ru/routes/:slug*", permanent: true },
      { source: "/ru/поездки/пассажиры/:id", destination: "/ru/trips/passengers/:id", permanent: true },
      { source: "/ru/поездки/водитель/:id", destination: "/ru/trips/driver/:id", permanent: true },
      { source: "/ru/поездки/:tripId", destination: "/ru/trips/:tripId", permanent: true },
      { source: "/ru/поездки", destination: "/ru/trips", permanent: true },
      { source: "/ru/о-нас", destination: "/ru/about-us", permanent: true },
      { source: "/ru/публичная-офферта", destination: "/ru/public-offer", permanent: true },
      { source: "/ru/политика-конфиденциальности", destination: "/ru/privacy-policy", permanent: true },
      { source: "/ru/удалить-аккаунт", destination: "/ru/delete-account", permanent: true },
      { source: "/ru/для-водителей", destination: "/ru/for-drivers", permanent: true },
      { source: "/ru/для-пассажиров", destination: "/ru/for-passengers", permanent: true },
      { source: "/ru/блог/:slug*", destination: "/ru/blog/:slug*", permanent: true },
      { source: "/ru/блог", destination: "/ru/blog", permanent: true },

      // === Uzbek legacy URLs ===
      { source: "/uz/yonalishlar/:slug*", destination: "/uz/routes/:slug*", permanent: true },
      { source: "/uz/safarlar/yolovchilar/:id", destination: "/uz/trips/passengers/:id", permanent: true },
      { source: "/uz/safarlar/haydovchi/:id", destination: "/uz/trips/driver/:id", permanent: true },
      { source: "/uz/safarlar/:tripId", destination: "/uz/trips/:tripId", permanent: true },
      { source: "/uz/safarlar", destination: "/uz/trips", permanent: true },
      { source: "/uz/biz-haqimizda", destination: "/uz/about-us", permanent: true },
      { source: "/uz/ommaviy-taklif", destination: "/uz/public-offer", permanent: true },
      { source: "/uz/maxfiylik-siyosati", destination: "/uz/privacy-policy", permanent: true },
      { source: "/uz/hisobni-ochirish", destination: "/uz/delete-account", permanent: true },
      { source: "/uz/haydovchilar-uchun", destination: "/uz/for-drivers", permanent: true },
      { source: "/uz/yolovchilar-uchun", destination: "/uz/for-passengers", permanent: true },

      // === Bare paths without locale prefix → default to /ru ===
      { source: "/маршруты/:slug*", destination: "/ru/routes/:slug*", permanent: true },
      { source: "/поездки", destination: "/ru/trips", permanent: true },
      { source: "/yonalishlar/:slug*", destination: "/uz/routes/:slug*", permanent: true },
      { source: "/safarlar", destination: "/uz/trips", permanent: true },
    ];
  },

  // Webpack оптимизации
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }
    return config;
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },

  /* ===== ENV ===== */
  env: {
    NEXT_PUBLIC_SITE_URL: "https://yoldosh.uz",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

/* ===== next-intl plugin ===== */
const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts");

export default withNextIntl(nextConfig);
