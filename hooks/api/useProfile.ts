import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, toList } from "@/lib/api";
import type { AppPromocode, AppUser, NotificationPreferences, NavigatorPreference, Gender } from "@/types/api";
import { qk } from "./keys";

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string | null;
  bio?: string | null;
  gender?: Gender;
  date_of__birthday?: string;
  talkative?: boolean;
  music_allowed?: boolean;
  pets_allowed?: boolean;
  preferred_navigator?: NavigatorPreference;
  notificationPreferences?: Partial<NotificationPreferences>;
}

export const profileApi = {
  me: async () => {
    const { data } = await api.get("/user/me");
    return data.data as AppUser;
  },
  fullProfile: async () => {
    const { data } = await api.get("/user/me/profile");
    return (data.data?.user ?? data.data) as AppUser;
  },
  update: async (payload: UpdateProfilePayload) => {
    const { data } = await api.patch("/user/me/profile", payload);
    return (data.data?.user ?? data.data) as AppUser;
  },
  updateAvatar: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.put("/user/avatar", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return (data.data?.user ?? data.data) as AppUser;
  },
  byId: async (userId: string) => {
    const { data } = await api.get(`/user/${userId}`);
    return data.data as AppUser;
  },
  blockedUsers: async () => {
    const { data } = await api.get("/user/blocked-users");
    return toList<Pick<AppUser, "id" | "firstName" | "lastName" | "avatar">>(data.data?.blockedUsers ?? data.data);
  },
  blockUser: async (userId: string) => (await api.post("/user/block-user", { userId })).data,
  unblockUser: async (userId: string) => (await api.post("/user/unblock-user", { userId })).data,
  reportUser: async ({ userId, reason, description }: { userId: string; reason: string; description: string }) =>
    (await api.post(`/user/${userId}/report`, { reason, description })).data,
  deleteAccount: async () => (await api.delete("/user/account")).data,
  promocodes: async () => {
    const { data } = await api.get("/user/me/promocodes");
    return toList<AppPromocode>(data.data);
  },
  activatePromocode: async (code: string) => {
    const { data } = await api.post("/user/me/promocodes/activate", { code });
    return data.data as AppPromocode;
  },
  searchHistory: async () => {
    const { data } = await api.get("/user/search-history", { params: { limit: 20 } });
    return toList<{ id: string; query: string; results: number; createdAt: string }>(data.data);
  },
  referral: async () => {
    const { data } = await api.get("/referral/get-ref");
    return data.data as { referralCode: string; referredCount: number };
  },
};

export const useFullProfile = () =>
  useQuery({ queryKey: qk.profile, queryFn: profileApi.fullProfile });

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profileApi.update,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.me });
      qc.invalidateQueries({ queryKey: qk.profile });
    },
  });
};

export const useUpdateAvatar = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profileApi.updateAvatar,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: qk.me });
      qc.invalidateQueries({ queryKey: qk.profile });
    },
  });
};

export const useBlockedUsers = () => useQuery({ queryKey: qk.blockedUsers, queryFn: profileApi.blockedUsers });

export const useUnblockUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profileApi.unblockUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.blockedUsers }),
  });
};

export const usePromocodes = () => useQuery({ queryKey: qk.promocodes, queryFn: profileApi.promocodes });

export const useActivatePromocode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: profileApi.activatePromocode,
    onSuccess: () => qc.invalidateQueries({ queryKey: qk.promocodes }),
  });
};

export const useReferral = () => useQuery({ queryKey: qk.referral, queryFn: profileApi.referral });

export const useSearchHistory = () => useQuery({ queryKey: qk.searchHistory, queryFn: profileApi.searchHistory });

export const useDeleteAccount = () => useMutation({ mutationFn: profileApi.deleteAccount });
