"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "@/app/i18n/routing";
import { authApi, type AuthSession } from "@/hooks/api/useAuthApi";
import { qk } from "@/hooks/api/keys";
import { profileApi } from "@/hooks/api/useProfile";
import { setUnauthorizedHandler } from "@/lib/api";
import { clearTokens, getAccessToken, setTokens } from "@/lib/auth";
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
      queryClient.setQueryData(qk.me, session.user);
    },
    [queryClient]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // A dead/expired session still has to log out locally.
    }
    clearTokens();
    setHasToken(false);
    queryClient.clear();
    router.replace("/login");
  }, [queryClient, router]);

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
