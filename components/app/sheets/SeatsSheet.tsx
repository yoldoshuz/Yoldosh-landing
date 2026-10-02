"use client";

import { useTranslations } from "next-intl";

import { AppSheet } from "@/components/app/AppSheet";
import { cn } from "@/lib/utils";

/** The mobile build offers up to seven — a full minivan. */
export const SEAT_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

/**
 * "Выберите пассажиров": a plain numbered list in a bottom sheet, the chosen
 * row green with a filled check. A dropdown under the field — what this
 * replaced — opened over the "Найти" button on a phone and hid it.
 */
export const SeatsSheet = ({
  open,
  value,
  onPick,
  onClose,
}: {
  open: boolean;
  value: number;
  onPick: (seats: number) => void;
  onClose: () => void;
}) => {
  const t = useTranslations("App.Search");

  return (
    <AppSheet
      open={open}
      onOpenChange={(next) => !next && onClose()}
      title={t("PickSeats")}
      className="[&_h2]:text-center"
    >
      <div className="divide-y divide-neutral-200 pb-8 safe-bottom">
        {SEAT_OPTIONS.map((n) => {
          const active = n === value;
          return (
            <button
              key={n}
              type="button"
              onClick={() => {
                onPick(n);
                onClose();
              }}
              className="flex w-full cursor-pointer items-center justify-between py-4 text-left"
            >
              <span className={cn("text-xl", active ? "text-brand-600" : "text-ink")}>{n}</span>
              {active && <CheckDisc />}
            </button>
          );
        })}
      </div>
    </AppSheet>
  );
};

const CheckDisc = () => (
  <svg viewBox="0 0 24 24" className="size-7 shrink-0" aria-hidden>
    <circle cx="12" cy="12" r="12" className="fill-brand-500" />
    <path
      d="m7 12.5 3.2 3.2L17 9"
      fill="none"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
