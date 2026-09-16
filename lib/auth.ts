/**
 * Token storage for the authenticated app shell.
 *
 * Tokens live in `localStorage` (read by the axios interceptor), and a
 * lightweight, non-sensitive marker cookie is mirrored alongside them so that
 * server components / middleware can cheaply tell "logged in" from "guest"
 * without ever seeing the JWT itself. The refresh token is additionally set as
 * an httpOnly `refresh-token` cookie by the backend — `/auth/refresh-token`
 * works off that cookie, we only keep a copy as a fallback for browsers that
 * drop third-party cookies.
 */

export const ACCESS_TOKEN_KEY = "yoldosh.accessToken";
export const REFRESH_TOKEN_KEY = "yoldosh.refreshToken";
export const AUTH_FLAG_COOKIE = "yoldosh_auth";

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

const isBrowser = () => typeof window !== "undefined";

export const getAccessToken = (): string | null => {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
};

export const getRefreshToken = (): string | null => {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
};

const setAuthCookie = (value: boolean) => {
  if (!isBrowser()) return;
  // 30 days — matches the refresh token lifetime on the backend.
  document.cookie = value
    ? `${AUTH_FLAG_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
    : `${AUTH_FLAG_COOKIE}=; path=/; max-age=0; samesite=lax`;
};

export const setTokens = ({ accessToken, refreshToken }: AuthTokens) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch {
    /* private mode — the in-memory axios header still carries the session */
  }
  setAuthCookie(true);
};

export const clearTokens = () => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {
    /* ignore */
  }
  setAuthCookie(false);
};

export const isAuthenticated = () => Boolean(getAccessToken());
