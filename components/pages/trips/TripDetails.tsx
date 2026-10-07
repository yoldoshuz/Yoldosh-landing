"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { TripDetails } from "@/components/shared/trip/TripDetails";
import { Button } from "@/components/ui/button";
import { useTripDetails } from "@/hooks/useTrips";

export interface TripRouteInfo {
  fromName: string;
  toName: string;
  /** Canonical /routes slug, null when a city isn't in the catalog. */
  slug: string | null;
}

const FINISHED_STATUS = /COMPLET|CANCEL|FINISH|START|PROGRESS|DONE|ARCHIV/i;

/** A trip is closed once it has departed or the backend moved it past CREATED. */
export const isTripFinished = (trip: any) => {
  const dep = new Date(trip?.departure_ts).getTime();
  return (!isNaN(dep) && dep < Date.now()) || FINISHED_STATUS.test(String(trip?.status ?? ""));
};

const FinishedTripBanner = ({ trip, route }: { trip: any; route?: TripRouteInfo | null }) => {
  const t = useTranslations("Pages.Trips.Details");
  const locale = useLocale();

  const fromName = route?.fromName ?? trip.from_location?.city ?? "";
  const toName = route?.toName ?? trip.to_location?.city ?? "";
  const from = trip.from_location?.coordinates;
  const to = trip.to_location?.coordinates;

  const searchParams = new URLSearchParams({ from: fromName, to: toName, seats: "1" });
  if (from && to) {
    searchParams.set("from_lat", String(from.latitude));
    searchParams.set("from_lon", String(from.longitude));
    searchParams.set("to_lat", String(to.latitude));
    searchParams.set("to_lon", String(to.longitude));
  }

  return (
    <section className="max-w-4xl mx-auto mb-4 rounded-3xl bg-emerald-500 p-6 text-white">
      <h2 className="text-xl font-bold mb-1">{t("FinishedTitle")}</h2>
      <p className="text-white/90 mb-4">{t("FinishedText")}</p>
      <div className="flex flex-wrap gap-3">
        {route?.slug && (
          <a href={`/${locale}/routes/${route.slug}`}>
            <Button className="bg-white text-emerald-600 hover:bg-neutral-100 font-bold rounded-full px-6">
              {t("SimilarRoute", { from: fromName, to: toName })}
            </Button>
          </a>
        )}
        <a href={`/${locale}/trips?${searchParams.toString()}`}>
          <Button
            variant="outline"
            className="bg-transparent border-white text-white hover:bg-white/10 font-bold rounded-full px-6"
          >
            {t("FindTrips")}
          </Button>
        </a>
      </div>
    </section>
  );
};

export const TripDetailsPage = ({
  tripId,
  initialData,
  route,
}: {
  tripId: string;
  initialData?: unknown;
  route?: TripRouteInfo | null;
}) => {
  const router = useRouter();
  const { data, isLoading, error } = useTripDetails(tripId, initialData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="size-8 animate-spin text-emerald-500-500" />
      </div>
    );
  }

  if (error || !data?.data?.trip) {
    return (
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 size-4" />
          Back
        </Button>
        <div className="text-center text-red-500">Trip not found or error loading details.</div>
      </div>
    );
  }

  const trip = data.data.trip;
  const finished = isTripFinished(trip);

  return (
    <div className="px-4 py-8 bg-gray-100">
      {finished && <FinishedTripBanner trip={trip} route={route} />}
      <TripDetails trip={trip} finished={finished} />
    </div>
  );
};
