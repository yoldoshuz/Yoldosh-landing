"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { AppIcon } from "@/components/app/AppIcon";
import { AppTopBar } from "@/components/app/AppTopBar";
import { isNegotiablePrice, Screen, SectionLabel } from "@/components/app/kit";
import { isSearchReady, SearchFields, type SearchValue } from "@/components/app/SearchFields";
import { UserAvatar } from "@/components/app/UserAvatar";
import { Button } from "@/components/ui/button";
import { useBestTrips } from "@/hooks/api/useAppTrips";
import { cn } from "@/lib/utils";

/** The leaderboard is a teaser, not a listing — five rows is the whole point. */
const TOP_TRIPS = 5;

/** `YYYY-MM-DD`, built locally so the day cannot slide across a timezone. */
export const toDayParam = (date?: Date) => {
  if (!date) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

/** The results screen's URL for a search — shared with the "change search" sheet there. */
export const searchResultsUrl = (locale: string, value: SearchValue) => {
  const params = new URLSearchParams({
    from: value.from!.name,
    from_lat: String(value.from!.lat),
    from_lon: String(value.from!.lng),
    to: value.to!.name,
    to_lat: String(value.to!.lat),
    to_lon: String(value.to!.lng),
    seats: String(value.seats),
  });
  const day = toDayParam(value.date);
  if (day) params.set("date", day);

  // A filled-in path the localized router cannot resolve through `pathnames`,
  // so the locale is prefixed by hand.
  return `/${locale}/search/results?${params.toString()}`;
};

/**
 * The search form and the best-trips teaser.
 *
 * Results are no longer spliced in underneath: submitting opens its own
 * screen, so the form is never pushed off the top and a search can be shared
 * or reopened from history as a URL.
 */
export const SearchScreen = () => {
  const t = useTranslations("App");
  const router = useRouter();
  const locale = useLocale();

  const [search, setSearch] = useState<SearchValue>({ from: null, to: null, seats: 1 });
  const { data: bestTrips } = useBestTrips(TOP_TRIPS);

  const ready = isSearchReady(search);

  return (
    <>
      <AppTopBar variant="hero" showBell>
        <div className="mx-auto w-full max-w-2xl px-4 lg:max-w-5xl lg:px-8">
          {/* Side padding clears the bell floating in the corner. */}
          <h1 className="px-10 pb-5 pt-4 text-center text-2xl font-bold leading-snug text-white lg:px-0 lg:pb-6 lg:pt-0 lg:text-left lg:text-3xl lg:text-ink">
            {t("Search.HeroTitle")}
          </h1>

          <div className="app-card rounded-[26px] p-4 lg:p-6">
            <SearchFields value={search} onChange={setSearch} />
          </div>

          {/* Filters belong to the results, where there is something to filter. */}
          <Button
            onClick={() => ready && router.push(searchResultsUrl(locale, search))}
            disabled={!ready}
            className="mt-4 h-13 w-full rounded-full bg-white text-base font-semibold text-brand-600 shadow-none hover:bg-white/90 disabled:bg-neutral-100 disabled:text-neutral-400 disabled:opacity-100 lg:bg-brand-500 lg:text-white lg:hover:bg-brand-600 lg:disabled:bg-neutral-200"
          >
            {t("Search.Submit")}
          </Button>
        </div>
      </AppTopBar>

      <Screen className="pt-6">
        {bestTrips && bestTrips.length > 0 && (
          <>
            <SectionLabel>{t("Search.TopTrips")}</SectionLabel>
            <div className="app-card divide-y divide-neutral-100 overflow-hidden">
              {bestTrips.map((trip, index) => {
                // Read from the price object: the root price_per_person comes
                // back as a DECIMAL string, not a number.
                const price = trip.price?.final_price ?? trip.price?.price_per_person;
                return (
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

                    <UserAvatar src={trip.driver?.avatar} name={trip.driver?.firstName} className="size-11" />

                    {/* `min-w-0` all the way down is what lets the two text rows
                        truncate instead of forcing the price off the card. */}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink">
                        {trip.from_location?.city || trip.from_city || "—"} -{" "}
                        {trip.to_location?.city || trip.to_city || "—"}
                      </span>
                      <span className="flex min-w-0 items-center gap-1 text-sm text-ink-muted">
                        <AppIcon name="fill_star_ic" className="size-3.5" />
                        <span className="shrink-0">{(trip.driver?.rating ?? 0).toFixed(1)}</span>
                        <span className="truncate">· {trip.driver?.firstName}</span>
                      </span>
                    </span>

                    <span className="shrink-0 text-sm font-semibold text-brand-600">
                      {isNegotiablePrice(price)
                        ? t("Trip.Negotiable")
                        : `${Number(price).toLocaleString("ru-RU")} ${t("Trip.Currency")}`}
                    </span>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </Screen>
    </>
  );
};
