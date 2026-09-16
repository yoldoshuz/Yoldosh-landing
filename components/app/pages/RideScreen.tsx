"use client";

import { useState } from "react";
import { Ban, Check, Flag, Loader2, MessageCircle, MoveRight, Package, PlayCircle, Star, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import { UserAvatar } from "@/components/app/UserAvatar";
import { ErrorNote, formatDateTime, formatMoney, Screen, SectionLabel, Spinner, StatusBadge, SuccessNote } from "@/components/app/kit";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  useAppTrip,
  useCancelTrip,
  useCompleteTrip,
  useReportTrip,
  useStartTrip,
  useTripBookings,
} from "@/hooks/api/useAppTrips";
import { useConfirmBooking, useCreateBooking, useRejectBooking } from "@/hooks/api/useBookings";
import { useStartChat } from "@/hooks/api/useChat";
import { useCreateParcel } from "@/hooks/api/useParcels";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/api";

const FEATURE_KEYS = ["conditioner", "smoking_allowed", "door_pickup", "food_stop", "max_two_back", "parcels_allowed"] as const;

export const RideScreen = ({ tripId }: { tripId: string }) => {
  const t = useTranslations("App");
  const router = useRouter();
  const { user } = useAuth();

  const { data: trip, isLoading } = useAppTrip(tripId);
  const isDriver = Boolean(user?.id && trip?.driver_id && user.id === trip.driver_id) || Boolean(trip?.driver_price);
  const { data: bookings } = useTripBookings(isDriver ? tripId : undefined);

  const createBooking = useCreateBooking();
  const createParcel = useCreateParcel();
  const startChat = useStartChat();
  const confirmBooking = useConfirmBooking();
  const rejectBooking = useRejectBooking();
  const startTrip = useStartTrip();
  const completeTrip = useCompleteTrip();
  const cancelTrip = useCancelTrip();
  const reportTrip = useReportTrip();

  const [seats, setSeats] = useState("1");
  const [cancelReason, setCancelReason] = useState("");
  const [reportText, setReportText] = useState("");
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
  const canAct = trip.status === "CREATED";

  const run = async (fn: () => Promise<unknown>, successKey?: string) => {
    setError(null);
    setNotice(null);
    try {
      await fn();
      if (successKey) setNotice(t(successKey));
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.Generic")));
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

  const openChat = () =>
    run(async () => {
      const participant2Id = isDriver ? bookings?.[0]?.passengerId : trip.driver_id;
      if (!participant2Id) throw new Error("no counterpart");
      const chat = await startChat.mutateAsync({ tripId, participant2Id });
      router.push(`/chats/${chat.id}` as any);
    });

  return (
    <>
      <AppTopBar title={t("Trip.Title")} back />
      <Screen className="space-y-3">
        <div className="app-card p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="flex min-w-0 items-center gap-2 text-xl font-bold text-ink">
              <span className="truncate">{from?.city ?? trip.from_city ?? "—"}</span>
              <MoveRight className="size-5 shrink-0 text-brand-500" />
              <span className="truncate">{to?.city ?? trip.to_city ?? "—"}</span>
            </p>
            <StatusBadge status={trip.status} label={t(`TripStatus.${trip.status}`)} />
          </div>

          <dl className="mt-4 grid gap-x-6 gap-y-2.5 text-sm sm:grid-cols-2">
            <Detail label={t("Trip.Departure")} value={formatDateTime(trip.departure_ts)} />
            <Detail label={t("Trip.Seats")} value={String(trip.seats_available)} />
            {trip.distance != null && <Detail label={t("Trip.Distance")} value={`${trip.distance} ${t("Trip.Km")}`} />}
            {trip.duration != null && (
              <Detail
                label={t("Trip.Duration")}
                value={`${Math.floor(trip.duration / 60)}${t("Trip.HoursShort")} ${trip.duration % 60}${t("Trip.MinutesShort")}`}
              />
            )}
            <Detail label={t("Trip.Price")} value={formatMoney(price, trip.price?.currency ?? "UZS")} strong />
            {trip.booking_type && (
              <Detail label={t("Trip.BookingType")} value={t(`Trip.BookingTypes.${trip.booking_type}`)} />
            )}
          </dl>

          {(from?.address || to?.address) && (
            <div className="mt-4 space-y-1.5 border-t border-neutral-100 pt-4 text-sm">
              {from?.address && (
                <p>
                  <span className="text-ink-muted">A: </span>
                  {from.address}
                </p>
              )}
              {to?.address && (
                <p>
                  <span className="text-ink-muted">B: </span>
                  {to.address}
                </p>
              )}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {FEATURE_KEYS.filter((key) => trip[key]).map((key) => (
              <span key={key} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                {t(`Trip.Features.${key}`)}
              </span>
            ))}
            {trip.garage && (
              <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                {t(`Trip.Garage.${trip.garage}`)}
              </span>
            )}
          </div>

          {trip.comment && <p className="mt-4 text-sm italic text-neutral-600">“{trip.comment}”</p>}
        </div>

        {trip.driver && !isDriver && (
          <div className="app-card flex items-center justify-between gap-3 p-4">
            <button
              type="button"
              onClick={() => router.push(`/users/${trip.driver?.id}` as any)}
              className="flex min-w-0 cursor-pointer items-center gap-3 text-left"
            >
              <UserAvatar src={trip.driver.avatar} name={trip.driver.firstName} className="size-12" />
              <span className="min-w-0">
                <span className="block truncate font-bold text-ink">{trip.driver.firstName ?? "—"}</span>
                <span className="flex items-center gap-2 text-xs text-ink-muted">
                  {trip.driver.rating != null && (
                    <span className="flex items-center gap-1 font-mono text-star">
                      <Star className="size-3 fill-star stroke-star" />
                      {trip.driver.rating.toFixed(1)}
                    </span>
                  )}
                  {trip.car && <span className="truncate">{`${trip.car.make ?? ""} ${trip.car.model ?? ""}`.trim()}</span>}
                </span>
              </span>
            </button>
            <Button
              variant="outline"
              size="sm"
              className="shrink-0 rounded-full"
              onClick={() => void openChat()}
              disabled={startChat.isPending}
            >
              <MessageCircle className="size-4" />
              {t("Trip.Message")}
            </Button>
          </div>
        )}

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

        <ErrorNote message={error} />
        <SuccessNote message={notice} />

        {/* ---------------------------------------------- passenger actions */}
        {!isDriver && canAct && (
          <div className="app-card space-y-3 p-4">
            <div className="flex items-center justify-between gap-3">
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

            <Button
              onClick={() => void book()}
              disabled={createBooking.isPending || trip.seats_available < 1}
              className="h-13 w-full rounded-full bg-brand-500 text-base font-semibold hover:bg-brand-600 disabled:bg-neutral-300 disabled:opacity-100"
            >
              {createBooking.isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                t(trip.booking_type === "REQUEST" ? "Trip.RequestBooking" : "Trip.BookNow")
              )}
            </Button>

            {trip.parcels_allowed && (
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

            {bookings && bookings.length > 0 && (
              <div className="space-y-1 border-t border-neutral-100 pt-3">
                <SectionLabel className="mt-0">{t("Trip.Passengers")}</SectionLabel>
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between gap-3 py-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <UserAvatar
                        src={booking.passenger?.avatar}
                        name={booking.passenger?.firstName}
                        className="size-10"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-ink">{booking.passenger?.firstName ?? "—"}</p>
                        <p className="text-xs text-ink-muted">
                          {t("Trip.SeatsCount", { count: booking.seatsBooked })} · {formatMoney(booking.totalPrice)}
                        </p>
                      </div>
                    </div>

                    {booking.status === "PENDING" ? (
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
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="mx-auto flex cursor-pointer items-center gap-1.5 py-2 text-sm text-ink-muted transition hover:text-danger"
            >
              <Flag className="size-4" />
              {t("Trip.Report")}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>{t("Trip.ReportTitle")}</AlertDialogTitle>
            </AlertDialogHeader>
            <Textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder={t("Trip.ReportPlaceholder")}
              className="min-h-24 rounded-2xl"
            />
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">{t("Cancel")}</AlertDialogCancel>
              <AlertDialogAction
                disabled={!reportText.trim() || reportTrip.isPending}
                onClick={() =>
                  void run(async () => {
                    await reportTrip.mutateAsync({ tripId, reason: "OTHER", description: reportText.trim() });
                    setReportText("");
                  }, "Trip.ReportSent")
                }
                className="rounded-full bg-brand-500 hover:bg-brand-600"
              >
                {t("Send")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Screen>
    </>
  );
};

const Detail = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className="flex justify-between gap-3">
    <dt className="text-ink-muted">{label}</dt>
    <dd className={strong ? "font-bold text-ink" : "font-medium text-ink"}>{value}</dd>
  </div>
);
