"use client";

import { useTranslations } from "next-intl";

import { AppTopBar } from "@/components/app/AppTopBar";
import { EmptyState, formatDateTime, ILLUSTRATION, Screen, Spinner } from "@/components/app/kit";
import { useMarkNotificationRead, useNotifications } from "@/hooks/api/useNotifications";
import { cn } from "@/lib/utils";

export const NotificationsScreen = () => {
  const t = useTranslations("App");
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();

  return (
    <>
      <AppTopBar title={t("Notifications.Title")} variant="green" back />

      {isLoading ? (
        <Spinner />
      ) : !notifications || notifications.length === 0 ? (
        <Screen className="flex flex-1 items-center justify-center">
          <EmptyState
            illustration={ILLUSTRATION.waiting}
            title={t("Notifications.Empty")}
            description={t("Notifications.EmptyText")}
          />
        </Screen>
      ) : (
        <Screen className="space-y-2 pt-4">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              disabled={n.isRead}
              onClick={() => void markRead.mutateAsync(n.id)}
              className={cn(
                "app-card w-full p-4 text-left transition",
                n.isRead ? "opacity-70" : "cursor-pointer bg-brand-50 hover:shadow-md"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold text-ink">{n.title}</p>
                <span className="shrink-0 text-xs text-ink-muted">{formatDateTime(n.createdAt)}</span>
              </div>
              <p className="mt-1 text-sm text-neutral-600">{n.body}</p>
              {!n.isRead && <p className="mt-2 text-xs font-medium text-brand-600">{t("Notifications.TapToRead")}</p>}
            </button>
          ))}
        </Screen>
      )}
    </>
  );
};
