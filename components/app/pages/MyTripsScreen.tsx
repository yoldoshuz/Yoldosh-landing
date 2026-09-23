"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import { TripCard } from "@/components/app/TripCard";
import { EmptyState, formatLongDate, ILLUSTRATION, Screen, Spinner } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyActivity } from "@/hooks/api/useAppTrips";
import { useAuth } from "@/hooks/useAuth";

type Role = "passenger" | "driver";

export const MyTripsScreen = () => {
  const t = useTranslations("App");
  const { isDriver } = useAuth();
  const [role, setRole] = useState<Role>(isDriver ? "driver" : "passenger");

  return (
    <>
      <AppTopBar title={t("MyTrips.Title")} showLogo />
      <Screen>
        <Tabs value={role} onValueChange={(v) => setRole(v as Role)}>
          <TabsList className="h-12 w-full rounded-full bg-neutral-100 p-1">
            {(["passenger", "driver"] as Role[]).map((r) => (
              <TabsTrigger
                key={r}
                value={r}
                className="h-10 flex-1 rounded-full text-sm font-semibold data-[state=active]:bg-brand-500 data-[state=active]:text-white data-[state=active]:shadow-none"
              >
                {t(`MyTrips.${r === "driver" ? "AsDriver" : "AsPassenger"}`)}
              </TabsTrigger>
            ))}
          </TabsList>

          {(["passenger", "driver"] as Role[]).map((r) => (
            <TabsContent key={r} value={r} className="mt-4">
              <TripList role={r} />
            </TabsContent>
          ))}
        </Tabs>
      </Screen>
    </>
  );
};

const TripList = ({ role }: { role: Role }) => {
  const t = useTranslations("App");
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useMyActivity(role);
  const trips = data?.pages.flatMap((p) => p.trips) ?? [];

  if (isLoading) return <Spinner />;

  if (trips.length === 0) {
    return (
      <EmptyState
        className="py-16"
        illustration={ILLUSTRATION.noTrips}
        title={t("MyTrips.Empty")}
        action={
          <Button asChild className="h-13 w-full rounded-full bg-brand-500 text-base font-semibold hover:bg-brand-600">
            <Link href={role === "driver" ? "/publish" : "/search"}>
              {t(role === "driver" ? "Nav.Publish" : "Nav.Search")}
            </Link>
          </Button>
        }
      />
    );
  }

  // One section per departure day, newest first — matches the app's list.
  const groups = new Map<string, typeof trips>();
  for (const trip of [...trips].sort(
    (a, b) => new Date(b.departure_ts).getTime() - new Date(a.departure_ts).getTime()
  )) {
    const key = new Date(trip.departure_ts).toDateString();
    groups.set(key, [...(groups.get(key) ?? []), trip]);
  }

  return (
    <>
      <div className="space-y-6">
        {[...groups.entries()].map(([day, dayTrips]) => (
          <section key={day}>
            <h2 className="mb-3 text-lg font-bold text-ink">{formatLongDate(day)}</h2>
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
              {dayTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} href={`/ride/${trip.id}`} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button variant="outline" className="rounded-full" onClick={() => void fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? <Loader2 className="size-4 animate-spin" /> : t("LoadMore")}
          </Button>
        </div>
      )}
    </>
  );
};
