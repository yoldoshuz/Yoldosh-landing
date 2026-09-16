"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { ArrowLeft, Bell } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/app/i18n/routing";
import { useNotifications } from "@/hooks/api/useNotifications";
import { cn } from "@/lib/utils";

interface AppTopBarProps {
  title?: string;
  /**
   * `green` is the filled brand bar with a white title; `plain` sits on the
   * page background with a dark title. `hero` is the green panel with the
   * curved bottom edge that the home screen builds its search card into.
   */
  variant?: "green" | "plain" | "hero";
  /** Back arrow target; omit for a root tab. `true` uses browser history. */
  back?: string | true;
  /** Overrides the back arrow entirely — for in-place steps like "add a car". */
  onBack?: () => void;
  showLogo?: boolean;
  showBell?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export const AppTopBar = ({
  title,
  variant = "plain",
  back,
  onBack,
  showLogo,
  showBell,
  leading,
  trailing,
  children,
  className,
}: AppTopBarProps) => {
  const t = useTranslations("App.Nav");
  const router = useRouter();
  const { data: notifications } = useNotifications();
  const unread = notifications?.filter((n) => !n.isRead).length ?? 0;

  // Green is a phone-only treatment: on desktop the bar goes flat (see the
  // `@media` block on `.app-hero` / `.app-topbar`), so its contents have to
  // flip from white to ink at the same breakpoint.
  const green = variant === "green" || variant === "hero";
  const onGreen = green ? "text-white lg:text-ink" : "text-ink";
  const onGreenHover = green ? "hover:bg-white/15 lg:hover:bg-neutral-200/60" : "hover:bg-neutral-200/60";

  return (
    <header
      className={cn(
        variant === "hero" ? "app-hero pb-8 lg:pb-4" : variant === "green" ? "app-topbar" : "bg-app-bg",
        variant !== "hero" && "sticky top-0 z-30",
        // Breathing room so the first card does not sit right under the title.
        variant !== "hero" && "pb-2 lg:pb-4",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-2xl items-center gap-2 px-4 py-3 lg:h-20 lg:max-w-5xl lg:px-8">
        {(back || onBack) && (
          <button
            type="button"
            aria-label={t("Back")}
            onClick={() => (onBack ? onBack() : typeof back === "string" ? router.push(back as any) : router.back())}
            className={cn("-ml-2 shrink-0 cursor-pointer rounded-full p-2 transition", onGreen, onGreenHover)}
          >
            <ArrowLeft className="size-5 lg:size-6" />
          </button>
        )}

        {showLogo && !back && (
          <Link href="/search" className="shrink-0 lg:hidden">
            <Image src="/assets/logo.svg" alt="Yoldosh" width={28} height={28} draggable={false} />
          </Link>
        )}

        {leading}

        {title && (
          <h1
            className={cn(
              // Centred on phones to match the app; left-aligned and much
              // larger on desktop, where a centred 17px title looks lost
              // against a wide content column.
              "min-w-0 flex-1 truncate text-center text-[17px] font-bold lg:text-left lg:text-3xl",
              onGreen,
              !back && !onBack && !showLogo && !leading && !showBell && !trailing && "px-2"
            )}
          >
            {title}
          </h1>
        )}

        {trailing}

        {showBell && (
          <Link
            href="/notifications"
            aria-label={t("Notifications")}
            // Desktop already has Notifications in the sidebar, with the same
            // unread badge — a second entry point in the corner is noise.
            className={cn("relative ml-auto shrink-0 rounded-full p-2 transition lg:hidden", onGreen, onGreenHover)}
          >
            <Bell className="size-[22px] lg:size-6" />
            {unread > 0 && (
              <span
                className={cn(
                  "absolute right-1.5 top-1.5 size-2 rounded-full bg-danger ring-2",
                  green ? "ring-brand-500 lg:ring-app-bg" : "ring-app-bg"
                )}
              />
            )}
          </Link>
        )}
      </div>

      {children}
    </header>
  );
};
