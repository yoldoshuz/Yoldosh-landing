"use client";

import { Bell, CarFront, Gift, MessageCircle, Megaphone, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppTopBar } from "@/components/app/AppTopBar";
import { EmptyState, formatDayLabel, formatTime, ILLUSTRATION, Screen, Spinner } from "@/components/app/kit";
import { useMarkNotificationRead, useNotifications } from "@/hooks/api/useNotifications";
import { cn } from "@/lib/utils";
import type { AppNotification, NotificationType } from "@/types/api";

const TYPE_STYLE: Record<NotificationType, { icon: LucideIcon; tone: string }> = {
  trips: { icon: CarFront, tone: "bg-brand-50 text-brand-600" },
  messages: { icon: MessageCircle, tone: "bg-brand-50 text-brand-600" },
  promotionAndDiscounts: { icon: Gift, tone: "bg-neutral-100 text-neutral-500" },
  newsAndAgreement: { icon: Megaphone, tone: "bg-neutral-100 text-neutral-500" },
  general: { icon: Bell, tone: "bg-neutral-100 text-neutral-500" },
};

/**
 * The body arrives under different names depending on which service emitted
 * the notification, and an empty card is worse than a slightly wrong field.
 */
const bodyOf = (n: AppNotification) =>
  n.body ?? (n as { content?: string; message?: string }).content ?? (n as { message?: string }).message ?? "";

/** Groups the feed into day sections, newest day first. */
const groupByDay = (notifications: AppNotification[]) => {
  const groups = new Map<string, AppNotification[]>();

  for (const item of [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )) {
    const key = new Date(item.createdAt).toDateString();
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }

  return [...groups.entries()];
};

export const NotificationsScreen = () => {
  const t = useTranslations("App");
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();

  const groups = groupByDay(notifications ?? []);

  return (
    <>
      <AppTopBar title={t("Notifications.Title")} back />

      {isLoading ? (
        <Spinner />
      ) : groups.length === 0 ? (
        <Screen className="flex flex-1 items-center justify-center">
          <EmptyState
            illustration={ILLUSTRATION.waiting}
            title={t("Notifications.Empty")}
            description={t("Notifications.EmptyText")}
          />
        </Screen>
      ) : (
        <Screen className="space-y-6">
          {groups.map(([day, items]) => (
            <section key={day}>
              <h2 className="mb-3 text-[17px] font-bold text-ink">{formatDayLabel(day)}</h2>

              <div className="space-y-2.5">
                {items.map((n) => {
                  const { icon: Icon, tone } = TYPE_STYLE[n.type] ?? TYPE_STYLE.general;
                  const body = bodyOf(n);

                  return (
                    <button
                      key={n.id}
                      type="button"
                      disabled={n.isRead}
                      onClick={() => void markRead.mutateAsync(n.id)}
                      className={cn(
                        "app-card flex w-full items-start gap-3.5 p-5 text-left transition",
                        n.isRead ? "opacity-80" : "cursor-pointer hover:shadow-md"
                      )}
                    >
                      <span className={cn("grid size-11 shrink-0 place-items-center rounded-full", tone)}>
                        <Icon className="size-5" strokeWidth={1.8} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-[17px] font-bold leading-snug text-ink">{n.title}</span>
                        {body && (
                          <span className="mt-1 block text-[15px] leading-snug text-neutral-500">{body}</span>
                        )}
                        <span className="mt-2.5 block text-xs text-neutral-400">{formatTime(n.createdAt)}</span>
                      </span>

                      {/* Unread dot rather than a label — the card is already tappable. */}
                      {!n.isRead && <span className="mt-1.5 size-2 shrink-0 rounded-full bg-brand-500" />}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </Screen>
      )}
    </>
  );
};
