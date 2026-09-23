"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import { UserAvatar } from "@/components/app/UserAvatar";
import { EmptyState, formatShortDate, ILLUSTRATION, Screen, Spinner } from "@/components/app/kit";
import { useChats } from "@/hooks/api/useChat";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { AppChat } from "@/types/api";

/** The chat list expands both participants, so "the other one" is a lookup. */
const counterpartOf = (chat: AppChat, meId?: string) =>
  chat.participant1Id === meId ? chat.participant2 : chat.participant1;

const unreadFor = (chat: AppChat, meId?: string) =>
  (chat.participant1Id === meId ? chat.unreadCount1 : chat.unreadCount2) ?? 0;

export const ChatsScreen = () => {
  const t = useTranslations("App");
  const { user } = useAuth();
  const { data: chats, isLoading } = useChats();

  return (
    <>
      <AppTopBar title={t("Chats.Title")} variant="green" />

      {isLoading ? (
        <Spinner />
      ) : !chats || chats.length === 0 ? (
        <Screen className="flex flex-1 items-center justify-center">
          <EmptyState illustration={ILLUSTRATION.noChats} title={t("Chats.Empty")} />
        </Screen>
      ) : (
        <div className="mx-auto w-full max-w-2xl lg:max-w-5xl lg:px-8 lg:pt-4">
          <div className="divide-y divide-neutral-100 bg-white lg:rounded-[var(--radius-card)] lg:shadow-[0_2px_10px_-4px_rgba(0,0,0,0.10)]">
            {chats.map((chat) => {
              const other = counterpartOf(chat, user?.id);
              const last = chat.lastMessage;
              const mine = last?.senderId === user?.id;
              const unread = unreadFor(chat, user?.id);

              return (
                <Link
                  key={chat.id}
                  href={`/chats/${chat.id}` as any}
                  className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-neutral-50"
                >
                  <UserAvatar src={other?.avatar} name={other?.firstName} className="size-14" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate font-bold text-ink">{other?.firstName?.trim() || t("Chats.Unknown")}</p>
                      <span className="shrink-0 text-xs text-ink-muted">
                        {formatShortDate(last?.createdAt ?? chat.updatedAt)}
                      </span>
                    </div>

                    <div className="mt-0.5 flex items-center gap-2">
                      <p className="flex min-w-0 flex-1 items-center gap-1.5 text-sm text-ink-muted">
                        {/* A tick marks our own last message, the way the app does. */}
                        {mine && last && (
                          <Check className={cn("size-4 shrink-0", last.isRead ? "text-brand-500" : "text-ink-muted")} />
                        )}
                        <span className="truncate">{last?.content ?? t("Chats.NoMessages")}</span>
                      </p>

                      {unread > 0 && (
                        <span className="grid min-w-5 shrink-0 place-items-center rounded-full bg-brand-500 px-1.5 text-xs font-bold text-white">
                          {unread > 99 ? "99+" : unread}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
