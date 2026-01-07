"use client";

import { useTransition } from "react";

import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { Locale } from "@/app/i18n/config";
import { setUserLocale } from "@/app/i18n/locale";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface LanguageSwitcherSelectProps {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
}

export const LanguageSwitcherSelect = ({ defaultValue, items }: LanguageSwitcherSelectProps) => {
  const [isPending, startTransition] = useTransition();

  const onChange = async (value: string) => {
    const locale = value as Locale;
    startTransition(async () => {
      localStorage.setItem("locale", locale);
      await setUserLocale(locale);
    });
  };

  return (
    <Select defaultValue={defaultValue} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          "h-8 w-auto font-medium bg-white border-none shadow-lg",
          isPending && "opacity-50 cursor-not-allowed"
        )}
        disabled={isPending}
      >
        <Globe />
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className={cn(
          "w-auto font-medium z-999",
        )}
      >
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};