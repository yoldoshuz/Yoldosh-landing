"use client";

import { useTransition } from "react";
import { useParams } from "next/navigation";
import { Globe } from "lucide-react";

import { usePathname, useRouter, type Locale } from "@/app/i18n/routing";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LanguageSwitcherSelectProps {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
}

export const LanguageSwitcherSelect = ({ defaultValue, items }: LanguageSwitcherSelectProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  const onChange = (nextLocale: string) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale: nextLocale as Locale }
      );
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
      <SelectContent className={cn("w-auto font-medium z-999")}>
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
