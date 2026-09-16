import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, toList } from "@/lib/api";
import type { AppNotification } from "@/types/api";
import { qk } from "./keys";

export const notificationsApi = {
  list: async (page = 1, limit = 30) => {
    const { data } = await api.get("/notification", { params: { page, limit } });
    return toList<AppNotification>(data.data?.notifications ?? data.data);
  },
  markRead: async (notificationId: string) => (await api.patch(`/notification/${notificationId}/read`)).data,
  updateFcmToken: async (fcmToken: string) => (await api.post("/user/fcm-token", { fcmToken })).data,
};

export const useNotifications = () =>
  useQuery({ queryKey: qk.notifications, queryFn: () => notificationsApi.list(), refetchInterval: 60_000 });

export const useMarkNotificationRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.notifications }),
  });
};
