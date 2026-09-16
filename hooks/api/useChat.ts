import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, toList } from "@/lib/api";
import type { AppChat, AppMessage } from "@/types/api";
import { qk } from "./keys";

export const chatApi = {
  chats: async () => {
    const { data } = await api.get("/chat");
    return toList<AppChat>(data.data?.chats ?? data.data);
  },
  start: async ({ tripId, participant2Id }: { tripId: string; participant2Id: string }) => {
    const { data } = await api.post("/chat", { tripId, participant2Id });
    return (data.data?.chat ?? data.data) as AppChat;
  },
  messages: async (chatId: string, page = 1, limit = 50) => {
    const { data } = await api.get(`/chat/${chatId}/messages`, { params: { page, limit } });
    return data.data as { messages: AppMessage[]; chat: AppChat };
  },
  send: async ({ chatId, content, mediaUrl }: { chatId: string; content: string; mediaUrl?: string }) => {
    const { data } = await api.post(`/chat/${chatId}/messages`, { content, ...(mediaUrl ? { mediaUrl } : {}) });
    return (data.data?.message ?? data.data) as AppMessage;
  },
};

export const useChats = () => useQuery({ queryKey: qk.chats, queryFn: chatApi.chats, refetchInterval: 20_000 });

export const useChatMessages = (chatId?: string) =>
  useQuery({
    queryKey: qk.chatMessages(chatId ?? ""),
    queryFn: () => chatApi.messages(chatId!),
    enabled: Boolean(chatId),
    // No socket wiring in this pass — a short poll keeps the thread live.
    refetchInterval: 8_000,
  });

export const useStartChat = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: chatApi.start,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.chats }),
  });
};

export const useSendMessage = (chatId?: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => chatApi.send({ chatId: chatId!, content }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.chatMessages(chatId ?? "") });
      qc.invalidateQueries({ queryKey: qk.chats });
    },
  });
};
