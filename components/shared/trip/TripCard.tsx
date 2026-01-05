import Image from "next/image";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { ChevronRight, Circle, Dot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TripCardProps {
  trip: any;
  onClick: () => void;
  viewMode?: "grid" | "list";
  priority?: boolean; // Для первых карточек
}

export const TripCard = ({ 
  trip, 
  onClick, 
  viewMode = "grid",
  priority = false 
}: TripCardProps) => {
  const t = useTranslations("Pages.Trips");

  const departureDate = new Date(trip.departure_ts);
  const arrivalDate = new Date(departureDate.getTime() + trip.duration * 60 * 1000);

  const localeDate =
    localStorage.getItem("locale") === "uz" 
      ? "uz-UZ" 
      : localStorage.getItem("locale") === "ru" 
      ? "ru-RU" 
      : "en-US";

  const formattedTime = departureDate.toLocaleTimeString(localeDate, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedArrivalTime = arrivalDate.toLocaleTimeString(localeDate, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (viewMode === "list") {
    return (
      <Card
        className="p-5 hover:border-emerald-500 hover:shadow-xl smooth cursor-pointer shadow-none bg-white"
        onClick={onClick}
      >
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="flex flex-row items-start justify-between gap-3 w-full max-w-125">
                <div className="flex items-center justify-start gap-0">
                  <div className="flex flex-col items-start">
                    <p className="text-base font-semibold">{formattedTime}</p>
                    <p className="text-sm">{trip.from_location.city}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 w-full text-muted-foreground">
                  <div className="flex items-center justify-start w-full">
                    <Circle className="w-3 h-3" />
                    <div className="border border-dashed w-full" />
                  </div>
                  <div className="flex items-center justify-center text-xs">
                    <p className="text-center w-12">
                      {Math.floor(trip.duration / 60)}:{trip.duration % 60}
                    </p>
                  </div>
                  <div className="flex items-center justify-start w-full">
                    <div className="border border-dashed w-full" />
                    <ChevronRight />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-0">
                  <div className="flex flex-col items-start">
                    <p className="text-base font-semibold">{formattedArrivalTime}</p>
                    <p className="text-sm">{trip.to_location.city}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="flex-1 flex flex-col justify-start items-start gap-4">
              <div className="flex flex-col items-end gap-3 text-sm mt-0">
                <div className="flex items-center gap-2">
                  <span>
                    {t("Details.Seats")}: {trip.seats_available}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <p>{t("Details.Price")}:&nbsp;</p>
              <p>{trip.price.final_price.toLocaleString()}</p>
              <span className="ml-1">UZS</span>
            </div>
          </div>
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
            <div className="flex justify-start items-center w-full">
              <p className="font-medium text-base">{trip.driver.firstName}</p>
              <Dot />
              <p className="text-muted-foreground text-xs">
                {trip.car && (
                  <span>
                    {trip.car.make} {trip.car.model}
                  </span>
                )}
              </p>
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4 w-full">
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
              <div className="text-base font-bold">
                {trip.price.final_price.toLocaleString()}
                <span className="ml-1">UZS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Оптимизированные иконки маршрута */}
        <div className="flex flex-col gap-0 min-w-50 mt-2">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">{formattedTime}</p>
            <Image
              src="/assets/location-green.svg"
              alt={`Отправление из ${trip.from_location.city}`}
              width={20}
              height={20}
              loading={priority ? "eager" : "lazy"}
              priority={priority}
            />
            <div>
              <p className="font-semibold text-base">{trip.from_location.city}</p>
              <p className="text-xs text-muted-foreground">{trip.from_location.address}</p>
            </div>
          </div>
          <span className="border-black border-l-2 border-dashed h-4 ml-13.25" />
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">{formattedArrivalTime}</p>
            <Image
              src="/assets/location-red.svg"
              alt={`Прибытие в ${trip.to_location.city}`}
              width={20}
              height={20}
              loading={priority ? "eager" : "lazy"}
              priority={priority}
            />
            <div>
              <p className="font-semibold text-base">{trip.to_location.city}</p>
              <p className="text-xs text-muted-foreground">{trip.to_location.address}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-end items-end gap-4">
          <div className="flex flex-col items-end gap-3 text-sm text-muted-foreground mt-0">
            <div className="flex items-center gap-2">
              <span>
                {t("Details.Seats")}: {trip.seats_available}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};