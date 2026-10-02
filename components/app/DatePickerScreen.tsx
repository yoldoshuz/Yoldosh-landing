"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

import { AppIcon } from "@/components/app/AppIcon";
import { cn } from "@/lib/utils";

/** How far ahead a trip can be looked for — the mobile build scrolls half a year. */
const MONTHS_AHEAD = 6;

const INTL_LOCALE: Record<string, string> = { ru: "ru-RU", uz: "uz-Latn-UZ", en: "en-GB" };

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const sameDay = (a?: Date, b?: Date) => Boolean(a && b && startOfDay(a).getTime() === startOfDay(b).getTime());

/** Six rows of seven, Monday first, padded with the neighbouring months' days. */
const monthGrid = (year: number, month: number) => {
  const first = new Date(year, month, 1);
  // getDay() is Sunday-first; shift so Monday is column 0.
  const lead = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Math.ceil((lead + daysInMonth) / 7) * 7;
  return Array.from({ length: cells }, (_, i) => new Date(year, month, i - lead + 1));
};

/**
 * Full-screen date choice, the way the mobile build asks for it.
 *
 * The popover calendar it replaces was a desktop control squeezed onto a
 * phone: small targets, a month dropdown, one month at a time. This is a
 * scrolling run of months with the whole screen to tap on, Monday first and
 * the weekend picked out in green, closing as soon as a day is chosen.
 */
export const DatePickerScreen = ({
  open,
  selected,
  onPick,
  onClose,
}: {
  open: boolean;
  selected?: Date;
  onPick: (date: Date) => void;
  onClose: () => void;
}) => {
  const t = useTranslations("App.Search");
  const locale = INTL_LOCALE[useLocale()] ?? "ru-RU";

  const today = startOfDay(new Date());

  const months = useMemo(() => {
    const now = new Date();
    return Array.from({ length: MONTHS_AHEAD }, (_, i) => new Date(now.getFullYear(), now.getMonth() + i, 1));
  }, []);

  const weekdays = useMemo(() => {
    const format = new Intl.DateTimeFormat(locale, { weekday: "short" });
    // 2024-01-01 was a Monday.
    return Array.from({ length: 7 }, (_, i) =>
      format
        .format(new Date(2024, 0, 1 + i))
        .replace(".", "")
        .toLowerCase()
    );
  }, [locale]);

  if (!open) return null;

  const monthTitle = (date: Date) => {
    const name = new Intl.DateTimeFormat(locale, { month: "long" }).format(date);
    const label = name.charAt(0).toUpperCase() + name.slice(1);
    // The year only earns its place once the run crosses into the next one.
    return date.getFullYear() === today.getFullYear() ? label : `${label} ${date.getFullYear()}`;
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-white">
      <div data-app-topbar className="shrink-0 bg-white">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2 px-4 py-3 lg:max-w-5xl">
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Close")}
            className="-ml-2 shrink-0 cursor-pointer rounded-full p-2 text-ink transition hover:bg-neutral-100"
          >
            <AppIcon name="close" className="size-5" />
          </button>
          <h1 className="min-w-0 flex-1 truncate text-center text-xl font-bold text-ink">{t("PickDate")}</h1>
          <span aria-hidden className="w-7 shrink-0" />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-10">
        <div className="mx-auto w-full max-w-2xl px-3 lg:max-w-xl">
          {months.map((month) => (
            <section key={month.toISOString()} className="pt-6">
              <h2 className="pb-4 text-center text-xl text-ink">{monthTitle(month)}</h2>

              <div className="grid grid-cols-7 text-center">
                {weekdays.map((day, i) => (
                  <span key={day} className={cn("pb-3 text-[17px]", i >= 5 ? "text-brand-600" : "text-ink")}>
                    {day}
                  </span>
                ))}

                {monthGrid(month.getFullYear(), month.getMonth()).map((day) => {
                  const inMonth = day.getMonth() === month.getMonth();
                  const past = day < today;
                  const weekend = day.getDay() === 0 || day.getDay() === 6;
                  const active = sameDay(day, selected ?? today);
                  const disabled = past || !inMonth;

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      disabled={disabled}
                      onClick={() => {
                        onPick(day);
                        onClose();
                      }}
                      className="grid h-14 cursor-pointer place-items-center disabled:cursor-default"
                    >
                      <span
                        className={cn(
                          "grid size-12 place-items-center rounded-full text-[17px] transition",
                          active && inMonth
                            ? "bg-brand-500 text-white"
                            : disabled
                              ? "text-neutral-400"
                              : weekend
                                ? "text-brand-600 hover:bg-brand-50"
                                : "text-ink hover:bg-neutral-100"
                        )}
                      >
                        {day.getDate()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
