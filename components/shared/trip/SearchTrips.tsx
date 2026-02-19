"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CircleUserRound, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/app/i18n/routing";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CalendarSelect } from "./Calendar";
import { CityAutocomplete } from "./CityAutocomplete";

export const SearchTrips = () => {
  const t = useTranslations("Components.Search");
  const router = useRouter();
  const searchParams = useSearchParams();

  // State для текста
  const [fromName, setFromName] = useState(searchParams.get("from") || "");
  const [toName, setToName] = useState(searchParams.get("to") || "");

  // State для координат
  const [fromCoords, setFromCoords] = useState<{ lat?: number; lng?: number }>({
    lat: searchParams.get("from_lat") ? parseFloat(searchParams.get("from_lat")!) : undefined,
    lng: searchParams.get("from_lon") ? parseFloat(searchParams.get("from_lon")!) : undefined,
  });
  const [toCoords, setToCoords] = useState<{ lat?: number; lng?: number }>({
    lat: searchParams.get("to_lat") ? parseFloat(searchParams.get("to_lat")!) : undefined,
    lng: searchParams.get("to_lon") ? parseFloat(searchParams.get("to_lon")!) : undefined,
  });

  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined
  );
  const [seats, setSeats] = useState(searchParams.get("seats") || "1");

  useEffect(() => {
    setFromName(searchParams.get("from") || "");
    setToName(searchParams.get("to") || "");
  }, [searchParams]);

  const handleSearch = () => {
    if (!fromName.trim() || !toName.trim()) {
      return;
    }

    const params = new URLSearchParams();

    // Текстовые параметры (для отображения и fallback)
    params.set("from", fromName.trim());
    params.set("to", toName.trim());

    // Координаты (для radius search)
    if (fromCoords.lat && fromCoords.lng) {
      params.set("from_lat", fromCoords.lat.toString());
      params.set("from_lon", fromCoords.lng.toString());
    }
    if (toCoords.lat && toCoords.lng) {
      params.set("to_lat", toCoords.lat.toString());
      params.set("to_lon", toCoords.lng.toString());
    }

    params.set("seats", seats);

    if (date) {
      params.set("date", date.toISOString());
    }

    router.push({
      pathname: "/trips",
      query: Object.fromEntries(params),
    });
  };

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-4 shadow-2xl border p-4 lg:p-2 lg:pl-6 rounded-3xl lg:rounded-full bg-white">
      <div className="flex flex-col lg:flex-row items-center w-full gap-2 lg:gap-0">
        <div className="flex items-center gap-3 w-full px-2 py-2">
          <div className="flex items-center justify-center size-6 border-2 border-emerald-500 rounded-full shrink-0">
            <div className="size-2 bg-emerald-500 rounded-full" />
          </div>
          <div className="w-full border-r-0 lg:border-r">
            <p className="text-xs text-neutral-400">{t("From")}</p>
            <CityAutocomplete
              placeholder={t("FromCityPlaceholder")}
              initialValue={fromName}
              onCitySelected={(data) => {
                setFromName(data.name);
                setFromCoords({ lat: data.lat, lng: data.lng });
              }}
            />
          </div>
        </div>

        <div className="block lg:hidden px-2 w-full">
          <Separator />
        </div>

        <div className="flex items-center gap-3 w-full px-2 py-2">
          <div className="flex items-center justify-center size-6 border-2 border-muted-foreground rounded-full p-1 shrink-0">
            <div className="size-2 bg-muted-foreground rounded-full" />
          </div>
          <div className="w-full border-r-0 lg:border-r">
            <p className="text-xs text-neutral-400">{t("To")}</p>
            <CityAutocomplete
              placeholder={t("ToCityPlaceholder")}
              initialValue={toName}
              onCitySelected={(data) => {
                setToName(data.name);
                setToCoords({ lat: data.lat, lng: data.lng });
              }}
            />
          </div>
        </div>

        <div className="block lg:hidden px-2 w-full">
          <Separator />
        </div>

        <div className="flex items-center justify-start w-full px-2 py-2 lg:py-0 border-r-0 lg:border-r">
          <CalendarSelect onDateChange={setDate} />
        </div>

        <div className="block lg:hidden px-2 w-full">
          <Separator />
        </div>

        <div className="flex items-center justify-start w-full lg:w-auto pl-2 pr-12 py-2 lg:py-0">
          <Select value={seats} onValueChange={setSeats}>
            <SelectTrigger className="bg-transparent border-none shadow-none focus:ring-0 p-0 h-auto gap-3.5 text-muted-foreground cursor-pointer select-none">
              <CircleUserRound className="size-6" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {t(`Passengers.${num}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full lg:w-auto">
          <Button
            type="button"
            onClick={handleSearch}
            className="w-full lg:w-auto h-12 lg:h-14 px-12! rounded-full text-lg btn-glow"
          >
            <Search className="size-5" strokeWidth={2.75} />
            {t("Search")}
          </Button>
        </div>
      </div>
    </div>
  );
};
