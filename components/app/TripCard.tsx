"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { AppIcon, type AppIconName } from "@/components/app/AppIcon";
import { UserAvatar } from "@/components/app/UserAvatar";
import { cn } from "@/lib/utils";
import type { AppTrip } from "@/types/api";
import { formatTripTime, fullName, isNegotiablePrice } from "./kit";

const priceOf = (trip: AppTrip) =>
  trip.price?.final_price ?? trip.price?.driver_base_price ?? trip.price?.price_per_person ?? trip.price_per_person;

export type AmenityKey = "garage" | "conditioner" | "food_stop" | "door_pickup" | "smoking_allowed";

/**
 * The trip's conditions in the mobile build's order and with its icons. The
 * suitcase is the trunk — how much room is left for luggage — not parcels.
 */
export const AMENITIES: { key: AmenityKey; icon: AppIconName }[] = [
  { key: "garage", icon: "suitcase" },
  { key: "conditioner", icon: "conditioner" },
  { key: "food_stop", icon: "food" },
  { key: "door_pickup", icon: "door" },
  { key: "smoking_allowed", icon: "smoke" },
];

/**
 * Green is a yes, red a no; the trunk has a middle state, in amber. Returns
 * the message key of the answer as well, for the spelled-out list on the
 * trip screen.
 */
export const amenityState = (trip: AppTrip, key: AmenityKey) => {
  if (key === "garage") {
    const garage = trip.garage ?? "EMPTY";
    return {
      tone: garage === "EMPTY" ? "text-brand-500" : garage === "HALF_EMPTY" ? "text-amber-500" : "text-danger",
      valueKey: `Trip.AmenityValue.garage.${garage}`,
    };
  }
  const on = Boolean(trip[key]);
  return { tone: on ? "text-brand-500" : "text-danger", valueKey: `Trip.AmenityValue.${key}.${on ? "yes" : "no"}` };
};

/**
 * The verified tick next to a driver's name.
 *
 * Every driver reaches the app through a confirmed phone number, and the
 * mobile build marks all of them — the trip endpoints do not even send a
 * `verified` flag. So the tick shows unless the API explicitly says otherwise.
 */
export const isVerifiedDriver = (driver?: { verified?: boolean } | null) =>
  Boolean(driver) && driver?.verified !== false;

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

const TripCardBase = ({ trip, href, variant = "activity" }: TripCardProps) => {
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
      {AMENITIES.map(({ key, icon }) => (
        <AppIcon
          key={key}
          name={icon}
          className={cn("size-6", amenityState(trip, key).tone)}
          label={t(`Trip.Amenity.${key}`)}
        />
      ))}
    </div>
  );

  const body = (
    <div className="rounded-[26px] bg-white p-4 shadow-[0_2px_14px_-6px_rgba(0,0,0,0.14)] transition hover:shadow-[0_8px_24px_-10px_rgba(0,0,0,0.22)]">
      {!isSearch && (
        <p className={cn("mb-3 flex items-center gap-2 text-[15px] font-bold", status.tone)}>
          <AppIcon name="in_progress" className="size-[18px]" />
          {t(status.key)}
        </p>
      )}

      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <UserAvatar src={trip.driver?.avatar} name={trip.driver?.firstName} className="size-14" />
          {rating != null && (
            // Sits on the avatar rather than beside the name: the design reads
            // the driver as one object — face, score, badge.
            <span className="absolute -bottom-1 -right-1 rounded-full bg-[#41B06E] px-1.5 py-px text-[11px] text-white ring-2 ring-white">
              {rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="flex min-w-0 items-center gap-1.5 pt-1 text-[16px] text-ink">
              <span className="truncate">{fullName(trip.driver) || "—"}</span>
              {isVerifiedDriver(trip.driver) && (
                <AppIcon name="verified" className="size-[18px]" label={t("Trip.Verified")} />
              )}
            </p>
            {/* Black, not green: it is a fact about the trip, not a call to act. */}
            <p className="shrink-0 text-[19px] font-bold text-ink">
              {isNegotiablePrice(price)
                ? t("Trip.Negotiable")
                : `${Math.round(price).toLocaleString("ru-RU")} ${t("Trip.Currency")}`}
            </p>
          </div>

          {trip.car && (
            <p className="truncate text-sm text-ink-muted">{`${trip.car.make ?? ""} ${trip.car.model ?? ""}`.trim()}</p>
          )}

          {isSearch && <div className="mt-3 flex justify-end">{amenities}</div>}
        </div>
      </div>

      <div
        className={cn(
          "flex items-start justify-between gap-3",
          isSearch ? "mt-3" : "mt-3 border-t border-neutral-100 pt-3"
        )}
      >
        {/* Route as a timeline: times on the left, pins joined by a dashed run. */}
        <div className="grid min-w-0 grid-cols-[auto_auto_1fr] items-center gap-x-2.5">
          <span className="text-sm text-ink">{formatTripTime(trip.departure_ts)}</span>
          <AppIcon name="location_iconG" className="h-[18px] w-4" />
          <span className="truncate text-[19px] text-ink">{from}</span>

          <span aria-hidden />
          <span aria-hidden className="mx-auto block h-4 border-l border-dashed border-neutral-400" />
          <span aria-hidden />

          <span className="text-sm text-ink">{formatTripTime(arrival)}</span>
          <AppIcon name="location_iconR" className="h-[18px] w-4" />
          <span className="truncate text-[19px] text-ink">{to}</span>
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

/*
  Memoised: the results list re-renders on every page that arrives and on
  every day switch, and without this each of those re-rendered every card —
  five icons and an avatar apiece — for rows whose data had not changed.
*/
export const TripCard = memo(TripCardBase);
