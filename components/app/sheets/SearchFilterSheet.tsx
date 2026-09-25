"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { GarageStatus } from "@/types/api";

export type SortOption = "earliest" | "latest" | "cheapest" | "expensive";

/** Amenity flags the search endpoint understands, in the order they are shown. */
export const AMENITY_FILTERS = [
  "smoking_allowed",
  "conditioner",
  "door_pickup",
  "food_stop",
  "parcels_allowed",
] as const;
export type AmenityFilter = (typeof AMENITY_FILTERS)[number];

export interface SearchFilters {
  sort?: SortOption;
  garage?: GarageStatus;
  amenities: Partial<Record<AmenityFilter, boolean>>;
}

export const EMPTY_FILTERS: SearchFilters = { amenities: {} };

export const countFilters = (filters: SearchFilters) =>
  (filters.sort ? 1 : 0) + (filters.garage ? 1 : 0) + Object.values(filters.amenities).filter(Boolean).length;

const GARAGE_ORDER: GarageStatus[] = ["EMPTY", "HALF_EMPTY", "FULL"];

/**
 * "Фильтровать" — sorting and amenities, applied only on submit.
 *
 * The draft is kept local so half-made choices never re-run the search; the
 * green button at the bottom is what commits them, which is also the only
 * thing that closes the sheet.
 */
export const SearchFilterSheet = ({
  open,
  value,
  onOpenChange,
  onApply,
}: {
  open: boolean;
  value: SearchFilters;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: SearchFilters) => void;
}) => {
  const t = useTranslations("App.Search");
  const tTrip = useTranslations("App.Trip");

  const [draft, setDraft] = useState<SearchFilters>(value);
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  const toggleSort = (option: SortOption) => setDraft((d) => ({ ...d, sort: d.sort === option ? undefined : option }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className="h-[92dvh] gap-0 rounded-t-[26px] border-0 p-0 lg:inset-y-0 lg:right-0 lg:left-auto lg:h-full lg:max-w-md lg:rounded-none"
      >
        <div className="flex h-full flex-col">
          <header className="relative flex shrink-0 items-center justify-center border-b border-neutral-100 px-4 py-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label={t("Close")}
              className="absolute left-4 cursor-pointer rounded-full p-1 text-ink transition hover:bg-neutral-100"
            >
              <X className="size-6" />
            </button>
            <SheetTitle className="text-[22px] font-bold text-ink">{t("Filters")}</SheetTitle>
            <SheetDescription className="sr-only">{t("Filters")}</SheetDescription>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
            <h3 className="text-[22px] font-bold text-ink">{t("Filter.Sorting")}</h3>

            {/*
              One exclusive choice across both groups: the API refuses to sort
              by price and time at once, so offering them as two independent
              picks would only produce requests it rejects.
            */}
            <p className="mt-3 font-bold text-ink">{t("Filter.ByTime")}</p>
            <div className="mt-1 space-y-1">
              {(["earliest", "latest"] as SortOption[]).map((option) => (
                <RadioRow
                  key={option}
                  label={t(`Sort.${option}`)}
                  checked={draft.sort === option}
                  onSelect={() => toggleSort(option)}
                />
              ))}
            </div>

            <p className="mt-4 font-bold text-ink">{t("Filter.ByPrice")}</p>
            <div className="mt-1 space-y-1">
              {(["cheapest", "expensive"] as SortOption[]).map((option) => (
                <RadioRow
                  key={option}
                  label={t(`Sort.${option}`)}
                  checked={draft.sort === option}
                  onSelect={() => toggleSort(option)}
                />
              ))}
            </div>

            <hr className="my-6 border-neutral-200" />

            <h3 className="text-[22px] font-bold text-ink">{t("Filter.Amenities")}</h3>

            <p className="mt-3 font-bold text-ink">{t("Filter.Luggage")}</p>
            <div className="mt-1 space-y-1">
              {GARAGE_ORDER.map((garage) => (
                <RadioRow
                  key={garage}
                  label={tTrip(`Garage.${garage}`)}
                  checked={draft.garage === garage}
                  onSelect={() => setDraft((d) => ({ ...d, garage: d.garage === garage ? undefined : garage }))}
                />
              ))}
            </div>

            <p className="mt-4 font-bold text-ink">{t("Filter.Preferences")}</p>
            <div className="mt-2 space-y-3">
              {AMENITY_FILTERS.map((key) => (
                <label key={key} className="flex cursor-pointer items-center gap-3">
                  <Checkbox
                    checked={Boolean(draft.amenities[key])}
                    onCheckedChange={(checked) =>
                      setDraft((d) => ({ ...d, amenities: { ...d.amenities, [key]: checked === true || undefined } }))
                    }
                    className="size-6 rounded-md border-2 border-brand-400 data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand-500"
                  />
                  <span className="text-ink">{tTrip(`Features.${key}`)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="shrink-0 border-t border-neutral-100 px-5 pb-6 pt-4 safe-bottom">
            <Button
              onClick={() => {
                onApply(draft);
                onOpenChange(false);
              }}
              className="h-14 w-full rounded-full bg-brand-500 text-base font-semibold hover:bg-brand-600"
            >
              {t("Filter.Submit")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

/** Outlined green circle that fills when chosen — the app's radio. */
const RadioRow = ({ label, checked, onSelect }: { label: string; checked: boolean; onSelect: () => void }) => (
  <button type="button" onClick={onSelect} className="flex w-full cursor-pointer items-center gap-4 py-2 text-left">
    <span
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full border-2",
        checked ? "border-brand-500" : "border-brand-300"
      )}
    >
      {checked && <span className="size-3 rounded-full bg-brand-500" />}
    </span>
    <span className="text-ink">{label}</span>
  </button>
);
