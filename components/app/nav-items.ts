import {
  ArrowRight,
  Bell,
  CarFront,
  MessageCircle,
  Package,
  Plus,
  Search,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import type { Pathnames } from "@/app/i18n/routing";

export interface AppNavItem {
  href: Pathnames;
  /** Key inside the `App.Nav` message namespace. */
  labelKey: string;
  icon: LucideIcon;
}

/**
 * The five tabs of the mobile build, in its order: Поиск, Создать, Поездки,
 * Чат, Профиль. The desktop sidebar leads with the same five so muscle memory
 * carries across, then adds what the phone hides behind Профиль.
 */
export const primaryNavItems: AppNavItem[] = [
  { href: "/search", labelKey: "Search", icon: Search },
  { href: "/publish", labelKey: "Publish", icon: Plus },
  { href: "/my-trips", labelKey: "MyTrips", icon: ArrowRight },
  { href: "/chats", labelKey: "Chats", icon: MessageCircle },
  { href: "/profile", labelKey: "Profile", icon: User },
];

/** Desktop-only extras — on mobile these live inside the Профиль tab. */
export const secondaryNavItems: AppNavItem[] = [
  { href: "/parcels", labelKey: "Parcels", icon: Package },
  { href: "/wallet", labelKey: "Wallet", icon: Wallet },
  { href: "/notifications", labelKey: "Notifications", icon: Bell },
  { href: "/profile/cars", labelKey: "Cars", icon: CarFront },
];

export const bottomNavItems = primaryNavItems;
