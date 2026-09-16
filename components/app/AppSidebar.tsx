"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronRight, LogOut, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/app/i18n/routing";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/app/UserAvatar";
import { useNotifications } from "@/hooks/api/useNotifications";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { primaryNavItems, secondaryNavItems, type AppNavItem } from "./nav-items";

const LanguageSwitcher = dynamic(
  () => import("@/components/functional/LanguageSwitcher").then((m) => m.LanguageSwitcher),
  { ssr: false }
);

/**
 * Desktop navigation: a floating glass panel inset from the viewport edge —
 * the same detached material as the mobile tab bar, so the two surfaces read
 * as one system. Always expanded: the app has nine destinations and no
 * horizontal pressure on a desktop viewport, so a collapse control would only
 * add a decision without buying anything.
 */
export const AppSidebar = () => {
  const t = useTranslations("App.Nav");
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { data: notifications } = useNotifications();

  const unread = notifications?.filter((n) => !n.isRead).length ?? 0;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const renderItem = (item: AppNavItem) => {
    const active = isActive(item.href);
    return (
      <li key={item.href}>
        <Link
          href={item.href as any}
          aria-current={active ? "page" : undefined}
          className={cn(
            "group relative flex items-center gap-3.5 rounded-2xl px-3.5 py-3 text-[15px] transition",
            active
              ? "bg-brand-500 font-semibold text-white shadow-[0_6px_18px_-6px_rgba(38,188,75,0.65)]"
              : "font-medium text-neutral-600 hover:bg-neutral-100 hover:text-ink"
          )}
        >
          <item.icon className="size-5 shrink-0" strokeWidth={active ? 2.3 : 1.9} />
          <span className="min-w-0 flex-1 truncate">{t(item.labelKey)}</span>
          {item.href === "/notifications" && unread > 0 && (
            <span
              className={cn(
                "grid min-w-5 shrink-0 place-items-center rounded-full px-1.5 text-xs font-bold",
                active ? "bg-white text-brand-600" : "bg-brand-500 text-white"
              )}
            >
              {unread > 99 ? "99+" : unread}
            </span>
          )}
        </Link>
      </li>
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 p-3 lg:block">
      <div className="app-glass flex h-full flex-col rounded-[28px] p-3">
        <Link href="/search" className="flex items-center gap-2.5 px-2 py-3">
          <Image src="/assets/logo.svg" alt="Yoldosh" width={38} height={38} draggable={false} priority />
          <span className="text-2xl font-bold tracking-tight text-ink">Yo&apos;ldosh</span>
        </Link>

        <nav className="mt-2 min-h-0 flex-1 overflow-y-auto no-scrollbar">
          <ul className="space-y-1.5">{primaryNavItems.map(renderItem)}</ul>

          <p className="px-3.5 pb-1 pt-5 text-xs font-semibold uppercase tracking-wider text-ink-muted">{t("More")}</p>
          <ul className="space-y-1.5">{secondaryNavItems.map(renderItem)}</ul>
        </nav>

        <div className="mt-3 space-y-2 border-t border-black/5 pt-3">
          {/* Full-width so it lines up with the nav items above it. */}
          <LanguageSwitcher className="w-full justify-between" />

          <div className="flex items-center gap-2 rounded-2xl bg-white/70 p-2">
            <Link href="/profile" className="flex min-w-0 flex-1 items-center gap-2.5">
              <UserAvatar src={user?.avatar} name={user?.firstName} className="size-10" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">
                  {user?.firstName} {user?.lastName ?? ""}
                </span>
                <span className="flex items-center gap-1 font-mono text-xs text-star">
                  <Star className="size-3 fill-star stroke-star" />
                  {(user?.rating ?? 0).toFixed(1)}
                </span>
              </span>
              <ChevronRight className="size-4 shrink-0 text-ink-muted" />
            </Link>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={t("Logout")}
              onClick={() => void logout()}
              className="size-8 shrink-0 text-neutral-400 hover:bg-red-50 hover:text-danger"
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
};
