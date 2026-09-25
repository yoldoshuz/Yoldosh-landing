"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale } from "next-intl";

import { useRouter } from "@/app/i18n/routing";
import { qk } from "@/hooks/api/keys";
import { authApi, type AuthSession } from "@/hooks/api/useAuthApi";
import { profileApi } from "@/hooks/api/useProfile";
import { useGuestSession } from "@/hooks/useGuestSession";
import { setUnauthorizedHandler } from "@/lib/api";
import { clearTokens, getAccessToken, setTokens } from "@/lib/auth";
import { clearTelegramSignedOut, markTelegramSignedOut } from "@/lib/telegram";
import type { AppUser } from "@/types/api";

interface AuthContextValue {
  user: AppUser | null;
  /** True once a token exists locally — optimistic, before /user/me resolves. */
  isAuthenticated: boolean;
  /** True while the session is being restored from storage or revalidated. */
  isLoading: boolean;
  isDriver: boolean;
  login: (session: AuthSession) => void;
  logout: () => Promise<void>;
  refetchUser: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const locale = useLocale();
  const queryClient = useQueryClient();

  // Tokens live in localStorage, which is unavailable during SSR — `hydrated`
  // keeps the first client render identical to the server's so React doesn't
  // blow up on a mismatch, then flips once we can read storage.
  const [hydrated, setHydrated] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(Boolean(getAccessToken()));
    setHydrated(true);
  }, []);

  // Signed-out visitors are registered as guests so they show up in the
  // product's traffic stats; signed-in ones already have a real account.
  useGuestSession(hydrated && !hasToken);

  const {
    data: user,
    isLoading: isUserLoading,
    refetch,
  } = useQuery({
    queryKey: qk.me,
    queryFn: profileApi.me,
    enabled: hydrated && hasToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const login = useCallback(
    (session: AuthSession) => {
      setTokens(session);
      setHasToken(true);
      // A fresh session cancels a deliberate sign-out inside the mini app.
      clearTelegramSignedOut();
      queryClient.setQueryData(qk.me, session.user);
    },
    [queryClient]
  );

  /**
   * Signing out is a local act first.
   *
   * It used to `await` `/auth/logout` before touching anything, so a slow,
   * hanging or 401-ing call (the last of which drags the interceptor through a
   * refresh attempt) left the user sitting on their profile still signed in.
   * The session is now torn down synchronously and the server is told
   * afterwards — revoking the refresh token is worth doing, but it is not what
   * the button promises.
   */
  const logout = useCallback(async () => {
    clearTokens();
    setHasToken(false);
    queryClient.clear();
    // Lets the mini app fall back to the phone screen instead of silently
    // restoring the session it just discarded.
    markTelegramSignedOut();

    void authApi.logout().catch(() => {
      /* already gone locally; a dead session cannot be revoked anyway */
    });

    // A hard replace rather than the client router: it guarantees every
    // provider (auth, Telegram, react-query) restarts from a signed-out state,
    // with no stale subscription able to put a token back.
    if (typeof window !== "undefined") {
      window.location.replace(`/${locale}/login`);
      return;
    }
    router.replace("/login");
  }, [queryClient, router, locale]);

  // A 401 that survives the refresh attempt means the session is gone for good.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearTokens();
      setHasToken(false);
      queryClient.clear();
      router.replace("/login");
    });
    return () => setUnauthorizedHandler(null);
  }, [queryClient, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? null,
      isAuthenticated: hasToken,
      isLoading: !hydrated || (hasToken && isUserLoading),
      isDriver: user?.role === "Driver" || Boolean(user?.cars?.length),
      login,
      logout,
      refetchUser: () => void refetch(),
    }),
    [user, hasToken, hydrated, isUserLoading, login, logout, refetch]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
