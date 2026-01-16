import Image from "next/image";

import { BASE_URL } from "@/lib/api";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { CircleSmall, Star } from "lucide-react";
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
  const pathname = usePathname();

  const departureDate = new Date(trip.departure_ts);
  const arrivalDate = new Date(departureDate.getTime() + trip.duration * 60 * 1000);

  const locale = pathname.slice(1, 3);

  const getLocale = () => {
    switch (locale) {
      case "uz":
        return "uz-UZ";
      case "ru":
        return "ru-RU";
      case "en":
        return "en-US";
      default:
        return "ru-RU";
    }
  };

  const formattedTime = departureDate.toLocaleTimeString(getLocale(), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedArrivalTime = arrivalDate.toLocaleTimeString(getLocale(), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  if (viewMode === "list") {
    return (
      <Card
        className="p-4 md:p-6 hover:border-emerald-500 hover:shadow-xl smooth cursor-pointer shadow-none bg-white"
        onClick={onClick}
      >
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex items-center">
            <div className="flex items-center justify-between gap-4 w-full">
              <div className="flex flex-row items-center justify-between gap-3 w-full max-w-125">
                <div className="flex items-center justify-start gap-0">
                  <div className="flex flex-col items-start">
                    <p className="text-base font-semibold">{formattedTime}</p>
                    <p className="font-semibold text-xs md:text-sm">{trip.from_location.city}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center justify-start w-full ">
                    <CircleSmall className="text-gray-700" strokeWidth={3} />
                    <div className="border-gray-700 border w-full" />
                  </div>
                  <div className="flex items-center justify-center text-xs">
                    <p className="text-center font-mono font-semibold w-12 text-gray-700">
                      {Math.floor(trip.duration / 60)}{t("Details.Hours")} {trip.duration % 60}{t("Details.Minutes")}
                    </p>
                  </div>
                  <div className="flex items-center justify-start w-full">
                    <div className="border-gray-700 border w-full" />
                    <CircleSmall className="text-gray-700" strokeWidth={3} />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-0">
                  <div className="flex flex-col items-start">
                    <p className="text-base font-semibold">{formattedArrivalTime}</p>
                    <p className="font-semibold text-xs md:text-sm">{trip.to_location.city}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-center text-sm items-start gap-1 text-neutral-700 mt-2">
            <time>{t("Details.Departure")}: {departureDate.toLocaleDateString()}</time>
            <span>{t("Details.Seats")}: {trip.seats_available}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center justify-center">
              <Avatar className="size-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <AvatarImage src={`${BASE_URL}${trip.driver.avatar}`} />
                <AvatarFallback className="bg-emerald-300 font-bold text-white text-base">
                  {trip.driver.firstName[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col justify-center items-start w-full">
              <p className="font-medium text-base">{trip.driver.firstName}</p>
              <p className="text-muted-foreground text-xs">
                {trip.car && (
                  <span>
                    {trip.car.make} {trip.car.model}
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-end justify-center gap-2">
              <div className="flex items-center rounded-full px-1.5 py-0.5 gap-1 text-xs font-mono font-semibold text-muted-foreground">
                <Star className="fill-gray-500 size-4" />
                <span className="">{trip.driver.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center text-sm font-bold">
                <p>{trip.price.price_per_person.toLocaleString()}</p>
                <span className="ml-1">UZS</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="p-4 md:p-6 hover:border-emerald-500 hover:shadow-xl smooth cursor-pointer shadow-none bg-white"
      onClick={onClick}
    >
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 w-full">
            <div className="relative">
              <Avatar className="size-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <AvatarImage src={`${BASE_URL}${trip.driver.avatar}`} />
                <AvatarFallback className="bg-emerald-300 font-bold text-white text-xl">
                  {trip.driver.firstName[0]}
                </AvatarFallback>
              </Avatar>
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
              <div className="flex flex-col items-end justify-start gap-1">
                <span className="flex items-center justify-center text-base font-bold">
                  {trip.price.price_per_person.toLocaleString()}
                  <p className="ml-1">UZS</p>
                </span>
                <div className="flex items-center rounded-full gap-1 text-xs font-semibold font-mono text-muted-foreground">
                  <Star className="fill-gray-500 size-4" />
                  <span className="">{trip.driver.rating.toFixed(1)}</span>
                </div>
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

        <div className="flex flex-col justify-center text-sm items-start gap-1 text-neutral-700 mt-2">
          <time>{t("Details.Departure")}: {departureDate.toLocaleDateString()}</time>
          <span>{t("Details.Seats")}: {trip.seats_available}</span>
        </div>
      </div>
    </Card>
  );
};