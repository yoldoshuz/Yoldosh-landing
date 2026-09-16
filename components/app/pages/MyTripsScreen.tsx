"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import { TripCard } from "@/components/app/TripCard";
import { EmptyState, ILLUSTRATION, Screen, Spinner } from "@/components/app/kit";
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

  return (
    <>
      <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} href={`/ride/${trip.id}`} />
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
