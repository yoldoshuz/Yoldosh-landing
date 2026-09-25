"use client";

import type { CSSProperties } from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/app/i18n/routing";
import { useHaptic } from "@/hooks/useHaptic";
import { bottomNavItems } from "./nav-items";

const ACCENT = "#26bc4b";
const INACTIVE_ICON = "rgba(31,31,31,0.42)";
const INACTIVE_LABEL = "rgba(31,31,31,0.38)";

/**
 * Screens that take over the viewport and carry their own way out; the tab bar
 * would only cover their controls. next-intl's `usePathname` returns the route
 * template, so a dynamic segment matches by pattern rather than by id.
 */
const FULLSCREEN_ROUTES = ["/chats/[chatId]", "/ride/[tripId]"];

/* ───────────────────────────────────────────── */
/* LIQUID GLASS                                  */
/* ───────────────────────────────────────────── */

const glassBase: CSSProperties = {
  position: "relative",
  overflow: "hidden",

  // Very transparent → the page reads clearly through the glass.
  background: "rgba(255,255,255,0.28)",

  // Light blur keeps it reflective and see-through rather than frosted.
  backdropFilter: "blur(10px) saturate(150%)",
  WebkitBackdropFilter: "blur(10px) saturate(150%)",

  border: "1px solid rgba(255,255,255,0.55)",

  // Flat: a softened top inset highlight, no bulge.
  boxShadow: `
    inset 0 0.5px 0 rgba(255,255,255,0.75),
    0 8px 30px rgba(0,0,0,0.16),
    0 0 0 0.5px rgba(0,0,0,0.03)
  `,

  isolation: "isolate",
};

/**
 * The refraction stack.
 *
 * A second `backdrop-filter` layer bled past the element's own bounds is what
 * produces the lens: it resamples the already-blurred backdrop, so edges behind
 * the bar bend instead of merely softening. The gradients on top add the
 * specular detail — a screen-blended glint in the corners and a thin flat sheen
 * along the top rim.
 */
const LiquidGlass = ({ radius }: { radius: number | string }) => (
  <>
    {/* MAIN REFRACTION — a lighter blur lets more show through. */}
    <span
      aria-hidden
      style={{
        position: "absolute",
        inset: -20,
        borderRadius: radius,
        pointerEvents: "none",
        zIndex: 0,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        opacity: 0.65,
      }}
    />

    {/* EDGE DISTORTION — toned down so it reads flat, not bulging. */}
    <span
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: radius,
        pointerEvents: "none",
        zIndex: 1,
        background: `
          radial-gradient(circle at top left, rgba(255,255,255,0.5), transparent 26%),
          radial-gradient(circle at top right, rgba(255,255,255,0.4), transparent 22%)
        `,
        mixBlendMode: "screen",
        filter: "blur(16px)",
      }}
    />

    {/* TOP SHEEN — thin, flat highlight (no convex dome). */}
    <span
      aria-hidden
      style={{
        position: "absolute",
        left: "8%",
        right: "8%",
        top: 1,
        height: "22%",
        borderRadius: "999px",
        background: `
          linear-gradient(
            180deg,
            rgba(255,255,255,0.85) 0%,
            rgba(255,255,255,0.25) 60%,
            transparent 100%
          )
        `,
        filter: "blur(6px)",
        zIndex: 2,
        opacity: 0.6,
        pointerEvents: "none",
      }}
    />

    {/* OUTER EDGE */}
    <span
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: radius,
        pointerEvents: "none",
        zIndex: 4,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.5)",
      }}
    />
  </>
);

/* ───────────────────────────────────────────── */
/* ACTIVE LIQUID PILL                            */
/* ───────────────────────────────────────────── */

const activePillStyle: CSSProperties = {
  position: "absolute",
  inset: 3,
  borderRadius: 999,
  // Flat, single-tone fill — no top-bright / bottom-dark gradient.
  background: "white",
  backdropFilter: "blur(12px) saturate(160%)",
  WebkitBackdropFilter: "blur(12px) saturate(160%)",
  overflow: "hidden",
};

const springIn: Transition = { type: "spring", stiffness: 420, damping: 30 };
/** Overshoot-and-settle bounce on the icon of the tab you just landed on. */
const popScale: Transition = {
  duration: 0.42,
  times: [0, 0.55, 1],
  ease: [0.34, 1.56, 0.64, 1],
};

/* ───────────────────────────────────────────── */

export const BottomNav = () => {
  const t = useTranslations("App.Nav");
  const pathname = usePathname();
  const haptic = useHaptic();

  if (FULLSCREEN_ROUTES.includes(pathname)) return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const renderTab = (item: (typeof bottomNavItems)[number]) => {
    const active = isActive(item.href);
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href as any}
        aria-current={active ? "page" : undefined}
        onClick={() => haptic.selection()}
        className="relative flex h-full flex-1 flex-col items-center justify-center gap-1 no-underline"
        style={{ borderRadius: 999 }}
      >
        <AnimatePresence>
          {active && (
            <motion.span
              key={`active-${item.href}`}
              layoutId="liquid-pill"
              initial={{ opacity: 0, scale: 0.82 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.82 }}
              transition={springIn}
              style={{ ...activePillStyle, zIndex: 0 }}
            />
          )}
        </AnimatePresence>

        <motion.span
          animate={active ? { scale: [0.9, 1.18, 1] } : { scale: 0.9 }}
          transition={active ? popScale : springIn}
          style={{ position: "relative", zIndex: 10, display: "flex" }}
        >
          <Icon size={20} color={active ? ACCENT : INACTIVE_ICON} fill="none" strokeWidth={2} />
        </motion.span>

        <motion.span
          animate={{ color: active ? ACCENT : INACTIVE_LABEL }}
          transition={{ duration: 0.16 }}
          style={{
            position: "relative",
            zIndex: 10,
            fontSize: 10,
            lineHeight: 1,
            whiteSpace: "nowrap",
            fontWeight: active ? 600 : 400,
          }}
        >
          {t(item.labelKey)}
        </motion.span>
      </Link>
    );
  };

  return (
    <nav
      data-app-bar
      className="fixed bottom-[calc(0.75rem+var(--sa-bottom))] left-0 right-0 z-50 flex justify-center px-3 lg:hidden"
      aria-label={t("Primary")}
    >
      {/* One continuous bar: every tab shares the same glass, so the active
          pill can slide the whole width via `layoutId`. */}
      <div
        className="flex h-14 w-full max-w-sm items-center justify-around"
        style={{ ...glassBase, borderRadius: 999 }}
      >
        <LiquidGlass radius={999} />
        {bottomNavItems.map(renderTab)}
      </div>
    </nav>
  );
};
