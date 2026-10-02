"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { AppIcon } from "@/components/app/AppIcon";
import { DatePickerScreen } from "@/components/app/DatePickerScreen";
import { formatDate } from "@/components/app/kit";
import { PlacePicker } from "@/components/app/PlacePicker";
import { SeatsSheet } from "@/components/app/sheets/SeatsSheet";
import type { Place } from "@/lib/places";
import { cn } from "@/lib/utils";

export interface SearchValue {
  from: Place | null;
  to: Place | null;
  date?: Date;
  seats: number;
}

export const isSearchReady = (value: SearchValue) =>
  Boolean(value.from?.lat && value.from?.lng && value.to?.lat && value.to?.lng);

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/**
 * The route, date and passenger fields of a search, with the pickers they
 * open. Shared by the home screen and the "change search" sheet over the
 * results, so the two cannot drift apart; the submit button stays with the
 * caller, because each places it differently.
 */
export const SearchFields = ({ value, onChange }: { value: SearchValue; onChange: (next: SearchValue) => void }) => {
  const t = useTranslations("App.Search");
  const [picking, setPicking] = useState<"from" | "to" | "date" | "seats" | null>(null);

  const set = (patch: Partial<SearchValue>) => onChange({ ...value, ...patch });

  const dayLabel = () => {
    if (!value.date) return t("Today");
    const diff = Math.round((startOfDay(value.date) - startOfDay(new Date())) / 86_400_000);
    if (diff <= 0) return t("Today");
    if (diff === 1) return t("Tomorrow");
    return formatDate(value.date);
  };

  return (
    <>
      <div className="flex items-center gap-3">
        <AppIcon name="location_iconG" className="h-7 w-6" />
        <div className="flex h-12 min-w-0 flex-1 items-center rounded-full bg-neutral-100 pr-1.5 transition hover:bg-neutral-200/70">
          <PointButton value={value.from?.name} placeholder={t("FromPlaceholder")} onClick={() => setPicking("from")} />
          {/* Inside the departure field, as in the mobile build — not a third column. */}
          <button
            type="button"
            aria-label={t("Swap")}
            onClick={() => set({ from: value.to, to: value.from })}
            className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-brand-500 transition hover:bg-white"
          >
            <AppIcon name="ic_reload_green" className="size-6" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <AppIcon name="location_iconR" className="h-7 w-6" />
        <div className="flex h-12 min-w-0 flex-1 items-center rounded-full bg-neutral-100 transition hover:bg-neutral-200/70">
          <PointButton value={value.to?.name} placeholder={t("ToPlaceholder")} onClick={() => setPicking("to")} />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="min-w-0">
          <p className="mb-2 font-semibold text-ink">{t("Date")}</p>
          <FieldButton onClick={() => setPicking("date")} label={dayLabel()} icon="ic_calendar" />
        </div>
        <div className="min-w-0">
          <p className="mb-2 font-semibold text-ink">{t("Passengers")}</p>
          <FieldButton
            onClick={() => setPicking("seats")}
            label={t("SeatsCount", { count: value.seats })}
            icon="arrow_down"
          />
        </div>
      </div>

      <PlacePicker
        open={picking === "from" || picking === "to"}
        title={picking === "to" ? t("ToPlaceholder") : t("FromPlaceholder")}
        initialValue={(picking === "to" ? value.to : value.from)?.name}
        onPick={(place) => set(picking === "to" ? { to: place } : { from: place })}
        onClose={() => setPicking(null)}
      />
      <DatePickerScreen
        open={picking === "date"}
        selected={value.date}
        onPick={(date) => set({ date })}
        onClose={() => setPicking(null)}
      />
      <SeatsSheet
        open={picking === "seats"}
        value={value.seats}
        onPick={(seats) => set({ seats })}
        onClose={() => setPicking(null)}
      />
    </>
  );
};

/** The text part of a route field; opens the full-screen place picker. */
const PointButton = ({ value, placeholder, onClick }: { value?: string; placeholder: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "h-full min-w-0 flex-1 cursor-pointer truncate px-5 text-left text-[15px]",
      value ? "text-ink" : "text-neutral-500"
    )}
  >
    {value || placeholder}
  </button>
);

const FieldButton = ({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: "ic_calendar" | "arrow_down";
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex h-12 w-full cursor-pointer items-center justify-between gap-2 rounded-2xl border border-neutral-200 bg-white px-4 text-left transition hover:border-neutral-300"
  >
    <span className="min-w-0 truncate text-[15px] text-ink">{label}</span>
    <AppIcon name={icon} className="size-5 text-neutral-500" />
  </button>
);
