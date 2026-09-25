"use client";

import {
  BadgeCheck,
  Briefcase,
  Cigarette,
  DoorOpen,
  History,
  Snowflake,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { UserAvatar } from "@/components/app/UserAvatar";
import { cn } from "@/lib/utils";
import type { AppTrip } from "@/types/api";
import { formatTripTime, isNegotiablePrice } from "./kit";

const priceOf = (trip: AppTrip) =>
  trip.price?.final_price ?? trip.price?.driver_base_price ?? trip.price?.price_per_person ?? trip.price_per_person;

/**
 * Every amenity is always shown, in a fixed order — the row reads as a legend
 * of the trip's conditions, so a missing icon would be ambiguous (not offered,
 * or just not rendered?). Colour carries the answer: green yes, red no.
 */
const AMENITIES: { key: keyof AppTrip; icon: LucideIcon }[] = [
  { key: "parcels_allowed", icon: Briefcase },
  { key: "conditioner", icon: Snowflake },
  { key: "food_stop", icon: Utensils },
  { key: "door_pickup", icon: DoorOpen },
  { key: "smoking_allowed", icon: Cigarette },
];

/**
 * What the card announces at the top.
 *
 * A trip the viewer has booked is described by *their booking* ("Забронирован"),
 * not by the trip's own lifecycle — the trip being merely `CREATED` says nothing
 * about whether their seat is held.
 */
const statusOf = (trip: AppTrip) => {
  const booking = trip.bookings?.[0];
  if (booking?.status) {
    const tone =
      booking.status === "CONFIRMED"
        ? "text-brand-600"
        : booking.status === "PENDING"
          ? "text-amber-500"
          : booking.status === "FAILED"
            ? "text-danger"
            : "text-neutral-400";
    return { key: `BookingLabel.${booking.status}`, tone };
  }

  const tone =
    trip.status === "COMPLETED"
      ? "text-brand-600"
      : trip.status === "IN_PROGRESS"
        ? "text-blue-500"
        : trip.status === "CANCELED"
          ? "text-neutral-400"
          : "text-amber-500";
  return { key: `TripStatus.${trip.status}`, tone };
};

interface TripCardProps {
  trip: AppTrip;
  href?: string;
  /**
   * "activity" is the card in Поездки: it leads with the booking status and
   * closes with the seats left. "search" drops both — in a list of results
   * every trip is open, so the line said the same thing on every card — and
   * moves the amenities up under the car, where the design puts them.
   */
  variant?: "activity" | "search";
}

export const TripCard = ({ trip, href, variant = "activity" }: TripCardProps) => {
  const t = useTranslations("App");

  const from = trip.from_location?.city ?? trip.from_city ?? "—";
  const to = trip.to_location?.city ?? trip.to_city ?? "—";
  // Missing and "1 сум" both mean "ask the driver", so they collapse to one value.
  const price = priceOf(trip) ?? 0;
  const rating = trip.driver?.rating;
  const status = statusOf(trip);
  const isSearch = variant === "search";

  // `arrival_ts` is authoritative; duration is 0 on plenty of real trips.
  const arrival =
    trip.arrival_ts ??
    (trip.departure_ts && trip.duration
      ? new Date(new Date(trip.departure_ts).getTime() + trip.duration * 60_000).toISOString()
      : null);

  const amenities = (
    <div className="flex items-center gap-3">
      {AMENITIES.map(({ key, icon: Icon }) => (
        <Icon
          key={key}
          className={cn("size-[19px]", trip[key] ? "text-brand-500" : "text-danger/80")}
          strokeWidth={1.7}
          aria-label={t(`Trip.Features.${key}`)}
        />
      ))}
    </div>
  );

  const body = (
    <div className="rounded-[var(--radius-card)] border border-neutral-200 bg-white p-4 transition hover:border-brand-300 hover:shadow-[0_6px_20px_-8px_rgba(0,0,0,0.18)]">
      {!isSearch && (
        <p className={cn("mb-3 flex items-center gap-2 text-[15px] font-bold", status.tone)}>
          <History className="size-[18px]" strokeWidth={2.2} />
          {t(status.key)}
        </p>
      )}

      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <UserAvatar src={trip.driver?.avatar} name={trip.driver?.firstName} className="size-14" />
          {rating != null && (
            // Sits on the avatar rather than beside the name: the design reads
            // the driver as one object — face, score, badge.
            <span className="absolute -bottom-0.5 -right-0.5 rounded-full bg-brand-500 px-1.5 py-px text-[11px] font-bold text-white ring-2 ring-white">
              {rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="flex min-w-0 items-center gap-1 text-[17px] font-bold text-ink">
              <span className="truncate">{trip.driver?.firstName ?? "—"}</span>
              {trip.driver?.verified && <BadgeCheck className="size-4 shrink-0 fill-blue-500 text-white" />}
            </p>
            {/* Black, not green: it is a fact about the trip, not a call to act. */}
            <p className="shrink-0 text-[17px] font-bold text-ink">
              {isNegotiablePrice(price)
                ? t("Trip.Negotiable")
                : `${Math.round(price).toLocaleString("ru-RU")} ${t("Trip.Currency")}`}
            </p>
          </div>

          {trip.car && (
            <p className="truncate text-sm text-ink-muted">{`${trip.car.make ?? ""} ${trip.car.model ?? ""}`.trim()}</p>
          )}

          {isSearch && <div className="mt-2 flex justify-end">{amenities}</div>}
        </div>
      </div>

      <div
        className={cn(
          "flex items-start justify-between gap-3",
          isSearch ? "mt-3" : "mt-3 border-t border-neutral-100 pt-3"
        )}
      >
        {/* Route as a timeline: times on the left, pins joined by a dotted run. */}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="w-11 shrink-0 font-mono text-sm text-ink-muted">{formatTripTime(trip.departure_ts)}</span>
            <span className="size-3 shrink-0 rounded-full border-[3px] border-brand-500" />
            <span className="truncate text-[17px] font-medium text-ink">{from}</span>
          </div>

          <span aria-hidden className="ml-[3.6rem] block h-4 border-l-2 border-dotted border-neutral-300" />

          <div className="flex items-center gap-2.5">
            <span className="w-11 shrink-0 font-mono text-sm text-ink-muted">{formatTripTime(arrival)}</span>
            <span className="size-3 shrink-0 rounded-full border-[3px] border-danger" />
            <span className="truncate text-[17px] font-medium text-ink">{to}</span>
          </div>
        </div>

        {!isSearch && (
          <div className="flex shrink-0 flex-col items-end gap-2">
            {amenities}
            <p className="text-sm text-ink-muted">{t("Trip.SeatsLeft", { count: trip.seats_available })}</p>
          </div>
        )}
      </div>
    </div>
  );

  return href ? (
    <Link href={href as never} className="block">
      {body}
    </Link>
  ) : (
    body
  );
};
