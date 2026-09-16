"use client";

import { Armchair, CalendarClock, MoveRight, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import type { AppTrip } from "@/types/api";
import { formatDateTime, StatusBadge } from "./kit";
import { UserAvatar } from "./UserAvatar";

const priceOf = (trip: AppTrip) =>
  trip.price?.final_price ?? trip.price?.driver_base_price ?? trip.price?.price_per_person ?? trip.price_per_person;

export const TripCard = ({ trip, href }: { trip: AppTrip; href?: string }) => {
  const t = useTranslations("App");

  const from = trip.from_location?.city ?? trip.from_city ?? "—";
  const to = trip.to_location?.city ?? trip.to_city ?? "—";
  const price = priceOf(trip);

  const body = (
    <div className="app-card p-4 transition hover:shadow-[0_6px_20px_-6px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <p className="flex min-w-0 items-center gap-2 font-bold text-ink">
          <span className="truncate">{from}</span>
          <MoveRight className="size-4 shrink-0 text-brand-500" />
          <span className="truncate">{to}</span>
        </p>
        <StatusBadge status={trip.status} label={t(`TripStatus.${trip.status}`)} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <CalendarClock className="size-4" />
          {formatDateTime(trip.departure_ts)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Armchair className="size-4" />
          {t("Trip.SeatsLeft", { count: trip.seats_available })}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-neutral-100 pt-3">
        {trip.driver ? (
          <span className="flex min-w-0 items-center gap-2">
            <UserAvatar src={trip.driver.avatar} name={trip.driver.firstName} className="size-9" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-ink">{trip.driver.firstName ?? "—"}</span>
              {trip.driver.rating != null && (
                <span className="flex items-center gap-1 font-mono text-[11px] text-star">
                  <Star className="size-3 fill-star stroke-star" />
                  {trip.driver.rating.toFixed(1)}
                </span>
              )}
            </span>
          </span>
        ) : (
          <span className="text-sm text-ink-muted">
            {trip.car ? `${trip.car.make ?? ""} ${trip.car.model ?? ""}`.trim() : ""}
          </span>
        )}

        <span className="shrink-0 font-bold text-brand-600">
          {price === 1 ? t("Trip.Negotiable") : `${Math.round(price ?? 0).toLocaleString("ru-RU")} ${t("Trip.Currency")}`}
        </span>
      </div>
    </div>
  );

  return href ? (
    <Link href={href as any} className="block">
      {body}
    </Link>
  ) : (
    body
  );
};
