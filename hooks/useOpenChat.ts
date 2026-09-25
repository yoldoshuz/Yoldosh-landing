"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { qk } from "@/hooks/api/keys";
import { chatApi } from "@/hooks/api/useChat";
import type { AppChat } from "@/types/api";

const find = (chats: AppChat[] | undefined, tripId: string, participantId: string) =>
  chats?.find(
    (chat) => chat.tripId === tripId && (chat.participant1Id === participantId || chat.participant2Id === participantId)
  );

/**
 * Opens the conversation about a trip, creating it only if there is none.
 *
 * `POST /chat` refuses a thread that already exists, which is what turned
 * "Написать" into an error message for anyone messaging the same driver twice.
 * The existing chat is looked up first, and a failed create is retried against
 * a freshly fetched list before the error is allowed to surface — the race
 * where two taps land at once resolves into the chat rather than a failure.
 */
export const useOpenChat = () => {
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();

  return useCallback(
    async ({ tripId, participantId }: { tripId: string; participantId: string }) => {
      // The localized router resolves hrefs through the `pathnames` map, which
      // has no entry for a filled-in dynamic route — hence the manual prefix.
      const open = (chatId: string) => router.push(`/${locale}/chats/${chatId}`);

      // Read from the cache rather than subscribing: this hook is used on the
      // trip screen, and a `useChats()` there would put its 20-second poll on
      // a page that shows no chats at all.
      const known = find(queryClient.getQueryData<AppChat[]>(qk.chats), tripId, participantId);
      if (known) {
        open(known.id);
        return;
      }

      try {
        const chat = await chatApi.start({ tripId, participant2Id: participantId });
        await queryClient.invalidateQueries({ queryKey: qk.chats });
        open(chat.id);
      } catch (error) {
        const fresh = await queryClient.fetchQuery({ queryKey: qk.chats, queryFn: chatApi.chats });
        const existing = find(fresh, tripId, participantId);
        if (!existing) throw error;
        open(existing.id);
      }
    },
    [locale, queryClient, router]
  );
};
