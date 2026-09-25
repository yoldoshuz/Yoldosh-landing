"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, MoveRight, SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppTopBar } from "@/components/app/AppTopBar";
import { ErrorNote, formatDate, formatLongDate, Screen, Spinner, toDepartureDate } from "@/components/app/kit";
import {
  countFilters,
  EMPTY_FILTERS,
  SearchFilterSheet,
  type SearchFilters,
} from "@/components/app/sheets/SearchFilterSheet";
import { TripCard } from "@/components/app/TripCard";
import { useAppTripSearch } from "@/hooks/api/useAppTrips";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { apiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { TripSearchQuery } from "@/types/api";

interface Route {
  from: string;
  to: string;
  fromLat: number;
  fromLon: number;
  toLat: number;
  toLon: number;
  seats: number;
  date?: Date;
}

/** The days offered along the bottom, starting today. */
const DAY_CHIPS = 7;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const sameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();

const readRoute = (params: URLSearchParams): Route | null => {
  const num = (key: string) => {
    const value = Number(params.get(key));
    return Number.isFinite(value) && value !== 0 ? value : null;
  };

  const fromLat = num("from_lat");
  const fromLon = num("from_lon");
  const toLat = num("to_lat");
  const toLon = num("to_lon");
  if (fromLat == null || fromLon == null || toLat == null || toLon == null) return null;

  const raw = params.get("date");
  const parsed = raw ? new Date(`${raw}T00:00:00`) : null;
  const seats = Number(params.get("seats"));

  return {
    from: params.get("from") ?? "",
    to: params.get("to") ?? "",
    fromLat,
    fromLon,
    toLat,
    toLon,
    seats: Number.isFinite(seats) && seats > 0 ? seats : 1,
    date: parsed && !Number.isNaN(parsed.getTime()) ? parsed : undefined,
  };
};

/**
 * Search results as their own screen.
 *
 * They used to appear below the form, which meant a search pushed the thing
 * you searched with off the top and there was nothing to go "back" to. A route
 * in the URL also makes a search shareable and survives a reload.
 */
export const SearchResultsScreen = () => {
  const t = useTranslations("App");

  const [route, setRoute] = useState<Route | null>(null);
  const [day, setDay] = useState<Date | undefined>();
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Read off `location` rather than `useSearchParams`, which would opt every
  // route under the app shell out of static prerendering.
  useEffect(() => {
    const parsed = readRoute(new URLSearchParams(window.location.search));
    setRoute(parsed);
    setDay(parsed?.date ?? new Date());
  }, []);

  const query = useMemo<TripSearchQuery | null>(() => {
    if (!route) return null;
    const amenities = filters.amenities;
    return {
      from_latitude: route.fromLat,
      from_longitude: route.fromLon,
      to_latitude: route.toLat,
      to_longitude: route.toLon,
      departure_date: toDepartureDate(day),
      requested_seats: route.seats,
      // The API rejects sorting by price and time together, which is why the
      // sheet offers the four options as one exclusive choice.
      sort_by_price: filters.sort === "cheapest" || filters.sort === "expensive" ? filters.sort : undefined,
      sort_by_time: filters.sort === "earliest" || filters.sort === "latest" ? filters.sort : undefined,
      garage: filters.garage,
      conditioner: amenities.conditioner,
      smoking_allowed: amenities.smoking_allowed,
      door_pickup: amenities.door_pickup,
      food_stop: amenities.food_stop,
      // The one flag the endpoint takes as a string rather than a boolean.
      parcels_allowed: amenities.parcels_allowed ? "true" : undefined,
      limit: 10,
    };
  }, [route, day, filters]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useAppTripSearch(query);

  const trips = data?.pages.flatMap((p) => p.trips) ?? [];
  const activeFilters = countFilters(filters);

  const sentinelRef = useInfiniteScroll({
    hasNextPage,
    isFetching: isFetchingNextPage,
    onLoadMore: () => void fetchNextPage(),
  });

  const days = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: DAY_CHIPS }, (_, i) => new Date(today.getTime() + i * 86_400_000));
  }, []);

  const dayLabel = (date: Date, index: number) => {
    if (index === 0) return t("Search.Today");
    if (index === 1) return t("Search.Tomorrow");
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  };

  return (
    <>
      <AppTopBar title={t("Search.ResultsTitle")} variant="green" back="/search" />

      {/* What was searched for, and the way to narrow it. */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3 lg:max-w-5xl lg:px-8">
          <div className="min-w-0 flex-1">
            <p className="flex min-w-0 items-center gap-2 truncate text-[15px] text-ink">
              <span className="truncate">{route?.from || "—"}</span>
              <MoveRight className="size-4 shrink-0 text-ink-muted" />
              <span className="truncate">{route?.to || "—"}</span>
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {day ? formatDate(day) : ""}
              {route ? `, ${t("Search.SeatsCount", { count: route.seats })}` : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            aria-label={t("Search.Filters")}
            className="relative shrink-0 cursor-pointer rounded-full p-2 text-ink transition hover:bg-neutral-100"
          >
            <SlidersHorizontal className="size-6" />
            {activeFilters > 0 && (
              <span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                {activeFilters}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Room at the bottom for the floating day strip. */}
      <Screen className="pb-28 pt-4">
        <ErrorNote message={error ? apiErrorMessage(error, t("Search.Error")) : null} />

        {!route ? (
          <p className="py-16 text-center text-ink-muted">{t("Search.PickBothPoints")}</p>
        ) : isLoading ? (
          <Spinner />
        ) : trips.length === 0 ? (
          <div className="app-card p-8 text-center">
            <p className="font-bold text-ink">{t("Search.NoResults")}</p>
            <p className="mt-1 text-sm text-ink-muted">{t("Search.NoResultsText")}</p>
          </div>
        ) : (
          <>
            <h2 className="mb-3 text-[22px] font-bold text-ink">{formatLongDate(day)}</h2>
            <div className="space-y-3 lg:grid lg:grid-cols-2 lg:gap-3 lg:space-y-0">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} href={`/ride/${trip.id}`} variant="search" />
              ))}
            </div>

            {/*
              Endless scrolling rather than a button: results are ranked, so
              the next page is almost always wanted, and a tap between every
              ten trips is a toll on the one screen people browse longest. The
              sentinel sits below the list and pulls the next page in while it
              is still off-screen.
            */}
            {/* Needs real area: a zero-size element never reports as intersecting. */}
            <div ref={sentinelRef} aria-hidden className="h-4 w-full" />

            {isFetchingNextPage && (
              <div className="flex justify-center py-6">
                <Loader2 className="size-6 animate-spin text-brand-500" />
              </div>
            )}

            {!hasNextPage && trips.length > 0 && (
              <p className="py-6 text-center text-sm text-ink-muted">{t("Search.EndOfList")}</p>
            )}
          </>
        )}
      </Screen>

      {/*
        The day strip floats over the list rather than sitting above it: on a
        phone it is the control people reach for most, and keeping it in reach
        means never scrolling back to the top to change the date.
      */}
      <div data-app-bar className="pointer-events-none fixed inset-x-0 bottom-0 z-20 pb-[5.5rem] lg:static lg:pb-0">
        <div className="mx-auto w-full max-w-2xl px-4 lg:max-w-5xl lg:px-8 lg:pb-6">
          <div className="pointer-events-auto flex gap-2 overflow-x-auto rounded-full bg-white/95 p-1.5 shadow-[0_6px_24px_-8px_rgba(0,0,0,0.25)] backdrop-blur-sm [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {days.map((date, index) => {
              const active = day ? sameDay(day, date) : false;
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => setDay(date)}
                  className={cn(
                    "shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-sm font-semibold transition",
                    active ? "bg-brand-500 text-white" : "bg-white text-ink hover:bg-neutral-100"
                  )}
                >
                  {dayLabel(date, index)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <SearchFilterSheet open={filtersOpen} value={filters} onOpenChange={setFiltersOpen} onApply={setFilters} />
    </>
  );
};
