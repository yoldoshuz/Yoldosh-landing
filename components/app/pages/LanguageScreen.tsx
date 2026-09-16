"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { usePathname, useRouter } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import { Screen } from "@/components/app/kit";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { Locale } from "@/app/i18n/routing";

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uz", label: "O‘zbekcha", flag: "🇺🇿" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export const LanguageScreen = () => {
  const t = useTranslations("App");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const change = (next: string) => {
    // Re-render this same screen under the new locale.
    startTransition(() => router.replace(pathname as any, { locale: next as Locale }));
  };

  return (
    <>
      <AppTopBar title={t("Settings.Language")} back="/profile" />
      <Screen>
        <RadioGroup value={locale} onValueChange={change} disabled={pending} className="gap-0">
          {LOCALES.map(({ code, label, flag }) => (
            <Label
              key={code}
              htmlFor={`locale-${code}`}
              className="flex cursor-pointer items-center gap-3 border-b border-neutral-200/70 py-4 font-normal"
            >
              <span className="text-2xl leading-none" aria-hidden>
                {flag}
              </span>
              <span className="flex-1 text-base text-ink">{label}</span>
              {pending && locale !== code ? (
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
