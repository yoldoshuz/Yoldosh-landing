"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronRight, Loader2, MoveRight, SendHorizontal, Smile } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/app/i18n/routing";
import { UserAvatar } from "@/components/app/UserAvatar";
import { ErrorNote, formatDayLabel, formatDate, formatTime, Spinner } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatMessages, useChats, useSendMessage } from "@/hooks/api/useChat";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

export const ChatScreen = ({ chatId }: { chatId: string }) => {
  const t = useTranslations("App");
  const router = useRouter();
  const { user } = useAuth();

  const { data, isLoading } = useChatMessages(chatId);
  const { data: chats } = useChats();
  const sendMessage = useSendMessage(chatId);

  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const messages = data?.messages ?? [];
  const trip = data?.trip;

  /*
    The messages payload carries the trip but not the chat, so the counterpart
    comes from the chats list (already cached). Falling back to the trip's
    driver covers a deep link opened before that list has loaded.
  */
  const chat = chats?.find((c) => c.id === chatId);
  const other =
    (chat ? (chat.participant1Id === user?.id ? chat.participant2 : chat.participant1) : undefined) ?? trip?.driver;

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
            {other?.firstName?.trim() || t("Chats.Unknown")}
          </p>
        </div>
      </header>

      {/* The trip this conversation is about, pinned right under the header. */}
      {trip && (
        <div className="border-b border-neutral-100 bg-white">
          <div className="mx-auto flex w-full max-w-2xl items-center gap-3 px-4 py-3 lg:max-w-5xl lg:px-8">
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 truncate text-[15px] font-medium text-ink">
                <span className="truncate">{trip.from_city}</span>
                <MoveRight className="size-4 shrink-0" />
                <span className="truncate">{trip.to_city}</span>
              </p>
              <p className="mt-0.5 text-xs text-ink-muted">
                {formatDate(trip.date)},{" "}
                {trip.passengerCount
                  ? t("Chats.PassengerCount", { count: trip.passengerCount })
                  : t("Chats.NoPassengers")}
              </p>
            </div>
            <Link
              href={`/ride/${trip.tripid}` as any}
              className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink"
            >
              {t("Chats.Details")}
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="flex-1 bg-chat-bg lg:bg-app-bg">
        <div className="mx-auto w-full max-w-2xl space-y-1.5 px-4 py-4 lg:max-w-5xl lg:px-8">
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
                      <span className="rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-ink shadow-sm">
                        {formatDayLabel(message.createdAt)}
                      </span>
                    </div>
                  )}
                  <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "flex max-w-[80%] items-end gap-2 px-3.5 py-2 text-[15px]",
                        mine
                          ? "rounded-2xl rounded-br-md bg-brand-500 text-white"
                          : "rounded-2xl rounded-bl-md bg-white text-ink shadow-sm"
                      )}
                    >
                      <span className="whitespace-pre-wrap break-words">{message.content}</span>
                      <span
                        className={cn(
                          "flex shrink-0 translate-y-0.5 items-center gap-0.5 text-[10px]",
                          mine ? "text-white/85" : "text-ink-muted"
                        )}
                      >
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
            <span
              aria-hidden
              className="grid size-12 shrink-0 place-items-center rounded-full bg-neutral-100 text-neutral-400"
            >
              <Smile className="size-5" />
            </span>
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
              {sendMessage.isPending ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <SendHorizontal className="size-5" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
