"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { ChevronRight, Loader2, type LucideIcon } from "lucide-react";

import { Link } from "@/app/i18n/routing";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { BookingStatus, CarStatus, ParcelStatus, TripStatus } from "@/types/api";

/* ------------------------------------------------------------------ layout */

/** Page body: phone-width column on mobile, roomier and centred on desktop. */
export const Screen = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("mx-auto w-full max-w-2xl px-4 pb-6 pt-1 lg:max-w-5xl lg:px-8 lg:pt-2", className)}>{children}</div>
);

export const SectionLabel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h2 className={cn("mb-2 mt-6 text-base font-bold text-ink first:mt-0 lg:mb-3 lg:text-xl", className)}>{children}</h2>
);

/* ------------------------------------------------------------------- rows */

interface RowProps {
  icon?: LucideIcon;
  label: ReactNode;
  description?: ReactNode;
  href?: string;
  onClick?: () => void;
  /** Filled green treatment, as used for "Помощь и поддержка". */
  accent?: boolean;
  danger?: boolean;
  trailing?: ReactNode;
  disabled?: boolean;
}

/**
 * The settings-list row that repeats across the whole app: optional icon, a
 * label, and a chevron. Renders as a link, a button, or a plain div depending
 * on what it was given, so it never produces an interactive element with
 * nothing to do.
 */
export const Row = ({ icon: Icon, label, description, href, onClick, accent, danger, trailing, disabled }: RowProps) => {
  const body = (
    <>
      {Icon && (
        <Icon
          className={cn("size-5 shrink-0", accent ? "text-white" : danger ? "text-danger" : "text-ink")}
          strokeWidth={1.8}
        />
      )}
      <span className="min-w-0 flex-1">
        <span className={cn("block font-medium", danger && !accent && "text-danger")}>{label}</span>
        {description && (
          <span className={cn("mt-0.5 block text-sm", accent ? "text-white/80" : "text-ink-muted")}>{description}</span>
        )}
      </span>
      {trailing ?? (
        <ChevronRight
          className={cn("size-5 shrink-0", accent ? "text-white" : danger ? "text-danger" : "text-ink-muted")}
        />
      )}
    </>
  );

  const className = cn(accent ? "app-row-accent" : "app-row", disabled && "pointer-events-none opacity-60");

  if (href) {
    return (
      <Link href={href as any} className={className}>
        {body}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} disabled={disabled} className={cn(className, "cursor-pointer")}>
        {body}
      </button>
    );
  }
  return <div className={className}>{body}</div>;
};

/* ------------------------------------------------------------- empty state */

/**
 * Illustration-led empty state, matching the mobile build: artwork, then a
 * bold centred sentence, then an optional action.
 */
export const EmptyState = ({
  illustration,
  title,
  description,
  action,
  className,
}: {
  illustration: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) => (
  // Self-centres inside whatever it is dropped into, so a caller only has to
  // give it room rather than arrange it.
  <div className={cn("mx-auto flex w-full max-w-md flex-col items-center px-6 py-10 text-center", className)}>
    <Image
      src={illustration}
      alt=""
      width={320}
      height={220}
      className="mb-6 h-auto w-full max-w-[280px] object-contain"
      priority={false}
    />
    <p className="text-xl font-bold text-ink lg:text-2xl">{title}</p>
    {description && <p className="mt-2 text-ink-muted">{description}</p>}
    {action && <div className="mt-6 w-full max-w-xs">{action}</div>}
  </div>
);

/** Artwork shipped with the app, referenced by name instead of raw paths. */
export const ILLUSTRATION = {
  noTrips: "/assets/app/no-trips.png",
  noChats: "/assets/app/no-chats.png",
  noReviews: "/assets/app/no-reviews.png",
  noCar: "/assets/app/no-car.png",
  underConstruction: "/assets/app/under-construction.png",
  money: "/assets/app/money.png",
  documents: "/assets/app/documents.png",
  waiting: "/assets/app/waiting.png",
  problem: "/assets/app/problem.png",
  success: "/assets/app/success.png",
} as const;

/* ------------------------------------------------------------------ status */

const STATUS_TONE: Record<string, string> = {
  CREATED: "bg-brand-50 text-brand-700",
  IN_PROGRESS: "bg-amber-100 text-amber-700",
  COMPLETED: "bg-brand-50 text-brand-700",
  CANCELED: "bg-neutral-100 text-ink-muted",
  CANCELLED: "bg-neutral-100 text-ink-muted",
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-brand-50 text-brand-700",
  FAILED: "bg-red-50 text-danger",
  REJECTED: "bg-red-50 text-danger",
  VERIFIED: "bg-brand-50 text-brand-700",
  WAITING_MYID: "bg-blue-50 text-blue-600",
  PICKED_UP: "bg-blue-50 text-blue-600",
  DELIVERED: "bg-brand-50 text-brand-700",
};

export const StatusBadge = ({
  status,
  label,
}: {
  status: TripStatus | BookingStatus | CarStatus | ParcelStatus;
  label: string;
}) => (
  <span
    className={cn(
      "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold",
      STATUS_TONE[status] ?? "bg-neutral-100 text-ink-muted"
    )}
  >
    {label}
  </span>
);

/* ----------------------------------------------------------------- filler */

export const Spinner = ({ className }: { className?: string }) => (
  <div className={cn("grid place-items-center py-16", className)}>
    <Loader2 className="size-6 animate-spin text-brand-500" />
  </div>
);

export const ErrorNote = ({ message }: { message?: string | null }) =>
  message ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{message}</p> : null;

export const SuccessNote = ({ message }: { message?: string | null }) =>
  message ? <p className="rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">{message}</p> : null;

/* ------------------------------------------------------------- completion */

/**
 * "Заполните свой профиль" card — a pale green panel with one progress segment
 * per checklist item and a link to the next unfinished one.
 */
export const CompletionCard = ({
  title,
  description,
  done,
  total,
  progressLabel,
  nextAction,
}: {
  title: string;
  description: string;
  done: number;
  total: number;
  progressLabel: string;
  nextAction?: ReactNode;
}) => (
  <div className="rounded-[var(--radius-card)] bg-brand-50 p-5">
    <p className="text-xl font-bold text-ink">{title}</p>
    <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">{description}</p>
    <p className="mt-4 font-semibold text-ink">{progressLabel}</p>
    <div className="mt-2 flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn("h-1.5 flex-1 rounded-full", i < done ? "bg-brand-500" : "bg-brand-200/60")}
          aria-hidden
        />
      ))}
    </div>
    {/* The segmented bar is decorative; this carries the value to screen readers. */}
    <Progress value={total ? (done / total) * 100 : 0} className="sr-only" />
    {nextAction && <div className="mt-4">{nextAction}</div>}
  </div>
);

/* ------------------------------------------------------------- formatting */

export const formatMoney = (value?: number | null, currency = "UZS") =>
  value == null ? "—" : `${Math.round(value).toLocaleString("ru-RU")} ${currency}`;

export const formatDateTime = (value?: string | Date | null, locale = "ru-RU") => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString(locale, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
};

export const formatDate = (value?: string | Date | null, locale = "ru-RU") => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString(locale);
};

/**
 * Turns a calendar day into a `departure_date` the search endpoint accepts.
 *
 * The API rejects anything not strictly in the future. A day picked from the
 * calendar is local midnight, and Uzbekistan is UTC+5, so "today" serialises to
 * 19:00 *yesterday* in UTC and comes back 400. Today therefore departs from
 * right now; any later day departs from its own local midnight, which is still
 * safely ahead.
 */
export const toDepartureDate = (day?: Date): string => {
  const now = new Date();
  if (!day) return now.toISOString();

  const start = new Date(day);
  start.setHours(0, 0, 0, 0);

  return start.getTime() <= now.getTime() ? now.toISOString() : start.toISOString();
};

/**
 * `24 февраля 2027` — the section heading above a day's trips.
 *
 * Built from parts because the Russian long-date format appends an era marker
 * ("24 февраля 2027 г."), which the app does not show.
 */
export const formatLongDate = (value?: string | Date | null, locale = "ru-RU") => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  return new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", year: "numeric" })
    .formatToParts(d)
    .filter((part) => part.type !== "era" && !(part.type === "literal" && part.value.trim() === "г."))
    .map((part) => part.value)
    .join("")
    .replace(/s*г.?$/, "")
    .trim();
};

/**
 * Trip clock times, read as wall-clock.
 *
 * Departure and arrival come back as UTC instants but the backend stores the
 * local schedule in them — a 00:00Z departure is a midnight departure, not 05:00
 * in Tashkent. Rendering them in the viewer's zone shifted every trip by the
 * offset, so they are formatted in UTC to match what the driver entered.
 */
export const formatTripTime = (value?: string | Date | null, locale = "ru-RU") => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "UTC" });
};

/** `18.09.26` — the compact stamp the chat list shows on the right. */
export const formatShortDate = (value?: string | Date | null, locale = "ru-RU") => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(locale, { day: "2-digit", month: "2-digit", year: "2-digit" });
};

/** Day separator inside a thread: "Сегодня", "Вчера", else "16 сентября". */
export const formatDayLabel = (value?: string | Date | null, locale = "ru-RU") => {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";

  const startOf = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
  const days = Math.round((startOf(new Date()) - startOf(d)) / 86_400_000);

  if (days === 0) return DAY_LABELS[locale]?.today ?? "Today";
  if (days === 1) return DAY_LABELS[locale]?.yesterday ?? "Yesterday";

  // Older days always carry the year, the way the notification feed shows it.
  return formatLongDate(d, locale);
};

const DAY_LABELS: Record<string, { today: string; yesterday: string }> = {
  "ru-RU": { today: "Сегодня", yesterday: "Вчера" },
  "uz-UZ": { today: "Bugun", yesterday: "Kecha" },
  "en-US": { today: "Today", yesterday: "Yesterday" },
};

export const formatTime = (value?: string | Date | null, locale = "ru-RU") => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", hour12: false });
};
