import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api";
import type { AppUser } from "@/types/api";

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  /** Milliseconds, not seconds — the backend sends ~100 days. */
  expiresIn?: number;
  user: AppUser;
}

/**
 * `/auth/telegram` either signs the user in outright or asks for a phone
 * number first — an account is never created without one, which is what keeps
 * the mini app, the website and the native app on a single account.
 */
export type TelegramAuthResult =
  | ({ status: "authorized" } & AuthSession)
  | { status: "phone_required"; linkToken: string };

export const authApi = {
  /**
   * Registers a browsing device. `fcmToken` is required by the endpoint but
   * only meaningful for the native apps' push delivery — the web sends a
   * recognisable placeholder rather than a fake token.
   */
  createGuest: async (guestId: string) => {
    const { data } = await api.post("/auth/guest", { guestId, fcmToken: `web:${guestId}` });
    return (data?.data ?? data) as { guestId: string; firstName?: string };
  },

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

  /**
   * Signs in from inside Telegram. `initData` is single-use server-side, so
   * this must not be retried with the same string — see `useTelegramAuth`.
   */
  telegramLogin: async ({ initData, guestId }: { initData: string; guestId?: string }) => {
    const { data } = await api.post("/auth/telegram", { initData, ...(guestId ? { guestId } : {}) });
    return data.data as TelegramAuthResult;
  },

  /**
   * Attaches a phone to the Telegram identity. Either a signed contact from
   * `requestContact` (one tap) or a phone plus OTP — the server refuses a bare
   * number, so one of the two proofs is mandatory.
   */
  telegramLinkPhone: async (
    payload:
      | { linkToken: string; contactProof: string }
      | { linkToken: string; phoneNumber: string; otp: string }
  ) => {
    const { data } = await api.post("/auth/telegram/link-phone", payload);
    return data.data as { status: "authorized" } & AuthSession;
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
