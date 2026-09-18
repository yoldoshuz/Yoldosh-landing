"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Loader2, MoveRight, SendHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/app/i18n/routing";
import { ErrorNote, formatDate, formatTime, Spinner } from "@/components/app/kit";
import { UserAvatar } from "@/components/app/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatMessages, useSendMessage } from "@/hooks/api/useChat";
import { useUsersByIds } from "@/hooks/api/useProfile";
import { useAppTrip } from "@/hooks/api/useAppTrips";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

export const ChatScreen = ({ chatId }: { chatId: string }) => {
  const t = useTranslations("App");
  const router = useRouter();
  const { user } = useAuth();

  const { data, isLoading } = useChatMessages(chatId);
  const sendMessage = useSendMessage(chatId);
  const { data: trip } = useAppTrip(data?.chat?.tripId);

  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = data?.messages ?? [];
  const chat = data?.chat;
  const otherId = chat?.participant1Id === user?.id ? chat?.participant2Id : chat?.participant1Id;
  const users = useUsersByIds([otherId]);
  const other = (otherId ? users[otherId] : undefined) ?? (chat?.participant1Id === user?.id ? chat?.participant2 : chat?.participant1);

  // Keep the newest message in view as the poll brings new ones in.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  const submit = async () => {
    const content = draft.trim();
    if (!content) return;
    setError(null);
    setDraft("");
    try {
      await sendMessage.mutateAsync(content);
    } catch (e) {
      setDraft(content);
      setError(apiErrorMessage(e, t("Errors.Generic")));
    }
  };

  return (
    <div data-fullscreen className="flex min-h-screen flex-col">
      <header className="app-topbar sticky top-0 z-30 lg:border-b lg:border-neutral-200">
        <div className="mx-auto flex h-14 w-full max-w-2xl items-center gap-3 px-4 lg:max-w-5xl lg:px-8">
          <button
            type="button"
            onClick={() => router.push("/chats")}
            aria-label={t("Nav.Back")}
            className="-ml-2 cursor-pointer rounded-full p-2 text-white transition hover:bg-white/15 lg:text-ink lg:hover:bg-neutral-200/60"
          >
            <ArrowLeft className="size-5" />
          </button>
          <UserAvatar
            src={other?.avatar}
            name={other?.firstName}
            className="size-9"
            fallbackClassName="bg-white/25 lg:bg-brand-400"
          />
          <p className="min-w-0 flex-1 truncate font-bold text-white lg:text-lg lg:text-ink">
            {other?.firstName ?? t("Chats.Unknown")}
          </p>
        </div>
      </header>

      {trip && (
        <div className="border-b border-neutral-100 bg-white">
          <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3 lg:max-w-5xl lg:px-8">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate font-medium text-ink">
                <span className="truncate">{trip.from_location?.city ?? trip.from_city}</span>
                <MoveRight className="size-4 shrink-0" />
                <span className="truncate">{trip.to_location?.city ?? trip.to_city}</span>
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {formatDate(trip.departure_ts)} · {t("Trip.SeatsLeft", { count: trip.seats_available })}
              </p>
            </div>
            <Link
              href={`/ride/${trip.id}` as any}
              className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink"
            >
              {t("Chats.Details")}
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="flex-1 bg-chat-bg lg:bg-app-bg">
        <div className="mx-auto w-full max-w-2xl space-y-2 px-4 py-4 lg:max-w-5xl lg:px-8">
          {isLoading ? (
            <Spinner />
          ) : messages.length === 0 ? (
            <p className="py-10 text-center text-sm text-ink-muted">{t("Chats.NoMessages")}</p>
          ) : (
            messages.map((message, index) => {
              const mine = message.senderId === user?.id;
              const prev = messages[index - 1];
              const showDay =
                !prev || new Date(prev.createdAt).toDateString() !== new Date(message.createdAt).toDateString();

              return (
                <div key={message.id}>
                  {showDay && (
                    <div className="my-3 flex justify-center">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-ink shadow-sm">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  )}
                  <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "flex max-w-[78%] items-end gap-2 rounded-2xl px-3.5 py-2 text-sm",
                        mine ? "bg-brand-500 text-white" : "bg-white text-ink shadow-sm"
                      )}
                    >
                      <span className="whitespace-pre-wrap break-words">{message.content}</span>
                      <span className={cn("flex shrink-0 items-center gap-0.5 text-[10px]", mine ? "text-white/80" : "text-ink-muted")}>
                        {formatTime(message.createdAt)}
                        {mine && <Check className="size-3" />}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-neutral-100 bg-white pb-3 pt-3 safe-bottom">
        <div className="mx-auto w-full max-w-2xl px-4 lg:max-w-5xl lg:px-8">
          <ErrorNote message={error} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            className="mt-1 flex items-center gap-2"
          >
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("Chats.Placeholder")}
              className="h-12 rounded-full border-0 bg-neutral-100 px-5"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!draft.trim() || sendMessage.isPending}
              aria-label={t("Send")}
              className="size-12 shrink-0 rounded-full bg-brand-500 hover:bg-brand-600 disabled:bg-neutral-200"
            >
              {sendMessage.isPending ? <Loader2 className="size-5 animate-spin" /> : <SendHorizontal className="size-5" />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
