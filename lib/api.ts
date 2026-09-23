import axios, { AxiosError, AxiosRequestConfig } from "axios";

import { clearTokens, getAccessToken, getRefreshToken, setTokens } from "./auth";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  // The backend issues the refresh token as an httpOnly cookie; sending
  // credentials lets `/auth/refresh-token` work without us holding the value.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * A single in-flight refresh shared by every 401 that lands while it runs —
 * otherwise a dashboard that fires six queries at once would fire six refreshes
 * and invalidate its own token five times over.
 */
let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { data } = await axios.post(
      `${API_URL}/auth/refresh-token`,
      { refreshToken: getRefreshToken() },
      { withCredentials: true }
    );
    const accessToken = data?.data?.accessToken;
    if (!accessToken) return null;
    setTokens({
      accessToken,
      refreshToken: data?.data?.refreshToken,
      expiresIn: data?.data?.expiresIn,
    });
    return accessToken;
  } catch {
    return null;
  }
};

/** Set by the auth provider so a dead session can bounce the user to /login. */
let onUnauthorized: (() => void) | null = null;
export const setUnauthorizedHandler = (handler: (() => void) | null) => {
  onUnauthorized = handler;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as (AxiosRequestConfig & { _retried?: boolean }) | undefined;

    const isAuthRoute = original?.url?.includes("/auth/");
    if (error.response?.status !== 401 || !original || original._retried || isAuthRoute) {
      return Promise.reject(error);
    }

    original._retried = true;

    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }

    const accessToken = await refreshPromise;

    if (!accessToken) {
      clearTokens();
      onUnauthorized?.();
      return Promise.reject(error);
    }

    original.headers = { ...original.headers, Authorization: `Bearer ${accessToken}` };
    return api(original);
  }
);

/** Unwraps the `{ success, status_code, message, data }` envelope the API uses. */
export const unwrap = <T = any,>(response: { data: { data?: T } }): T => response.data.data as T;

/**
 * Coerces a list payload to an array.
 *
 * Collection endpoints are not consistent about the envelope: some return the
 * array as `data`, others nest it under a named key (`data.ratings`,
 * `data.items`, …), and a few hand back an object when the list is empty.
 * Rendering code should never have to care, and it must never be handed
 * something without `.map`.
 */
export const toList = <T,>(payload: unknown): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const nested = Object.values(payload as Record<string, unknown>).find(Array.isArray);
    if (nested) return nested as T[];
  }
  return [];
};

/** Machine-readable failure reason, when the API supplies one. */
export const apiErrorCode = (error: unknown): string | undefined => {
  if (!axios.isAxiosError(error)) return undefined;
  return (error.response?.data as { error_code?: string } | undefined)?.error_code;
};

/** Best-effort human-readable message out of an axios error. */
export const apiErrorMessage = (error: unknown, fallback = "Something went wrong"): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string; errors?: string[] } | undefined;
    if (data?.errors?.length) return data.errors.join(", ");
    if (data?.message) return data.message;
  }
  return fallback;
};

/**
 * Resolves an API-relative upload path (avatars, media) to an absolute URL.
 * Anything that already carries a scheme is passed straight through — that
 * covers remote URLs as well as the `blob:` previews produced locally while
 * a user is picking a new photo.
 */
export const resolveMedia = (path?: string | null): string | undefined => {
  if (!path) return undefined;
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  return `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
