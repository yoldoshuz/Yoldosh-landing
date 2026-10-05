"use client";

import { useState } from "react";
import { Check, Loader2, MoreVertical } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import { useRouter } from "@/app/i18n/routing";
import { AppIcon } from "@/components/app/AppIcon";
import { AppTopBar } from "@/components/app/AppTopBar";
import {
  ErrorNote,
  formatLongDate,
  formatMoney,
  formatTripTime,
  fullName,
  isNegotiablePrice,
  Screen,
  SectionLabel,
  Spinner,
  StatusBadge,
  SuccessNote,
} from "@/components/app/kit";
import { AMENITIES, amenityState, isVerifiedDriver } from "@/components/app/TripCard";
import { UserAvatar } from "@/components/app/UserAvatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { useAppTrip, useCancelTrip, useCompleteTrip, useStartTrip, useTripBookings } from "@/hooks/api/useAppTrips";
import { useConfirmBooking, useCreateBooking, useRejectBooking } from "@/hooks/api/useBookings";
import { useCreateParcel } from "@/hooks/api/useParcels";
import { useAuth } from "@/hooks/useAuth";
import { useOpenChat } from "@/hooks/useOpenChat";
import { apiErrorMessage } from "@/lib/api";
import { shareLink } from "@/lib/share";
import { cn } from "@/lib/utils";
import type { GeoPoint } from "@/types/api";

const INTL_LOCALE: Record<string, string> = { ru: "ru-RU", uz: "uz-Latn-UZ", en: "en-GB" };

/** Opens the point on a map — the "Карта" link beside each stop. */
const mapHref = (point?: GeoPoint) =>
  point?.coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${point.coordinates.latitude},${point.coordinates.longitude}`
    : null;

export const RideScreen = ({ tripId }: { tripId: string }) => {
  const t = useTranslations("App");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const openChat = useOpenChat();

  const { data: trip, isLoading } = useAppTrip(tripId);

  /*
    `GET /trip/{id}` does not return `driver_id` — only an expanded `driver`
    (the search listing is the one that carries the flat id). Reading just the
    flat field left the driver unidentified, so "Отправить сообщение" failed
    before it ever reached the API.
  */
  const driverId = trip?.driver_id ?? trip?.driver?.id;
  const isDriver = Boolean(user?.id && driverId && user.id === driverId) || Boolean(trip?.driver_price);
  const { data: bookings } = useTripBookings(isDriver ? tripId : undefined);

  const createBooking = useCreateBooking();
  const createParcel = useCreateParcel();
  const confirmBooking = useConfirmBooking();
  const rejectBooking = useRejectBooking();
  const startTrip = useStartTrip();
  const completeTrip = useCompleteTrip();
  const cancelTrip = useCancelTrip();

  const [cancelReason, setCancelReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  if (isLoading) {
    return (
      <>
        <AppTopBar title={t("Trip.Title")} back />
        <Spinner />
      </>
    );
  }

  if (!trip) {
    return (
      <>
        <AppTopBar title={t("Trip.Title")} back />
        <Screen>
          <p className="py-16 text-center text-ink-muted">{t("Trip.NotFound")}</p>
        </Screen>
      </>
    );
  }

  const from = trip.from_location;
  const to = trip.to_location;
  const price =
    trip.price?.final_price ?? trip.price?.driver_base_price ?? trip.price?.price_per_person ?? trip.price_per_person;
  const negotiable = isNegotiablePrice(price);
  const canAct = trip.status === "CREATED";

  const arrival =
    trip.arrival_ts ??
    (trip.departure_ts && trip.duration
      ? new Date(new Date(trip.departure_ts).getTime() + trip.duration * 60_000).toISOString()
      : null);

  const car = trip.car;
  const carName = `${car?.make ?? ""} ${car?.model ?? ""}`.trim();
  const carDetails = [car?.color, car?.plate_number ?? car?.gov_number].filter(Boolean).join(" · ");

  const passengers = (bookings ?? trip.bookings ?? []).filter((b) => b.status !== "CANCELLED");

  const run = async (fn: () => Promise<unknown>, successKey?: string) => {
    setError(null);
    setNotice(null);
    setBusy(true);
    try {
      await fn();
      if (successKey) setNotice(t(successKey));
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.Generic")));
    } finally {
      setBusy(false);
    }
  };

  const book = () =>
    run(
      async () => {
        if (!from?.coordinates || !to?.coordinates) throw new Error("missing coordinates");
        await createBooking.mutateAsync({
          tripId,
          // Base flow: pick up and drop off at the trip's own endpoints. A map
          // picker for custom points is the natural next iteration.
          pickup_latitude: from.coordinates.latitude,
          pickup_longitude: from.coordinates.longitude,
          dropoff_latitude: to.coordinates.latitude,
          dropoff_longitude: to.coordinates.longitude,
          // One seat, as in the mobile build — there is no picker on this screen.
          seatsBooked: 1,
        });
      },
      trip.booking_type === "REQUEST" ? "Trip.BookingRequested" : "Trip.BookingConfirmed"
    );

  const sendParcel = () =>
    run(async () => {
      if (!from?.coordinates || !to?.coordinates) throw new Error("missing coordinates");
      await createParcel.mutateAsync({
        tripId,
        pickup_latitude: from.coordinates.latitude,
        pickup_longitude: from.coordinates.longitude,
        dropoff_latitude: to.coordinates.latitude,
        dropoff_longitude: to.coordinates.longitude,
      });
    }, "Trip.ParcelRequested");

  /*
    The mobile build's one menu item. The link is the public trip page, which
    opens for anyone — a recipient without the app or outside Telegram still
    sees the trip rather than a sign-in wall.
  */
  const share = async () => {
    const route = `${from?.city ?? trip.from_city ?? ""} → ${to?.city ?? trip.to_city ?? ""}`;
    const outcome = await shareLink(`${window.location.origin}/${locale}/trips/${tripId}`, route);
    if (outcome === "copied") toast.success(t("Trip.LinkCopied"));
  };

  const message = () =>
    run(async () => {
      const participantId = isDriver ? (passengers[0]?.passengerId ?? passengers[0]?.passenger?.id) : driverId;
      if (!participantId) throw new Error("no counterpart");
      await openChat({ tripId, participantId });
    });

  return (
    <>
      <AppTopBar
        title={t("Trip.Title")}
        back
        trailing={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={t("Trip.More")}
                className="-mr-2 ml-auto shrink-0 cursor-pointer rounded-full p-2 text-ink transition hover:bg-neutral-200/60"
              >
                <MoreVertical className="size-6" strokeWidth={2.4} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-64 rounded-2xl p-1.5">
              <DropdownMenuItem
                onSelect={() => void share()}
                className="cursor-pointer gap-3 rounded-xl px-3 py-3 text-base text-brand-600 focus:text-brand-700"
              >
                <AppIcon name="share_icon" className="size-6" />
                {t("Trip.Share")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      {/* The booking button is fixed to the bottom, so the column ends above it. */}
      <Screen className="space-y-4 pb-32">
        {trip.status !== "CREATED" && (
          <div className="flex justify-end">
            <StatusBadge status={trip.status} label={t(`TripStatus.${trip.status}`)} />
          </div>
        )}

        {/* ------------------------------------------------------- маршрут */}
        <div>
          <SectionLabel className="mt-0">{formatLongDate(trip.departure_ts, INTL_LOCALE[locale])}</SectionLabel>
          <div className="app-card overflow-hidden rounded-[26px]">
            <Stop
              time={formatTripTime(trip.departure_ts)}
              city={from?.city ?? trip.from_city}
              address={from?.address}
              href={mapHref(from)}
              mapLabel={t("Trip.Map")}
              tone="start"
            />
            {/* Indented to the place names, so the rule reads as theirs. */}
            <div className="ml-[6.5rem] mr-4 border-t border-neutral-300" />
            <Stop
              time={formatTripTime(arrival)}
              city={to?.city ?? trip.to_city}
              address={to?.address}
              href={mapHref(to)}
              mapLabel={t("Trip.Map")}
              tone="end"
            />
          </div>
        </div>

        {/* -------------------------------------------------------- водитель */}
        {trip.driver && !isDriver && (
          <div className="app-card rounded-[26px] p-4">
            <button
              type="button"
              onClick={() => router.push(`/users/${trip.driver?.id}` as never)}
              className="flex w-full cursor-pointer items-center gap-4 text-left"
            >
              <UserAvatar src={trip.driver.avatar} name={trip.driver.firstName} className="size-14" />
              <span className="min-w-0 flex-1">
                <span className="flex min-w-0 items-center gap-1.5 text-[17px] text-ink">
                  <span className="truncate">{fullName(trip.driver) || "—"}</span>
                  {isVerifiedDriver(trip.driver) && (
                    <AppIcon name="verified" className="size-[18px]" label={t("Trip.Verified")} />
                  )}
                </span>
                <span className="mt-1 block text-sm text-ink-muted">
                  {t("Trip.RatingLabel", { value: Number((trip.driver.rating ?? 0).toFixed(1)) })}
                </span>
              </span>
              <AppIcon name="right2" className="size-6 text-ink" />
            </button>

            <Button
              variant="outline"
              onClick={() => void message()}
              disabled={busy}
              className="mt-4 h-13 w-full rounded-full border-2 border-[#41B06E] text-base font-normal text-[#2f8a54] hover:bg-brand-50 hover:text-[#2f8a54]"
            >
              <AppIcon name="talkative" className="size-6" />
              {t("Trip.SendMessage")}
            </Button>
          </div>
        )}

        {/* ------------------------------------------ комментарий водителя */}
        {trip.comment && (
          <div>
            <SectionLabel className="mt-0">{t("Trip.DriverComment")}</SectionLabel>
            <div className="app-card p-4">
              <p className="whitespace-pre-wrap leading-relaxed text-ink">{trip.comment}</p>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------- машина */}
        <div>
          <SectionLabel className="mt-0">{t("Trip.Car")}</SectionLabel>
          <div className="app-card p-4">
            <p className="text-lg font-bold text-ink">{carName || t("Trip.NotSpecified")}</p>
            <p className="mt-0.5 text-sm text-ink-muted">{carDetails || t("Trip.NotSpecified")}</p>
          </div>
        </div>

        {/* ------------------------------------------------------ пассажиры */}
        <div>
          <SectionLabel className="mt-0">{t("Trip.PassengersLabel")}</SectionLabel>
          <div className="app-card rounded-[26px] p-4">
            {passengers.length === 0 ? (
              <p className="py-5 text-center text-lg text-ink">{t("Trip.NoPassengers")}</p>
            ) : (
              <div className="divide-y divide-neutral-100">
                {passengers.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <UserAvatar
                        src={booking.passenger?.avatar}
                        name={booking.passenger?.firstName}
                        className="size-10"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{booking.passenger?.firstName ?? "—"}</p>
                        <p className="text-xs text-ink-muted">
                          {t("Trip.SeatsCount", { count: booking.seatsBooked })}
                          {!isNegotiablePrice(booking.totalPrice) && ` · ${formatMoney(booking.totalPrice)}`}
                        </p>
                      </div>
                    </div>

                    {isDriver && booking.status === "PENDING" ? (
                      <div className="flex shrink-0 gap-1">
                        <Button
                          size="icon"
                          aria-label={t("Trip.ConfirmBooking")}
                          className="size-9 rounded-full bg-brand-500 hover:bg-brand-600"
                          disabled={confirmBooking.isPending}
                          onClick={() => void run(() => confirmBooking.mutateAsync(booking.id))}
                        >
                          <Check className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          aria-label={t("Trip.RejectBooking")}
                          className="size-9 rounded-full"
                          disabled={rejectBooking.isPending}
                          onClick={() => void run(() => rejectBooking.mutateAsync({ bookingId: booking.id }))}
                        >
                          <AppIcon name="close" className="size-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <StatusBadge status={booking.status} label={t(`BookingStatus.${booking.status}`)} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* The price closes the passengers card, as in the mobile build. */}
            <div className="mt-4 flex items-baseline justify-between gap-3 pt-2">
              <span className="text-lg text-ink-muted">{t("Trip.PriceLabel")}</span>
              <span className="text-lg text-ink">
                {negotiable ? t("Trip.Negotiable") : formatMoney(price, t("Trip.Currency"))}
              </span>
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------- удобства */}
        <div className="app-card space-y-3.5 rounded-[26px] p-4">
          {AMENITIES.map(({ key, icon }) => {
            const state = amenityState(trip, key);
            return (
              <div key={key} className="flex items-center gap-3">
                <AppIcon name={icon} className={cn("size-6", state.tone)} />
                <span className="min-w-0 flex-1 text-[15px] text-ink-muted">{t(`Trip.Amenity.${key}`)}</span>
                <span className={cn("shrink-0 text-[15px]", state.tone)}>{t(state.valueKey)}</span>
              </div>
            );
          })}
        </div>

        {/* ---------------------------------------------- заработок водителя */}
        {isDriver && trip.driver_price && (
          <div className="app-card p-4">
            <SectionLabel className="mt-0">{t("Trip.Earnings")}</SectionLabel>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-muted">{t("Trip.Revenue")}</dt>
                <dd className="font-medium">{formatMoney(trip.driver_price.total_bookings_price)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-muted">
                  {t("Trip.Commission", { percent: trip.driver_price.commission?.percentage ?? 0 })}
                </dt>
                <dd className="font-medium text-danger">−{formatMoney(trip.driver_price.commission?.amount)}</dd>
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-2">
                <dt className="font-semibold">{t("Trip.Payout")}</dt>
                <dd className="font-bold">{formatMoney(trip.driver_price.driver_payout)}</dd>
              </div>
            </dl>
          </div>
        )}

        {/* ------------------------------------------------- driver actions */}
        {isDriver && (
          <div className="app-card space-y-3 p-4">
            <SectionLabel className="mt-0">{t("Trip.DriverTools")}</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {trip.status === "CREATED" && (
                <Button
                  onClick={() => void run(() => startTrip.mutateAsync(tripId))}
                  disabled={startTrip.isPending}
                  className="rounded-full bg-brand-500 hover:bg-brand-600"
                >
                  <AppIcon name="in_progress" className="size-4" />
                  {t("Trip.Start")}
                </Button>
              )}
              {trip.status === "IN_PROGRESS" && (
                <Button
                  onClick={() => void run(() => completeTrip.mutateAsync(tripId))}
                  disabled={completeTrip.isPending}
                  className="rounded-full bg-brand-500 hover:bg-brand-600"
                >
                  <Check className="size-4" />
                  {t("Trip.Complete")}
                </Button>
              )}
              {canAct && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="rounded-full text-danger hover:text-danger">
                      <AppIcon name="cancel" className="size-4" />
                      {t("Trip.Cancel")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("Trip.CancelReasonPrompt")}</AlertDialogTitle>
                    </AlertDialogHeader>
                    <Textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="min-h-24 rounded-2xl"
                    />
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-full">{t("Cancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={!cancelReason.trim()}
                        onClick={() =>
                          void run(() => cancelTrip.mutateAsync({ tripId, cancellationReason: cancelReason.trim() }))
                        }
                        className="rounded-full bg-danger hover:bg-danger/90"
                      >
                        {t("Send")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            {passengers.length > 0 && (
              <Button
                variant="outline"
                onClick={() => void message()}
                disabled={busy}
                className="h-12 w-full rounded-full"
              >
                <AppIcon name="talkative" className="size-5" />
                {t("Trip.SendMessage")}
              </Button>
            )}
          </div>
        )}

        <ErrorNote message={error} />
        <SuccessNote message={notice} />

        {!isDriver && canAct && trip.parcels_allowed && (
          <Button
            variant="outline"
            onClick={() => void sendParcel()}
            disabled={createParcel.isPending}
            className="h-12 w-full rounded-full"
          >
            <AppIcon name="suitcase" className="size-4" />
            {t("Trip.SendParcel", { price: formatMoney(trip.parcel_price ?? price) })}
          </Button>
        )}
      </Screen>

      {/*
        The primary action, floating over the end of the page. The price used
        to ride along in a white bar here; it now closes the passengers card,
        which is where the mobile build puts it, and the bar's empty band
        above the button went with it.
      */}
      {!isDriver && canAct && (
        <div
          data-app-bar
          className="pointer-events-none fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-app-bg via-app-bg/90 to-transparent pt-6 lg:static lg:bg-none lg:pt-0"
        >
          <div className="pointer-events-auto mx-auto w-full max-w-2xl px-4 pb-4 safe-bottom lg:max-w-5xl lg:px-8 lg:pb-8">
            <Button
              onClick={() => void book()}
              disabled={createBooking.isPending || trip.seats_available < 1}
              className="h-13 w-full rounded-full bg-gradient-to-r from-brand-500 to-[#41B06E] text-base font-semibold hover:from-brand-600 hover:to-brand-600 disabled:from-neutral-300 disabled:to-neutral-300 disabled:opacity-100"
            >
              {createBooking.isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                t(trip.booking_type === "REQUEST" ? "Trip.RequestBooking" : "Trip.BookNow")
              )}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * One end of the route: departure time, the coloured pin, the place, and a
 * link out to the map — the vertical rule before "Карта" is what separates
 * reading the stop from acting on it.
 */
const Stop = ({
  time,
  city,
  address,
  href,
  mapLabel,
  tone,
}: {
  time: string;
  city?: string | null;
  address?: string | null;
  href: string | null;
  mapLabel: string;
  tone: "start" | "end";
}) => (
  <div className="flex items-stretch gap-3 px-4">
    <div className="flex min-w-0 flex-1 items-center gap-3 py-4">
      <span className="w-11 shrink-0 text-sm text-ink">{time}</span>
      {/*
        The pin, and half of the dashed run joining it to the other stop:
        down from the departure pin, up into the arrival one. Drawn per stop
        so the run always meets the pins, whatever height the rows end up.
      */}
      <span className="relative flex w-5 shrink-0 items-center justify-center self-stretch">
        <span
          aria-hidden
          className={cn(
            "absolute left-1/2 -ml-px border-l-2 border-dashed border-neutral-300",
            tone === "start" ? "-bottom-4 top-1/2" : "-top-4 bottom-1/2"
          )}
        />
        <AppIcon name={tone === "start" ? "location_iconG" : "location_iconR"} className="relative h-6 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[19px] text-ink">{city ?? "—"}</span>
        {address && <span className="mt-0.5 block truncate text-xs text-ink-muted">{address}</span>}
      </span>
    </div>

    {href && (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex shrink-0 items-center border-l border-neutral-200 pl-4 text-sm text-ink transition hover:text-brand-600"
      >
        {mapLabel}
      </a>
    )}
  </div>
);
