import type { Metadata } from "next";
import { use } from "react";

import { TripDetailsPage } from "@/components/pages/trips/TripDetails";

/**
 * Individual trip detail pages are inherently ephemeral — each trip ID
 * expires once the trip departs and the URL would 404 from the API soon
 * after. To avoid thin/short-lived pages diluting the crawl budget and
 * accumulating "soft 404" signals, we noindex them. `follow: true` keeps
 * internal links (driver profile, related trips) traversable so equity
 * still flows to evergreen targets like `/routes/[slug]`.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; tripId: string }>;
}): Promise<Metadata> {
  const { locale, tripId } = await params;
  return {
    title: "Trip details — Yoldosh",
    robots: {
      index: false,
      follow: true,
      googleBot: { index: false, follow: true },
    },
    alternates: {
      canonical: `https://yoldosh.uz/${locale}/trips/${tripId}`,
    },
  };
}

const Page = ({ params }: { params: Promise<{ tripId: string }> }) => {
  const { tripId } = use(params);

  return <TripDetailsPage tripId={tripId} />;
};

export default Page;
