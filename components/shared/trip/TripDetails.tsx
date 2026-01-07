import Image from "next/image";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Dot,
  MapPin,
  Star,
  Users
} from "lucide-react";

interface TripDetailsProps {
  trip: any;
}

export const TripDetails = ({ trip }: TripDetailsProps) => {
  const t = useTranslations("Pages.Trips.Details");
  const router = useRouter();

  const locale = localStorage.getItem("locale");
  const departureDate = new Date(trip.departure_ts);
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

  const formattedDate = departureDate.toLocaleDateString(getLocale(), {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formattedTime = departureDate.toLocaleTimeString(getLocale(), {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center justify-between w-full mb-2 px-0!"
      >
        <div>
          <ArrowLeft className="size-5" />
        </div>
        <div className="mr-6 text-xl font-bold">{t("Title")}</div>
        <div />
      </Button>
      <Card className="bg-neutral-100 border-none shadow-none px-0 w-full">
        {/* Route */}
        <div className="mb-2">
          <h2 className="text-lg font-semibold mb-2">{t("Route")}</h2>
          <div className="flex flex-col gap-0 px-6 py-4 bg-white rounded-3xl">
            <div className="flex items-center gap-4">
              <Image src="/assets/location-green.svg" alt="location" width={24} height={24} />
              <div>
                <p className="font-semibold text-base">{trip.from_location.city}</p>
                <h3 className="text-sm text-muted-foreground">{trip.from_location.address}</h3>
              </div>
            </div>
            <div className="w-0.5 h-8 border border-neutral-700 border-dashed ml-2.5" />
            <div className="flex items-center gap-4">
              <Image src="/assets/location-red.svg" alt="location" width={24} height={24} />
              <div>
                <p className="font-semibold text-base">{trip.to_location.city}</p>
                <h3 className="text-sm text-muted-foreground">{trip.to_location.address}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Trip Info */}
        <div className="mb-2">
          <h2 className="text-lg font-semibold mb-2">{t("Information")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-4 bg-white rounded-3xl">
            <div className="flex items-center gap-4">
              <Calendar className="size-5 text-emerald-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Departure")}</p>
                <p className="font-medium">
                  {formattedDate} - {formattedTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="size-5 text-emerald-500" />
              <div>
                <p className="text-sm text-muted-foreground">{t("Seats")}</p>
                <p className="font-medium">{trip.seats_available}</p>
              </div>
            </div>
            {trip.distance && (
              <div className="flex items-center gap-4">
                <MapPin className="size-5 text-emerald-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("Distance")}</p>
                  <p className="font-medium">{trip.distance} km</p>
                </div>
              </div>
            )}
            {trip.duration && (
              <div className="flex items-center gap-4">
                <Clock className="size-5 text-emerald-500" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("Duration")}</p>
                  <p className="font-medium">
                    {Math.floor(trip.duration / 60)}{t("Hours")} {trip.duration % 60}{t("Minutes")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Driver Info */}
        <div className="mb-2">
          <h2 className="text-lg font-semibold mb-2">{t("Driver")}</h2>
          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl">
            <Avatar className="size-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <AvatarImage src="" />
              <AvatarFallback className="bg-emerald-300 font-bold text-white text-xl">
                {trip.driver.firstName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">
                {trip.driver.firstName} {trip.driver.lastName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{trip.driver.rating.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Car Info */}
        <div className="mb-2">
          <h2 className="text-lg font-semibold mb-2">{t("Vehicle")}</h2>
          <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-3xl">
            <div className="flex flex-col gap-2">
              <p className="text-lg font-medium">
                {trip.car.make} {trip.car.model}
              </p>
              <p className="flex items-center text-sm text-muted-foreground">
                {trip.car.gov_number}
                <Dot />
                {trip.car.color}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          {trip.comment && (
            <>
              <h2 className="text-lg font-semibold mb-4">{t("AdditionalInformation")}</h2>
              <div className="flex items-center gap-4 bg-white p-4 rounded-3xl">
                <p className="text-sm">{trip.comment}</p>
              </div>
            </>
          )}
        </div>

        {/* Price & Action */}
        <div className="fixed bottom-0 md:bottom-4 inset-x-0 mx-auto bg-white w-full max-w-4xl rounded-none md:rounded-3xl px-6 py-3">
          <div className="flex items-center justify-between w-full ">
            <div>
              <p className="text-sm text-muted-foreground">{t("Price")}</p>
              <p className="text-xl font-bold">
                {trip.price.final_price.toLocaleString()}
                <span className="ml-1">UZS</span>
              </p>
            </div>

            <Button className="btn-primary">{t("Book")}</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
