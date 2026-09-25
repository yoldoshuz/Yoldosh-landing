"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Repeat2, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import { formatDate, isNegotiablePrice, Screen, SectionLabel } from "@/components/app/kit";
import { PlacePicker } from "@/components/app/PlacePicker";
import { UserAvatar } from "@/components/app/UserAvatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePopularTrips } from "@/hooks/useTrips";
import type { Place } from "@/lib/places";
import { cn } from "@/lib/utils";

const SEAT_OPTIONS = [1, 2, 3, 4, 5, 6];

/** The leaderboard is a teaser, not a listing — five rows is the whole point. */
const TOP_TRIPS = 5;

/** `YYYY-MM-DD`, built locally so the day cannot slide across a timezone. */
const toDayParam = (date?: Date) => {
  if (!date) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/**
 * The search form and the popular-routes teaser.
 *
 * Results are no longer spliced in underneath: submitting opens its own
 * screen, so the form is never pushed off the top and a search can be shared
 * or reopened from history as a URL.
 */
export const SearchScreen = () => {
  const t = useTranslations("App");
  const router = useRouter();
  const locale = useLocale();

  const [from, setFrom] = useState<Place | null>(null);
  const [to, setTo] = useState<Place | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [seats, setSeats] = useState(1);
  const [picking, setPicking] = useState<"from" | "to" | null>(null);

  const { data: popular } = usePopularTrips(true);
  const popularTrips = popular?.pages.flatMap((p: any) => p?.data?.trips ?? []) ?? [];

  const ready = Boolean(from?.lat && from?.lng && to?.lat && to?.lng);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const runSearch = () => {
    if (!ready) return;
    const params = new URLSearchParams({
      from: from!.name,
      from_lat: String(from!.lat),
      from_lon: String(from!.lng),
      to: to!.name,
      to_lat: String(to!.lat),
      to_lon: String(to!.lng),
      seats: String(seats),
    });
    const day = toDayParam(date);
    if (day) params.set("date", day);

    // A filled-in path the localized router cannot resolve through `pathnames`,
    // so the locale is prefixed by hand.
    router.push(`/${locale}/search/results?${params.toString()}`);
  };

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
              <PointButton
                value={from?.name}
                placeholder={t("Search.FromPlaceholder")}
                onClick={() => setPicking("from")}
              />
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
              <PointButton value={to?.name} placeholder={t("Search.ToPlaceholder")} onClick={() => setPicking("to")} />
              {/* Keeps the two rows the same width despite the swap button. */}
              <span aria-hidden className="size-9 shrink-0" />
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
                      <span className={cn(!date && "text-ink-muted")}>
                        {date ? formatDate(date) : t("Search.Today")}
                      </span>
                      <CalendarDays className="size-5 text-brand-500" />
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

          {/* Filters belong to the results, where there is something to filter. */}
          <Button
            onClick={runSearch}
            disabled={!ready}
            className="mt-4 h-13 w-full rounded-full bg-white text-base font-semibold text-brand-600 shadow-none hover:bg-white/90 disabled:bg-white/45 disabled:text-white/80 disabled:opacity-100 lg:bg-brand-500 lg:text-white lg:hover:bg-brand-600 lg:disabled:bg-neutral-300 lg:disabled:text-white"
          >
            {t("Search.Submit")}
          </Button>
        </div>
      </AppTopBar>

      <Screen className="pt-6">
        {popularTrips.length > 0 && (
          <>
            <SectionLabel>{t("Search.TopTrips")}</SectionLabel>
            <div className="app-card divide-y divide-neutral-100 overflow-hidden">
              {popularTrips.slice(0, TOP_TRIPS).map((trip: any, index: number) => (
                <Link
                  key={trip.id}
                  href={`/ride/${trip.id}` as never}
                  className="flex items-center gap-3 px-3 py-3 transition hover:bg-neutral-50 sm:px-4"
                >
                  {/* The podium is filled, the rest outlined — rank at a glance. */}
                  <span
                    className={cn(
                      "grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-bold",
                      index < 3 ? "bg-brand-500 text-white" : "bg-brand-50 text-brand-600"
                    )}
                  >
                    {index + 1}
                  </span>

                  <UserAvatar src={trip.driver?.avatar} name={trip.driver?.firstName} className="size-10" />

                  {/* `min-w-0` all the way down is what lets the two text rows
                      truncate instead of forcing the price off the card. */}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-semibold text-ink">
                      {trip.from_location?.city} - {trip.to_location?.city}
                    </span>
                    <span className="flex min-w-0 items-center gap-1 text-sm text-ink-muted">
                      <Star className="size-3.5 shrink-0 fill-star stroke-star" />
                      <span className="shrink-0">{(trip.driver?.rating ?? 0).toFixed(1)}</span>
                      <span className="truncate">· {trip.driver?.firstName}</span>
                    </span>
                  </span>

                  <span className="shrink-0 text-sm font-semibold text-brand-600">
                    {isNegotiablePrice(trip.price?.price_per_person)
                      ? t("Trip.Negotiable")
                      : Number(trip.price?.price_per_person).toLocaleString("ru-RU")}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </Screen>

      <PlacePicker
        open={picking !== null}
        title={picking === "to" ? t("Search.ToPlaceholder") : t("Search.FromPlaceholder")}
        initialValue={(picking === "to" ? to : from)?.name}
        onPick={(place) => (picking === "to" ? setTo(place) : setFrom(place))}
        onClose={() => setPicking(null)}
      />
    </>
  );
};

/** Looks like the text field it replaced; opens the full-screen picker. */
const PointButton = ({ value, placeholder, onClick }: { value?: string; placeholder: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-11 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-full bg-neutral-100 px-4 text-left transition hover:bg-neutral-200/70"
  >
    <MapPin className="size-4 shrink-0 text-neutral-400" />
    <span className={cn("min-w-0 flex-1 truncate text-sm font-medium", !value && "text-muted-foreground")}>
      {value || placeholder}
    </span>
  </button>
);
