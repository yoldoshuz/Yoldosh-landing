"use client";

import { useState } from "react";
import { CalendarDays, CarFront, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import {
  EmptyState,
  ErrorNote,
  formatDate,
  formatMoney,
  ILLUSTRATION,
  Screen,
  SectionLabel,
  Spinner,
} from "@/components/app/kit";
import { CityAutocomplete } from "@/components/shared/trip/CityAutocomplete";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTrip, usePriceHint } from "@/hooks/api/useAppTrips";
import { useMyCars } from "@/hooks/api/useCars";
import { apiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { BookingType, GarageStatus } from "@/types/api";

interface Point {
  name: string;
  lat?: number;
  lng?: number;
}

const TOGGLES = [
  "conditioner",
  "smoking_allowed",
  "door_pickup",
  "food_stop",
  "max_two_back",
  "parcels_allowed",
] as const;
type Toggle = (typeof TOGGLES)[number];

export const PublishScreen = () => {
  const t = useTranslations("App");
  const router = useRouter();

  const { data: cars, isLoading: carsLoading } = useMyCars();
  const createTrip = useCreateTrip();

  const [carId, setCarId] = useState("");
  const [from, setFrom] = useState<Point>({ name: "" });
  const [to, setTo] = useState<Point>({ name: "" });
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("09:00");
  const [seatsAvailable, setSeatsAvailable] = useState("3");
  const [price, setPrice] = useState("");
  const [parcelPrice, setParcelPrice] = useState("");
  const [comment, setComment] = useState("");
  const [garage, setGarage] = useState<GarageStatus>("EMPTY");
  const [bookingType, setBookingType] = useState<BookingType>("INSTANT");
  const [toggles, setToggles] = useState<Partial<Record<Toggle, boolean>>>({});
  const [error, setError] = useState<string | null>(null);

  // The recommendation endpoint keys off free-form addresses, so it only fires
  // once both ends are actually picked.
  const { data: hint } = usePriceHint(from.name || undefined, to.name || undefined);

  const verifiedCars = cars?.filter((c) => c.status === "VERIFIED") ?? [];
  const ready = Boolean(carId && from.lat && from.lng && to.lat && to.lng && date && Number(price) > 0);

  const submit = async () => {
    if (!ready || !date) return;
    setError(null);

    const [hours, minutes] = time.split(":").map(Number);
    const departure = new Date(date);
    departure.setHours(hours || 0, minutes || 0, 0, 0);

    try {
      const trip = await createTrip.mutateAsync({
        car_id: carId,
        from_latitude: from.lat!,
        from_longitude: from.lng!,
        to_latitude: to.lat!,
        to_longitude: to.lng!,
        departure_ts: departure.toISOString(),
        seats_available: Number(seatsAvailable),
        price_per_person: Number(price),
        garage,
        booking_type: bookingType,
        parcel_price: toggles.parcels_allowed && parcelPrice ? Number(parcelPrice) : null,
        comment: comment.trim() || null,
        ...toggles,
      });
      router.push(`/ride/${trip.id}` as any);
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.Generic")));
    }
  };

  if (carsLoading) {
    return (
      <>
        <AppTopBar title={t("Publish.Title")} />
        <Spinner />
      </>
    );
  }

  if (verifiedCars.length === 0) {
    return (
      <>
        <AppTopBar title={t("Publish.Title")} />
        <Screen className="flex flex-1 items-center justify-center">
          <div className="app-card w-full px-2 py-4 lg:max-w-lg">
            <EmptyState
              illustration={ILLUSTRATION.noCar}
              title={t("Publish.NoCarTitle")}
              description={t("Publish.NoCarText")}
              action={
                <Button
                  asChild
                  className="h-13 w-full rounded-full bg-brand-500 text-base font-semibold hover:bg-brand-600"
                >
                  {/* Straight into the form — the garage list in between is
                      empty by definition for anyone seeing this screen. */}
                  <Link href={{ pathname: "/profile/cars", query: { add: "1" } }}>
                    {t("Publish.BecomeDriver")}
                    <CarFront className="size-5" />
                  </Link>
                </Button>
              }
            />
          </div>
        </Screen>
      </>
    );
  }

  return (
    <>
      <AppTopBar title={t("Publish.Title")} />
      <Screen>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
          className="space-y-3 lg:grid lg:grid-cols-2 lg:items-start lg:gap-4 lg:space-y-0"
        >
          <div className="space-y-3">
            <div className="app-card space-y-3 p-4">
              <SectionLabel className="mt-0">{t("Publish.Car")}</SectionLabel>
              <Select value={carId} onValueChange={setCarId}>
                <SelectTrigger className="h-12! w-full rounded-2xl">
                  <SelectValue placeholder={t("Publish.PickCar")} />
                </SelectTrigger>
                <SelectContent>
                  {verifiedCars.map((car) => (
                    <SelectItem key={car.id} value={car.id}>
                      {car.make} {car.model} · {car.plate_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="app-card space-y-3 p-4">
              <SectionLabel className="mt-0">{t("Publish.Route")}</SectionLabel>

              <div className="flex items-center gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-brand-500">
                  <span className="size-2 rounded-full bg-brand-500" />
                </span>
                <CityAutocomplete
                  placeholder={t("Search.FromPlaceholder")}
                  onCitySelected={(d) => setFrom({ name: d.name, lat: d.lat, lng: d.lng })}
                  className="h-11 rounded-full border-0 bg-neutral-100 px-4"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full border-2 border-danger">
                  <span className="size-2 rounded-full bg-danger" />
                </span>
                <CityAutocomplete
                  placeholder={t("Search.ToPlaceholder")}
                  onCitySelected={(d) => setTo({ name: d.name, lat: d.lat, lng: d.lng })}
                  className="h-11 rounded-full border-0 bg-neutral-100 px-4"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5">{t("Search.Date")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="h-12 w-full justify-between rounded-2xl px-4 font-normal">
                        <span className={cn(!date && "text-ink-muted")}>
                          {date ? formatDate(date) : t("Search.Today")}
                        </span>
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
                  <Label htmlFor="time" className="mb-1.5">
                    {t("Publish.Time")}
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="h-12 rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="app-card space-y-3 p-4">
              <SectionLabel className="mt-0">{t("Publish.SeatsAndPrice")}</SectionLabel>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5">{t("Publish.Seats")}</Label>
                  <Select value={seatsAvailable} onValueChange={setSeatsAvailable}>
                    <SelectTrigger className="h-12! w-full rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <SelectItem key={n} value={String(n)}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price" className="mb-1.5">
                    {t("Publish.PricePerSeat")}
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step={1000}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="50000"
                    className="h-12 rounded-2xl"
                  />
                </div>
              </div>
              {hint?.average_price != null && (
                <p className="text-xs text-ink-muted">
                  {t("Publish.PriceHint", {
                    min: formatMoney(hint.min_price),
                    avg: formatMoney(hint.average_price),
                    max: formatMoney(hint.max_price),
                  })}
                </p>
              )}
            </div>

            <div className="app-card space-y-4 p-4">
              <div>
                <Label className="mb-2 block">{t("Publish.BookingType")}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(["INSTANT", "REQUEST"] as BookingType[]).map((bt) => (
                    <button
                      key={bt}
                      type="button"
                      onClick={() => setBookingType(bt)}
                      className={cn(
                        "cursor-pointer rounded-2xl border px-3 py-2.5 text-sm font-medium transition",
                        bookingType === bt
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-neutral-200 hover:border-neutral-300"
                      )}
                    >
                      {t(`Trip.BookingTypes.${bt}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="mb-2 block">{t("Publish.Garage")}</Label>
                <Select value={garage} onValueChange={(v) => setGarage(v as GarageStatus)}>
                  <SelectTrigger className="h-12! w-full rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["EMPTY", "HALF_EMPTY", "FULL"] as GarageStatus[]).map((g) => (
                      <SelectItem key={g} value={g}>
                        {t(`Trip.Garage.${g}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="mb-1 block">{t("Publish.Options")}</Label>
                {TOGGLES.map((key) => (
                  <div key={key} className="flex items-center justify-between gap-3 py-2">
                    <Label htmlFor={`toggle-${key}`} className="cursor-pointer font-normal">
                      {t(`Trip.Features.${key}`)}
                    </Label>
                    <Switch
                      id={`toggle-${key}`}
                      checked={Boolean(toggles[key])}
                      onCheckedChange={(v) => setToggles((s) => ({ ...s, [key]: v }))}
                      className="data-[state=checked]:bg-brand-500"
                    />
                  </div>
                ))}
              </div>

              {toggles.parcels_allowed && (
                <div>
                  <Label htmlFor="parcelPrice" className="mb-1.5">
                    {t("Publish.ParcelPrice")}
                  </Label>
                  <Input
                    id="parcelPrice"
                    type="number"
                    min={0}
                    step={1000}
                    value={parcelPrice}
                    onChange={(e) => setParcelPrice(e.target.value)}
                    placeholder={t("Publish.ParcelPricePlaceholder")}
                    className="h-12 rounded-2xl"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="comment" className="mb-1.5">
                  {t("Publish.Comment")}
                </Label>
                <Textarea
                  id="comment"
                  maxLength={255}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("Publish.CommentPlaceholder")}
                  className="min-h-24 rounded-2xl"
                />
              </div>
            </div>

            <ErrorNote message={error} />

            <Button
              type="submit"
              disabled={!ready || createTrip.isPending}
              className="h-13 w-full rounded-full bg-brand-500 text-base font-semibold hover:bg-brand-600 disabled:bg-neutral-300 disabled:opacity-100"
            >
              {createTrip.isPending ? <Loader2 className="size-5 animate-spin" /> : t("Publish.Submit")}
            </Button>
          </div>
        </form>
      </Screen>
    </>
  );
};
