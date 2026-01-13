"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarSelect } from "./Calendar";
import { Separator } from "@/components/ui/separator";
import { CityAutocomplete } from "./CityAutocomplete";

export const SearchTrips = () => {
  const t = useTranslations("Components.Search");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Инициализируем стейт из URL если есть, или пустотой
  const [fromName, setFromName] = useState(searchParams.get("from_name") || "");
  const [toName, setToName] = useState(searchParams.get("to_name") || "");
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date")!) : undefined
  );
  const [seats, setSeats] = useState(searchParams.get("seats") || "1");

  // Синхронизация с URL при навигации назад/вперед
  useEffect(() => {
    setFromName(searchParams.get("from_name") || "");
    setToName(searchParams.get("to_name") || "");
  }, [searchParams]);

  const handleSearch = () => {
    // Разрешаем поиск, даже если заполнено только одно поле,
    // но лучше требовать оба для корректного маршрута
    if (!fromName.trim() || !toName.trim()) {
      // Можно добавить тост уведомление
      return;
    }

    const params = new URLSearchParams();
    params.set("from_name", fromName.trim());
    params.set("to_name", toName.trim());
    params.set("seats", seats);

    if (date) {
      params.set("date", date.toISOString());
    }

    router.push(`/trips?${params.toString()}`);
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
              onCitySelected={(city) => setFromName(city)}
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
              placeholder={t("FromCityPlaceholder")}
              initialValue={fromName}
              onCitySelected={(city) => setFromName(city)}
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
            <SelectTrigger className="bg-transparent border-none shadow-none focus:ring-0 p-0 h-auto gap-3.5 text-muted-foreground">
              <UserRound className="size-6" />
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

        {/* Кнопка */}
        <div className="w-full lg:w-auto">
          <Button
            onClick={handleSearch}
            className="w-full lg:w-auto h-12 lg:h-14 px-10! rounded-full text-lg btn-glow"
          >
            <Search className="size-5" strokeWidth={2.75} />
            {t("Search")}
          </Button>
        </div>
      </div>
    </div>
  );
};
