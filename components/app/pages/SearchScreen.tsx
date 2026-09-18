"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowUpDown, CalendarDays, Loader2, Repeat2, SlidersHorizontal, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import { UserAvatar } from "@/components/app/UserAvatar";
import { TripCard } from "@/components/app/TripCard";
import { ErrorNote, formatDate, Screen, SectionLabel, Spinner, toDepartureDate } from "@/components/app/kit";
import { CityAutocomplete } from "@/components/shared/trip/CityAutocomplete";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAppTripSearch } from "@/hooks/api/useAppTrips";
import { usePopularTrips } from "@/hooks/useTrips";
import { apiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { GarageStatus, TripSearchQuery } from "@/types/api";

interface Point {
  name: string;
  lat?: number;
  lng?: number;
}

const BOOL_FILTERS = ["conditioner", "smoking_allowed", "door_pickup", "food_stop"] as const;
type BoolFilter = (typeof BOOL_FILTERS)[number];

const SEAT_OPTIONS = [1, 2, 3, 4, 5, 6];

/** Reads a route handed over in the query string (see the landing's search). */
const readSearchParams = (params: URLSearchParams) => {
  const num = (key: string) => {
    const value = Number(params.get(key));
    return Number.isFinite(value) && value !== 0 ? value : undefined;
  };

  const from: Point = { name: params.get("from") ?? "", lat: num("from_lat"), lng: num("from_lon") };
  const to: Point = { name: params.get("to") ?? "", lat: num("to_lat"), lng: num("to_lon") };

  const rawDate = params.get("date");
  const parsed = rawDate ? new Date(rawDate) : undefined;
  const date = parsed && !Number.isNaN(parsed.getTime()) ? parsed : undefined;

  const seats = Number(params.get("seats"));

  return {
    from,
    to,
    date,
    seats: Number.isFinite(seats) && seats > 0 ? seats : 1,
    complete: Boolean(from.lat && from.lng && to.lat && to.lng),
  };
};

export const SearchScreen = () => {
  const t = useTranslations("App");
  const searchParams = useSearchParams();

  // The landing hands its search over in the URL, so arriving from there (or
  // from a shared link) lands on results rather than an empty form.
  const initial = readSearchParams(searchParams);

  const [from, setFrom] = useState<Point>(initial.from);
  const [to, setTo] = useState<Point>(initial.to);
  const [date, setDate] = useState<Date | undefined>(initial.date);
  const [seats, setSeats] = useState(initial.seats);
  const [swapKey, setSwapKey] = useState(0);

  const [filters, setFilters] = useState<Partial<Record<BoolFilter, boolean>>>({});
  const [garage, setGarage] = useState<GarageStatus | undefined>();
  const [parcelsOnly, setParcelsOnly] = useState(false);
  const [sort, setSort] = useState<"cheapest" | "expensive" | "earliest" | "latest" | undefined>();

  // Stays null until submit, so the query never fires on half-filled input.
  const [query, setQuery] = useState<TripSearchQuery | null>(null);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, error } = useAppTripSearch(query);

  // Fire once on mount when the URL already carries a complete route.
  useEffect(() => {
    if (initial.complete) {
      setQuery({
        from_latitude: initial.from.lat!,
        from_longitude: initial.from.lng!,
        to_latitude: initial.to.lat!,
        to_longitude: initial.to.lng!,
        departure_date: toDepartureDate(initial.date),
        requested_seats: initial.seats,
        limit: 10,
      });
    }
    // Deliberately mount-only: later edits go through the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { data: popular } = usePopularTrips(!query);

  const ready = Boolean(from.lat && from.lng && to.lat && to.lng);

  const swap = () => {
    setFrom(to);
    setTo(from);
    // The autocomplete keeps its own text state, so remount it to show the swap.
    setSwapKey((k) => k + 1);
  };

  const runSearch = () => {
    if (!ready) return;
    setQuery({
      from_latitude: from.lat!,
      from_longitude: from.lng!,
      to_latitude: to.lat!,
      to_longitude: to.lng!,
      departure_date: toDepartureDate(date),
      requested_seats: seats,
      // The API rejects sorting by price and time together.
      sort_by_price: sort === "cheapest" || sort === "expensive" ? sort : undefined,
      sort_by_time: sort === "earliest" || sort === "latest" ? sort : undefined,
      ...filters,
      garage,
      parcels_allowed: parcelsOnly ? "true" : undefined,
      limit: 10,
    });
  };

  const trips = data?.pages.flatMap((p) => p.trips) ?? [];
  const total = data?.pages[0]?.total ?? 0;
  const popularTrips = popular?.pages.flatMap((p: any) => p?.data?.trips ?? []) ?? [];

  const activeFilterCount =
    Object.values(filters).filter(Boolean).length + (garage ? 1 : 0) + (parcelsOnly ? 1 : 0) + (sort ? 1 : 0);

  return (
    <>
      <AppTopBar variant="hero" showBell>
        <div className="mx-auto w-full max-w-2xl px-4 lg:max-w-5xl lg:px-8">
          <h1 className="pb-5 text-center text-2xl font-bold leading-snug text-white lg:pb-6 lg:text-left lg:text-3xl lg:text-ink">
            {t("Search.HeroTitle")}
          </h1>

          <div className="app-card p-4 lg:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-brand-500">
                <span className="size-2 rounded-full bg-brand-500" />
              </span>
              <div className="flex-1">
                <CityAutocomplete
                  key={`from-${swapKey}`}
                  placeholder={t("Search.FromPlaceholder")}
                  initialValue={from.name}
                  onCitySelected={(d) => setFrom({ name: d.name, lat: d.lat, lng: d.lng })}
                  className="h-11 rounded-full border-0 bg-neutral-100 px-4"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t("Search.Swap")}
                onClick={swap}
                className="size-9 shrink-0 rounded-full text-brand-500 hover:bg-brand-50"
              >
                <Repeat2 className="size-5" />
              </Button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-danger">
                <span className="size-2 rounded-full bg-danger" />
              </span>
              <div className="flex-1 pr-12">
                <CityAutocomplete
                  key={`to-${swapKey}`}
                  placeholder={t("Search.ToPlaceholder")}
                  initialValue={to.name}
                  onCitySelected={(d) => setTo({ name: d.name, lat: d.lat, lng: d.lng })}
                  className="h-11 rounded-full border-0 bg-neutral-100 px-4"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div>
                <p className="mb-1.5 font-semibold text-ink">{t("Search.Date")}</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-between rounded-2xl border-neutral-200 px-4 font-normal"
                    >
                      <span className={cn(!date && "text-ink-muted")}>{date ? formatDate(date) : t("Search.Today")}</span>
                      <CalendarDays className="size-5 text-ink-muted" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      captionLayout="dropdown"
                      disabled={{ before: new Date() }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <p className="mb-1.5 font-semibold text-ink">{t("Search.Passengers")}</p>
                <Select value={String(seats)} onValueChange={(v) => setSeats(Number(v))}>
                  <SelectTrigger className="h-12! w-full rounded-2xl border-neutral-200 px-4">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEAT_OPTIONS.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {t("Search.SeatsCount", { count: n })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button
              onClick={runSearch}
              disabled={!ready}
              className="h-13 flex-1 rounded-full bg-white text-base font-semibold text-brand-600 shadow-none hover:bg-white/90 disabled:bg-white/45 disabled:text-white/80 disabled:opacity-100 lg:bg-brand-500 lg:text-white lg:hover:bg-brand-600 lg:disabled:bg-neutral-300 lg:disabled:text-white"
            >
              {t("Search.Submit")}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label={t("Search.Filters")}
                  className="relative size-13 shrink-0 rounded-full border-0 bg-white/20 text-white hover:bg-white/30 hover:text-white lg:border lg:border-neutral-200 lg:bg-white lg:text-ink lg:hover:bg-neutral-100 lg:hover:text-ink"
                >
                  <SlidersHorizontal className="size-5" />
                  {activeFilterCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-white text-xs font-bold text-brand-600 lg:bg-brand-500 lg:text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-3xl">
                <SheetHeader>
                  <SheetTitle>{t("Search.Filters")}</SheetTitle>
                </SheetHeader>
                <div className="space-y-5 overflow-y-auto px-4 pb-8">
                  <div className="flex flex-wrap gap-2">
                    {BOOL_FILTERS.map((key) => (
                      <FilterChip
                        key={key}
                        active={Boolean(filters[key])}
                        onClick={() => setFilters((f) => ({ ...f, [key]: f[key] ? undefined : true }))}
                      >
                        {t(`Trip.Features.${key}`)}
                      </FilterChip>
                    ))}
                    <FilterChip active={parcelsOnly} onClick={() => setParcelsOnly((v) => !v)}>
                      {t("Trip.Features.parcels_allowed")}
                    </FilterChip>
                  </div>

                  <div>
                    <p className="mb-2 font-semibold text-ink">{t("Publish.Garage")}</p>
                    <div className="flex flex-wrap gap-2">
                      {(["FULL", "HALF_EMPTY", "EMPTY"] as GarageStatus[]).map((g) => (
                        <FilterChip key={g} active={garage === g} onClick={() => setGarage((c) => (c === g ? undefined : g))}>
                          {t(`Trip.Garage.${g}`)}
                        </FilterChip>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 flex items-center gap-1.5 font-semibold text-ink">
                      <ArrowUpDown className="size-4 text-ink-muted" />
                      {t("Search.SortLabel")}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(["cheapest", "expensive", "earliest", "latest"] as const).map((s) => (
                        <FilterChip key={s} active={sort === s} onClick={() => setSort((c) => (c === s ? undefined : s))}>
                          {t(`Search.Sort.${s}`)}
                        </FilterChip>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </AppTopBar>

      <Screen className="pt-6">
        <ErrorNote message={error ? apiErrorMessage(error, t("Search.Error")) : null} />

        {query ? (
          isLoading ? (
            <Spinner />
          ) : trips.length === 0 ? (
            <div className="app-card p-8 text-center">
              <p className="font-bold text-ink">{t("Search.NoResults")}</p>
              <p className="mt-1 text-sm text-ink-muted">{t("Search.NoResultsText")}</p>
            </div>
          ) : (
            <>
              <SectionLabel>{t("Search.Found", { count: total })}</SectionLabel>
              <div className="space-y-3">
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
          )
        ) : (
          popularTrips.length > 0 && (
            <>
              <SectionLabel>{t("Search.TopTrips")}</SectionLabel>
              <div className="app-card divide-y divide-neutral-100 overflow-hidden">
                {popularTrips.slice(0, 8).map((trip: any, index: number) => (
                  <Link
                    key={trip.id}
                    href={`/ride/${trip.id}` as any}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-neutral-50"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-brand-500 text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <UserAvatar src={trip.driver?.avatar} name={trip.driver?.firstName} className="size-11" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink">
                        {trip.from_location?.city} - {trip.to_location?.city}
                      </span>
                      {/* `min-w-0` + `truncate` on the name keeps a long driver
                          title (they are often a whole taxi company) on one
                          line instead of pushing the row three rows tall. */}
                      <span className="flex min-w-0 items-center gap-1.5 text-sm text-ink-muted">
                        <Star className="size-3.5 shrink-0 fill-star stroke-star" />
                        <span className="shrink-0">{(trip.driver?.rating ?? 0).toFixed(1)}</span>
                        <span className="truncate">· {trip.driver?.firstName}</span>
                      </span>
                    </span>
                    <span className="shrink-0 font-semibold text-brand-600">
                      {trip.price?.price_per_person === 1
                        ? t("Trip.Negotiable")
                        : `${Number(trip.price?.price_per_person ?? 0).toLocaleString("ru-RU")}`}
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )
        )}
      </Screen>
    </>
  );
};

const FilterChip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition",
      active ? "border-brand-500 bg-brand-500 text-white" : "border-neutral-200 bg-white text-neutral-600 hover:border-brand-300"
    )}
  >
    {children}
  </button>
);
