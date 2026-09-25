"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircleMore, Music, PawPrint, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

/** The three ride preferences, in the order the mobile build lists them. */
export const PREFERENCE_KEYS = ["talkative", "music_allowed", "pets_allowed"] as const;
export type PreferenceKey = (typeof PREFERENCE_KEYS)[number];

export const PREFERENCE_ICON: Record<PreferenceKey, LucideIcon> = {
  talkative: MessageCircleMore,
  music_allowed: Music,
  pets_allowed: PawPrint,
};

export type PreferenceValues = Partial<Record<PreferenceKey, boolean>>;

/**
 * One collapsible preference row: the chosen answer with its icon, and the two
 * alternatives underneath once it is open.
 *
 * The icon is tinted by the answer rather than by the setting — green for the
 * permissive option, red for the restrictive one — which is how the profile
 * later renders the same three lines.
 */
export const PreferenceField = ({
  name,
  value,
  onChange,
}: {
  name: PreferenceKey;
  value?: boolean;
  onChange: (value: boolean) => void;
}) => {
  const t = useTranslations("App.Profile");
  const [open, setOpen] = useState(false);
  const Icon = PREFERENCE_ICON[name];

  const pick = (next: boolean) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <div>
      <p className="mb-1 text-[17px] font-bold text-ink">{t(`Prefs.${name}`)}</p>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center gap-3 py-2.5 text-left"
      >
        <Icon
          className={cn(
            "size-6 shrink-0",
            value == null ? "text-neutral-300" : value ? "text-brand-500" : "text-danger"
          )}
          strokeWidth={1.8}
        />
        <span className={cn("min-w-0 flex-1 truncate", value == null ? "text-ink-muted" : "text-ink")}>
          {value == null ? t("PickOne") : t(`PrefValue.${name}.${value ? "yes" : "no"}`)}
        </span>
        {open ? (
          <ChevronUp className="size-5 shrink-0 text-ink" />
        ) : (
          <ChevronDown className="size-5 shrink-0 text-ink" />
        )}
      </button>

      {open && (
        <div>
          {[true, false].map((option) => (
            <button
              key={String(option)}
              type="button"
              onClick={() => pick(option)}
              className="flex w-full cursor-pointer items-center gap-3 border-t border-neutral-200 py-3 text-left"
            >
              <span className="min-w-0 flex-1 truncate font-bold text-ink">
                {t(`PrefValue.${name}.${option ? "yes" : "no"}`)}
              </span>
              <Icon className={cn("size-6 shrink-0", option ? "text-brand-500" : "text-danger")} strokeWidth={1.8} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
