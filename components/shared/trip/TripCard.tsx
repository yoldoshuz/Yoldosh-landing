import Image from "next/image";
import { Calendar, Timer } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface TripCardProps {
  trip: any;
  onClick: () => void;
  viewMode?: "grid" | "list";
}

export const TripCard = ({ trip, onClick, viewMode = "grid" }: TripCardProps) => {
  const locale = useLocale();
  const t = useTranslations("Pages.Trips");

  const departureDate = new Date(trip.departure_ts);
  const localeDate =
    localStorage.getItem("locale") === "uz" ? "uz-UZ" : localStorage.getItem("locale") === "ru" ? "ru-RU" : "en-US";

  const formattedDate = departureDate.toLocaleDateString(localeDate, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const formattedTime = departureDate.toLocaleTimeString(localeDate, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const preferences = trip.driver.preferences || {};

  if (viewMode === "list") {
    return (
      <Card
        className="p-5 hover:border-emerald-500 hover:shadow-xl smooth cursor-pointer shadow-none bg-white"
        onClick={onClick}
      >
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Driver & Price */}
          <div className="flex items-center gap-4 ">
            <div className="flex items-center justify-between gap-4 w-full">
              {/* Route */}
              <div className="flex flex-row items-center justify-between w-full gap-4 max-w-125">
                <div className="flex flex-col items-center justify-center text-center gap-0 w-full">
                  <h3 className="font-semibold text-sm">{trip.from_location.address}</h3>
                  <p className="text-muted-foreground text-xs">
                    {locale === "uz" && trip.from_location.fromRegion.nameUz}
                    {locale === "ru" && trip.from_location.fromRegion.nameRu}
                    {locale === "en" && trip.from_location.fromRegion.nameEn}
                  </p>
                </div>
                <div className="flex items-center justify-between w-full">
                  <div>
                    <Image src="/location-green.svg" alt="location" width={28} height={28} />
                  </div>
                  <div className="w-full border border-neutral-700 border-dashed" />
                  <div>
                    <Image src="/location-red.svg" alt="location" width={28} height={28} />
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center text-center gap-0 w-full">
                  <h3 className="font-semibold text-sm">{trip.to_location.address}</h3>
                  <p className="text-muted-foreground text-xs">
                    {locale === "uz" && trip.to_location.toRegion.nameUz}
                    {locale === "ru" && trip.to_location.toRegion.nameRu}
                    {locale === "en" && trip.to_location.toRegion.nameEn}
                  </p>
                </div>
              </div>
              <div className="hidden md:flex items-center text-xl font-bold">
                {trip.price.final_price.toLocaleString()}
                <span className="ml-1">UZS</span>
              </div>
            </div>
          </div>
          <Separator className="mt-4" />
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="size-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <AvatarImage src="" />
                <AvatarFallback className="bg-emerald-300 font-bold text-white text-xl">
                  {trip.driver.firstName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 z-10 bg-emerald-500 border border-white rounded-full px-1.5 py-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <span className="text-white">{trip.driver.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-col justify-center">
                <p className="font-medium text-base">{trip.driver.firstName}</p>
                <p className="text-muted-foreground text-xs">
                  {trip.car && (
                    <span>
                      {trip.car.make} {trip.car.model}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex md:hidden items-center justify-center text-lg font-bold">
              {trip.price.final_price.toLocaleString()}
              <span className="ml-1">UZS</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="p-5 hover:border-emerald-500 hover:shadow-xl smooth cursor-pointer shadow-none bg-white"
      onClick={onClick}
    >
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Driver & Price */}
        <div className="flex items-center gap-4 ">
          <div className="flex items-center gap-4 w-full">
            <div className="relative">
              <Avatar className="size-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <AvatarImage src="" />
                <AvatarFallback className="bg-emerald-300 font-bold text-white text-xl">
                  {trip.driver.firstName[0]}
                </AvatarFallback>
              </Avatar>

              {/* rating overlay above avatar */}
              <div className="absolute -bottom-2 -right-2 z-10 bg-emerald-500 border border-white rounded-full px-1.5 py-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                <span className="text-white">{trip.driver.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-col justify-center">
                <p className="font-medium text-base">{trip.driver.firstName}</p>
                <p className="text-muted-foreground text-xs">
                  {trip.car && (
                    <span>
                      {trip.car.make} {trip.car.model}
                    </span>
                  )}
                </p>
              </div>
              <div className="text-lg font-bold">
                {trip.price.final_price.toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground ml-1">UZS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Route */}
        <div className="flex flex-col gap-0 min-w-50 mt-2">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">{formattedTime}</p>
            <Image src="/location-green.svg" alt="location" width={20} height={20} />
            <div>
              <h3 className="font-semibold text-sm">{trip.from_location.address}</h3>
              <p className="text-muted-foreground text-xs">
                {locale === "uz" && trip.from_location.fromRegion.nameUz}
                {locale === "ru" && trip.from_location.fromRegion.nameRu}
                {locale === "en" && trip.from_location.fromRegion.nameEn}
              </p>
            </div>
          </div>
          <div className="w-0.5 h-4 border border-neutral-700 border-dashed ml-13.25" />
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">{formattedTime}</p>
            <Image src="/location-red.svg" alt="location" width={20} height={20} />
            <div>
              <h3 className="font-semibold text-sm">{trip.to_location.address}</h3>
              <p className="text-muted-foreground text-xs">
                {locale === "uz" && trip.to_location.toRegion.nameUz}
                {locale === "ru" && trip.to_location.toRegion.nameRu}
                {locale === "en" && trip.to_location.toRegion.nameEn}
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-end items-end gap-4">
          <div className="flex flex-col items-end gap-3 text-sm text-muted-foreground mt-0">
            <div className="flex items-center gap-2">
              <span>
                {t("Details.Seats")}: {trip.seats_available}{" "}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
