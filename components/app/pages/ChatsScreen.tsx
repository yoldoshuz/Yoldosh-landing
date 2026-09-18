"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import { UserAvatar } from "@/components/app/UserAvatar";
import { EmptyState, formatTime, ILLUSTRATION, Screen, Spinner } from "@/components/app/kit";
import { useChats } from "@/hooks/api/useChat";
import { useUsersByIds } from "@/hooks/api/useProfile";
import { useAuth } from "@/hooks/useAuth";

export const ChatsScreen = () => {
  const t = useTranslations("App");
  const { user } = useAuth();
  const { data: chats, isLoading } = useChats();

  // The API sends participant ids only, so resolve the other side separately.
  const otherIds = (chats ?? []).map((c) => (c.participant1Id === user?.id ? c.participant2Id : c.participant1Id));
  const users = useUsersByIds(otherIds);

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
              // The API returns both participants; "the other one" is whichever isn't us.
              const otherId = chat.participant1Id === user?.id ? chat.participant2Id : chat.participant1Id;
              const other = users[otherId] ?? (chat.participant1Id === user?.id ? chat.participant2 : chat.participant1);
              const last = chat.messages?.[chat.messages.length - 1];
              const mine = last?.senderId === user?.id;

              return (
                <Link
                  key={chat.id}
                  href={`/chats/${chat.id}` as any}
                  className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-neutral-50"
                >
                  <UserAvatar src={other?.avatar} name={other?.firstName} className="size-14" />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate font-bold text-ink">{other?.firstName ?? t("Chats.Unknown")}</p>
                      <span className="shrink-0 text-xs text-ink-muted">{formatTime(chat.lastMessageAt)}</span>
                    </div>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-muted">
                      {mine && <Check className="size-4 shrink-0 text-ink-muted" />}
                      <span className="truncate">{last?.content ?? t("Chats.NoMessages")}</span>
                    </p>
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
