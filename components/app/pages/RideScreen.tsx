"use client";

import { useState } from "react";
import {
  BadgeCheck,
  Ban,
  Check,
  ChevronRight,
  Flag,
  Loader2,
  MessageCircle,
  MoreVertical,
  Package,
  PlayCircle,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import {
  ErrorNote,
  formatMoney,
  formatTripTime,
  isNegotiablePrice,
  Screen,
  SectionLabel,
  Spinner,
  StatusBadge,
  SuccessNote,
} from "@/components/app/kit";
import { ReportSheet } from "@/components/app/sheets/ReportSheet";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAppTrip, useCancelTrip, useCompleteTrip, useStartTrip, useTripBookings } from "@/hooks/api/useAppTrips";
import { useConfirmBooking, useCreateBooking, useRejectBooking } from "@/hooks/api/useBookings";
import { useCreateParcel } from "@/hooks/api/useParcels";
import { useAuth } from "@/hooks/useAuth";
import { useOpenChat } from "@/hooks/useOpenChat";
import { apiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { GeoPoint } from "@/types/api";

/** Opens the point on a map — the "Карта" link beside each stop. */
const mapHref = (point?: GeoPoint) =>
  point?.coordinates
    ? `https://www.google.com/maps/search/?api=1&query=${point.coordinates.latitude},${point.coordinates.longitude}`
    : null;

export const RideScreen = ({ tripId }: { tripId: string }) => {
  const t = useTranslations("App");
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

  const [seats, setSeats] = useState("1");
  const [cancelReason, setCancelReason] = useState("");
  const [reporting, setReporting] = useState(false);
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
          seatsBooked: Number(seats),
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
                className="ml-auto shrink-0 cursor-pointer rounded-full p-2 text-ink transition hover:bg-neutral-200/60"
              >
                <MoreVertical className="size-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-2xl">
              <DropdownMenuItem onSelect={() => setReporting(true)} className="cursor-pointer text-danger">
                <Flag className="size-4" />
                {t("Trip.Report")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      {/* The action bar is fixed to the bottom, so the column ends above it. */}
      <Screen className="space-y-4 pb-32">
        {trip.status !== "CREATED" && (
          <div className="flex justify-end">
            <StatusBadge status={trip.status} label={t(`TripStatus.${trip.status}`)} />
          </div>
        )}

        {/* ------------------------------------------------------- маршрут */}
        <div className="app-card overflow-hidden">
          <Stop
            time={formatTripTime(trip.departure_ts)}
            city={from?.city ?? trip.from_city}
            address={from?.address}
            href={mapHref(from)}
            mapLabel={t("Trip.Map")}
            tone="start"
          />
          <div className="mx-4 border-t border-neutral-200" />
          <Stop
            time={formatTripTime(arrival)}
            city={to?.city ?? trip.to_city}
            address={to?.address}
            href={mapHref(to)}
            mapLabel={t("Trip.Map")}
            tone="end"
          />
        </div>

        {/* -------------------------------------------------------- водитель */}
        {trip.driver && !isDriver && (
          <div className="app-card p-4">
            <button
              type="button"
              onClick={() => router.push(`/users/${trip.driver?.id}` as never)}
              className="flex w-full cursor-pointer items-center gap-3 text-left"
            >
              <UserAvatar src={trip.driver.avatar} name={trip.driver.firstName} className="size-14" />
              <span className="min-w-0 flex-1">
                <span className="flex min-w-0 items-center gap-1.5 text-lg font-bold text-ink">
                  <span className="truncate">{trip.driver.firstName ?? "—"}</span>
                  {trip.driver.verified && <BadgeCheck className="size-4 shrink-0 fill-blue-500 text-white" />}
                </span>
                <span className="mt-0.5 block text-sm text-ink-muted">
                  {t("Trip.RatingLabel", { value: (trip.driver.rating ?? 0).toFixed(1) })}
                </span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-ink-muted" />
            </button>

            <Button
              variant="outline"
              onClick={() => void message()}
              disabled={busy}
              className="mt-4 h-13 w-full rounded-2xl border-brand-400 text-base font-normal text-brand-600 hover:bg-brand-50 hover:text-brand-700"
            >
              <MessageCircle className="size-5" />
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
          <div className="app-card p-4">
            {passengers.length === 0 ? (
              <p className="py-2 text-center text-ink-muted">{t("Trip.NoPassengers")}</p>
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
                          <X className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <StatusBadge status={booking.status} label={t(`BookingStatus.${booking.status}`)} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
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
                  <PlayCircle className="size-4" />
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
                      <Ban className="size-4" />
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
                <MessageCircle className="size-4" />
                {t("Trip.SendMessage")}
              </Button>
            )}
          </div>
        )}

        <ErrorNote message={error} />
        <SuccessNote message={notice} />

        {/* Seats are only a choice while the trip can still be booked. */}
        {!isDriver && canAct && trip.seats_available > 1 && (
          <div className="app-card flex items-center justify-between gap-3 p-4">
            <span className="font-medium text-ink">{t("Trip.SeatsToBook")}</span>
            <Select value={seats} onValueChange={setSeats}>
              <SelectTrigger className="h-11! w-28 rounded-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: Math.max(1, trip.seats_available) }, (_, i) => i + 1).map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {!isDriver && canAct && trip.parcels_allowed && (
          <Button
            variant="outline"
            onClick={() => void sendParcel()}
            disabled={createParcel.isPending}
            className="h-12 w-full rounded-full"
          >
            <Package className="size-4" />
            {t("Trip.SendParcel", { price: formatMoney(trip.parcel_price ?? price) })}
          </Button>
        )}
      </Screen>

      {/* ----------------------------------------- price + primary action */}
      {!isDriver && canAct && (
        <div
          data-app-bar
          className="fixed inset-x-0 bottom-0 z-20 border-t border-neutral-200 bg-white/95 backdrop-blur-sm lg:static lg:border-0 lg:bg-transparent lg:backdrop-blur-none"
        >
          <div className="mx-auto w-full max-w-2xl px-4 pb-4 pt-3 safe-bottom lg:max-w-5xl lg:px-8 lg:pb-8">
            <div className="flex items-baseline justify-between gap-3 pb-2.5">
              <span className="text-ink-muted">{t("Trip.PriceLabel")}</span>
              <span className="text-lg font-bold text-ink">
                {negotiable ? t("Trip.Negotiable") : formatMoney(price, trip.price?.currency ?? t("Trip.Currency"))}
              </span>
            </div>
            <Button
              onClick={() => void book()}
              disabled={createBooking.isPending || trip.seats_available < 1}
              className="h-13 w-full rounded-2xl bg-brand-500 text-base font-semibold hover:bg-brand-600 disabled:bg-neutral-300 disabled:opacity-100"
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

      <ReportSheet tripId={tripId} open={reporting} onClose={() => setReporting(false)} />
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
  <div className="flex items-stretch gap-3 px-4 py-3.5">
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <span className="w-11 shrink-0 font-mono text-sm text-ink-muted">{time}</span>
      <span
        className={cn(
          "size-3.5 shrink-0 rounded-full border-[3px]",
          tone === "start" ? "border-brand-500" : "border-danger"
        )}
      />
      <span className="min-w-0">
        <span className="block truncate text-lg font-bold text-ink">{city ?? "—"}</span>
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
