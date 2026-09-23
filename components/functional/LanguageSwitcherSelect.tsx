"use client";

import { useEffect, useState, useTransition } from "react";
import { useParams } from "next/navigation";
import { FlagIcon, type FlagCode } from "@/components/functional/FlagIcon";

import { usePathname, useRouter, type Locale } from "@/app/i18n/routing";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LanguageSwitcherSelectProps {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  /** Lets the app sidebar stretch the trigger to the full column width. */
  className?: string;
}

export const LanguageSwitcherSelect = ({ defaultValue, items, className }: LanguageSwitcherSelectProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  // Optimistic: the trigger shows the new language immediately, while the
  // locale navigation resolves behind it.
  const [selected, setSelected] = useState(defaultValue);
  useEffect(() => setSelected(defaultValue), [defaultValue]);

  // Warm the other locales so switching is a cache hit, not a fresh fetch.
  useEffect(() => {
    items
      .filter((item) => item.value !== defaultValue)
      .forEach((item) => router.prefetch({ pathname, params } as never, { locale: item.value as Locale }));
  }, [defaultValue, items, pathname, params, router]);

  const onChange = (nextLocale: string) => {
    setSelected(nextLocale);
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale as Locale, scroll: false }
      );
    });
  };

  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-8 w-auto font-medium bg-white border-none shadow-lg",
          isPending && "opacity-50 cursor-not-allowed",
          className
        )}
        disabled={isPending}
      >
        {/*
          No flag of its own: `SelectValue` already mirrors the chosen item,
          flag included, so a second one beside it was a duplicate.
        */}
        <SelectValue />
      </SelectTrigger>
      <SelectContent className={cn("w-auto font-medium z-999")}>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {/*
                `SelectItem` forces every descendant svg to `size-4`, which
                squashed the 4:3 flags into squares and left them floating
                inside the row. The important suffix is what beats that
                descendant rule.
              */}
              <span className="flex items-center gap-2.5">
                <FlagIcon code={item.value as FlagCode} className="h-4! w-6! shrink-0" />
                {item.label}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
