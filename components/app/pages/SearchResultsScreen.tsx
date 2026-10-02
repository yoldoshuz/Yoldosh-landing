"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { AppIcon } from "@/components/app/AppIcon";
import { AppTopBar } from "@/components/app/AppTopBar";
import { ErrorNote, formatDate, formatLongDate, Screen, Spinner, toDepartureDate } from "@/components/app/kit";
import { searchResultsUrl } from "@/components/app/pages/SearchScreen";
import type { SearchValue } from "@/components/app/SearchFields";
import {
  countFilters,
  EMPTY_FILTERS,
  SearchFilterSheet,
  type SearchFilters,
} from "@/components/app/sheets/SearchFilterSheet";
import { SearchSheet } from "@/components/app/sheets/SearchSheet";
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

const toSearchValue = (route: Route | null, day?: Date): SearchValue => ({
  from: route ? { name: route.from, lat: route.fromLat, lng: route.fromLon } : null,
  to: route ? { name: route.to, lat: route.toLat, lng: route.toLon } : null,
  date: day,
  seats: route?.seats ?? 1,
});

const toRoute = (value: SearchValue): Route => ({
  from: value.from!.name,
  to: value.to!.name,
  fromLat: value.from!.lat!,
  fromLon: value.from!.lng!,
  toLat: value.to!.lat!,
  toLon: value.to!.lng!,
  seats: value.seats,
  date: value.date,
});

/**
 * Search results as their own screen.
 *
 * They used to appear below the form, which meant a search pushed the thing
 * you searched with off the top and there was nothing to go "back" to. A route
 * in the URL also makes a search shareable and survives a reload.
 */
export const SearchResultsScreen = () => {
  const t = useTranslations("App");
  const locale = useLocale();

  const [route, setRoute] = useState<Route | null>(null);
  const [day, setDay] = useState<Date | undefined>();
  const [filters, setFilters] = useState<SearchFilters>(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Read off `location` rather than `useSearchParams`, which would opt every
  // route under the app shell out of static prerendering.
  useEffect(() => {
    const parsed = readRoute(new URLSearchParams(window.location.search));
    setRoute(parsed);
    setDay(parsed?.date ?? new Date());
  }, []);

  /**
   * A new search from the sheet replaces this one in place. The URL follows
   * along — so a reload or a share still lands on what is shown — without a
   * navigation that would remount the screen and drop the filters.
   */
  const changeSearch = (next: SearchValue) => {
    setRoute(toRoute(next));
    setDay(next.date ?? new Date());
    window.history.replaceState(null, "", searchResultsUrl(locale, next));
  };

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
      // Larger than a screenful: forecast trips are dropped from each page
      // (see `realTrips`), so a page can shrink well below what was asked.
      limit: 20,
    };
  }, [route, day, filters]);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useAppTripSearch(query);

  const trips = data?.pages.flatMap((p) => p.trips) ?? [];
  const activeFilters = countFilters(filters);

  /*
    A page that was nothing but forecast trips arrives empty. The sentinel
    below the list is then still on screen, but an IntersectionObserver only
    reports *changes*, so it would never ask for the next page — the list
    would stop at a blank page with real trips still behind it.
  */
  const lastPage = data?.pages.at(-1);
  useEffect(() => {
    if (lastPage && lastPage.trips.length === 0 && hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [lastPage, hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  // Stable between renders: the sheet re-seeds its draft whenever this changes.
  const searchValue = useMemo(() => toSearchValue(route, day), [route, day]);

  // Still walking past empty pages counts as loading, not as "nothing found".
  const searching = isLoading || (trips.length === 0 && (hasNextPage || isFetchingNextPage));

  return (
    <>
      <AppTopBar title={t("Search.ResultsTitle")} variant="green" back="/search" titleAlign="start" />

      {/* What was searched for — tap it to change the search, or narrow it with filters. */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3 lg:max-w-5xl lg:px-8">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            disabled={!route}
            className="min-w-0 flex-1 cursor-pointer text-left"
          >
            <span className="flex min-w-0 items-center gap-2 text-[15px] text-ink">
              <span className="truncate">{route?.from || "—"}</span>
              <AppIcon name="arrow_right" className="size-4 text-ink" />
              <span className="truncate">{route?.to || "—"}</span>
            </span>
            <span className="mt-0.5 block text-xs text-ink-muted">
              {day ? formatDate(day) : ""}
              {route ? `, ${t("Search.SeatsCount", { count: route.seats })}` : ""}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            aria-label={t("Search.Filters")}
            className="relative shrink-0 cursor-pointer rounded-full p-2 text-ink transition hover:bg-neutral-100"
          >
            <AppIcon name="filter" className="size-7" />
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
        ) : searching ? (
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
        means never scrolling back to the top to change the date. The tab bar
        is hidden here, as in the mobile build, so the strip takes its place.
      */}
      <div data-app-bar className="app-tabbar-dock pointer-events-none fixed inset-x-0 bottom-0 z-20 lg:static lg:pb-0">
        <div className="mx-auto w-full max-w-2xl px-4 lg:max-w-5xl lg:px-8 lg:pb-6">
          <div className="pointer-events-auto flex gap-2 overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_6px_24px_-8px_rgba(0,0,0,0.25)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {days.map((date, index) => {
              const active = day ? sameDay(day, date) : false;
              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  onClick={() => setDay(date)}
                  className={cn(
                    "min-w-[5.5rem] shrink-0 cursor-pointer rounded-full px-5 py-3 text-sm font-semibold transition",
                    active ? "bg-brand-500 text-white" : "bg-neutral-100 text-ink hover:bg-neutral-200"
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
      <SearchSheet open={searchOpen} value={searchValue} onClose={() => setSearchOpen(false)} onSubmit={changeSearch} />
    </>
  );
};
