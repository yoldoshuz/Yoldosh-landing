import type { Pathnames } from "@/app/i18n/routing";
import type { AppIconName } from "./AppIcon";

export interface AppNavItem {
  href: Pathnames;
  /** Key inside the `App.Nav` message namespace. */
  labelKey: string;
  icon: AppIconName;
}

/**
 * The five tabs of the mobile build, in its order: Поиск, Создать, Поездки,
 * Чат, Профиль. The desktop sidebar leads with the same five so muscle memory
 * carries across, then adds what the phone hides behind Профиль.
 */
export const primaryNavItems: AppNavItem[] = [
  { href: "/search", labelKey: "Search", icon: "search" },
  { href: "/publish", labelKey: "Publish", icon: "vector" },
  { href: "/my-trips", labelKey: "MyTrips", icon: "arrow_right" },
  { href: "/chats", labelKey: "Chats", icon: "chat" },
  { href: "/profile", labelKey: "Profile", icon: "group" },
];

/** Desktop-only extras — on mobile these live inside the Профиль tab. */
export const secondaryNavItems: AppNavItem[] = [
  { href: "/parcels", labelKey: "Parcels", icon: "suitcase" },
  { href: "/wallet", labelKey: "Wallet", icon: "wallet" },
  { href: "/notifications", labelKey: "Notifications", icon: "notification" },
  { href: "/profile/cars", labelKey: "Cars", icon: "ic_small_car" },
];

export const bottomNavItems = primaryNavItems;
