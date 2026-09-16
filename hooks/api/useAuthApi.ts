import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { AppUser } from "@/types/api";

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
  user: AppUser;
}

export const authApi = {
  requestOtp: async (phoneNumber: string, guestId?: string) => {
    const { data } = await api.post("/auth/request-otp", { phoneNumber, ...(guestId ? { guestId } : {}) });
    return data;
  },

  /**
   * Returns either a full session (existing user) or `{ userId }` when the
   * account still has to go through step 3 (complete-profile).
   */
  verifyOtp: async (phoneNumber: string, otp: string) => {
    const { data } = await api.post("/auth/verify-otp", { phoneNumber, otp });
    return data.data as Partial<AuthSession> & { userId?: string };
  },

  completeProfile: async (payload: { userId: string; firstName: string; avatar?: File | null; referralCode?: string }) => {
    const form = new FormData();
    form.append("userId", payload.userId);
    form.append("firstName", payload.firstName);
    if (payload.avatar) form.append("avatar", payload.avatar);
    if (payload.referralCode) form.append("referralCode", payload.referralCode);

    const { data } = await api.post("/auth/complete-profile", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.data as AuthSession;
  },

  logout: async () => {
    const { data } = await api.post("/auth/logout");
    return data;
  },
};

export const useRequestOtp = () =>
  useMutation({
    mutationFn: ({ phoneNumber, guestId }: { phoneNumber: string; guestId?: string }) =>
      authApi.requestOtp(phoneNumber, guestId),
  });

export const useVerifyOtp = () =>
  useMutation({
    mutationFn: ({ phoneNumber, otp }: { phoneNumber: string; otp: string }) => authApi.verifyOtp(phoneNumber, otp),
  });

export const useCompleteProfile = () =>
  useMutation({
    mutationFn: authApi.completeProfile,
  });
