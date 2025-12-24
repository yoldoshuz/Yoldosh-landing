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
    optimizeCss: true,
    scrollRestoration: true,
  },

  /* ===== Headers (SEO + Security) ===== */
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
          { key: "X-XSS-Protection", value: "1; mode=block" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
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
    ];
  },

  /* ===== SEO rewrites ===== */
  async rewrites() {
    return [
      { source: "/sitemap.xml", destination: "/api/sitemap" },
      { source: "/robots.txt", destination: "/api/robots" },
    ];
  },

  /* ===== Redirects ===== */
  async redirects() {
    return [
      {
        source: "/search",
        destination: "/trips",
        permanent: true,
      },
      {
        source: "/about",
        destination: "/about-us",
        permanent: true,
      },
    ];
  },

  /* ===== ENV ===== */
  env: {
    NEXT_PUBLIC_SITE_URL: "https://yoldosh.uz",
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

/* ===== next-intl plugin ===== */
const withNextIntl = createNextIntlPlugin("./app/i18n/requests.ts");

export default withNextIntl(nextConfig);
