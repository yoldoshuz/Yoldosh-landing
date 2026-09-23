"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter, type Locale } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import { Screen } from "@/components/app/kit";
import { FlagIcon, type FlagCode } from "@/components/functional/FlagIcon";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const LOCALES: { code: Locale; label: string; flag: FlagCode }[] = [
  { code: "ru", label: "Русский", flag: "ru" },
  { code: "uz", label: "O‘zbekcha", flag: "uz" },
  { code: "en", label: "English", flag: "en" },
];

export const LanguageScreen = () => {
  const t = useTranslations("App");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  /*
    Switching locale is a navigation — the prefix is part of the URL — so the
    radio is driven by local state rather than by `locale`. The tick moves the
    instant it is tapped instead of waiting for the server round trip, which is
    what made the old switcher feel like a page reload.
  */
  const [selected, setSelected] = useState<string>(locale);
  useEffect(() => setSelected(locale), [locale]);

  // Warm the other locales so the swap is a cache hit rather than a fetch.
  useEffect(() => {
    LOCALES.filter(({ code }) => code !== locale).forEach(({ code }) => {
      router.prefetch(pathname as any, { locale: code });
    });
  }, [locale, pathname, router]);

  const change = (next: string) => {
    if (next === locale) return;
    setSelected(next);
    // `scroll: false` keeps the list where it is; nothing about the page moved.
    startTransition(() => router.replace(pathname as any, { locale: next as Locale, scroll: false }));
  };

  return (
    <>
      <AppTopBar title={t("Settings.Language")} back="/profile" />
      <Screen>
        <RadioGroup value={selected} onValueChange={change} disabled={pending} className="gap-0">
          {LOCALES.map(({ code, label, flag }) => (
            <Label
              key={code}
              htmlFor={`locale-${code}`}
              className="flex cursor-pointer items-center gap-3 border-b border-neutral-200/70 py-4 font-normal"
            >
              <FlagIcon code={flag} className="h-6! w-9! shrink-0" />
              <span className="flex-1 text-base text-ink">{label}</span>
              {pending && selected === code ? (
                <Loader2 className="size-5 animate-spin text-brand-500" />
              ) : (
                <RadioGroupItem
                  id={`locale-${code}`}
                  value={code}
                  className="size-6 border-brand-500 text-brand-500 [&_svg]:size-3.5 [&_svg]:fill-brand-500"
                />
              )}
            </Label>
          ))}
        </RadioGroup>
      </Screen>
    </>
  );
};
