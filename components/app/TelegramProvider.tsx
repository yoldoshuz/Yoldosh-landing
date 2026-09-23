"use client";

import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import Script from "next/script";

import { usePathname, useRouter } from "@/app/i18n/routing";
import { authApi } from "@/hooks/api/useAuthApi";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorCode } from "@/lib/api";
import { getGuestId } from "@/lib/auth";
import { getWebApp, initTelegramWebApp, isTelegramWebApp } from "@/lib/telegram";

/** Where the mini app's automatic sign-in got to. */
export type TelegramAuthStatus = "idle" | "authenticating" | "phone_required" | "authorized" | "failed";

interface TelegramContextValue {
  isTelegram: boolean;
  status: TelegramAuthStatus;
  /** Present once the backend asked for a phone; valid for ten minutes. */
  linkToken: string | null;
  /** `error_code` from the API, so the screen can explain what to do next. */
  errorCode: string | null;
  onLinked: () => void;
}

const TelegramContext = createContext<TelegramContextValue>({
  isTelegram: false,
  status: "idle",
  linkToken: null,
  errorCode: null,
  onLinked: () => {},
});

export const useTelegram = () => useContext(TelegramContext);

/** Marketing routes a mini-app user should never land on. */
const MARKETING_PREFIXES = ["/", "/about-us", "/blog", "/for-drivers", "/for-passengers", "/routes", "/trips"];

const isMarketingRoute = (pathname: string) =>
  MARKETING_PREFIXES.some((prefix) => (prefix === "/" ? pathname === "/" : pathname.startsWith(prefix)));

/**
 * `initData` is single-use: the backend rejects a second exchange of the same
 * string with `AUTH_TELEGRAM_REPLAY`. React would happily fire the effect twice
 * (Strict Mode, a remount on navigation), and either would burn the credential,
 * so the guard lives at module scope rather than in a ref — it has to outlive
 * the component, not just its renders.
 */
let telegramExchangeStarted = false;

/**
 * Turns the site into a Telegram Mini App when it is opened from one.
 *
 * Inside Telegram there is no landing page to sell — the user already tapped a
 * button in the bot — so they are signed in automatically and marketing routes
 * redirect into the app.
 */
export const TelegramProvider = ({ children }: { children: ReactNode }) => {
  const [isTelegram, setIsTelegram] = useState(false);
  const [status, setStatus] = useState<TelegramAuthStatus>("idle");
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const { isAuthenticated, isLoading, login } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const detect = useCallback(() => {
    if (!isTelegramWebApp()) return;
    setIsTelegram(true);
    initTelegramWebApp();
  }, []);

  // The SDK is injected by `<Script>`, so detection runs both on mount (for a
  // client that pre-injects it) and from its onLoad.
  useEffect(detect, [detect]);

  /* ------------------------------------------------- automatic sign-in */

  useEffect(() => {
    if (!isTelegram || isLoading) return;

    // A live session already covers us — and re-exchanging would only spend the
    // one-shot credential for nothing.
    if (isAuthenticated) {
      setStatus("authorized");
      return;
    }

    if (telegramExchangeStarted) return;

    const initData = getWebApp()?.initData;
    if (!initData) return;

    telegramExchangeStarted = true;
    setStatus("authenticating");

    void authApi
      .telegramLogin({ initData, guestId: getGuestId() ?? undefined })
      .then((result) => {
        if (result.status === "authorized") {
          login({ accessToken: result.accessToken, refreshToken: result.refreshToken, user: result.user });
          setStatus("authorized");
          return;
        }
        setLinkToken(result.linkToken);
        setStatus("phone_required");
      })
      .catch((error) => {
        // Never retried automatically: the same `initData` would be refused.
        setErrorCode(apiErrorCode(error) ?? null);
        setStatus("failed");
      });
  }, [isTelegram, isLoading, isAuthenticated, login]);

  /** Called by the sign-in screen once the phone step produced a session. */
  const onLinked = useCallback(() => {
    setLinkToken(null);
    setStatus("authorized");
  }, []);

  /* ----------------------------------------------------- routing rules */

  useEffect(() => {
    if (!isTelegram || isLoading) return;
    if (!isMarketingRoute(pathname)) return;
    router.replace(isAuthenticated ? "/search" : "/login");
  }, [isTelegram, isLoading, isAuthenticated, pathname, router]);

  // Telegram's own scroll-to-dismiss is disabled in `initTelegramWebApp`; this
  // stops the page itself from rubber-banding, which is what makes the gesture
  // reachable in the first place.
  useEffect(() => {
    if (!isTelegram) return;
    const { documentElement, body } = document;
    const previous = documentElement.style.overscrollBehaviorY;
    documentElement.style.overscrollBehaviorY = "none";
    body.style.overscrollBehaviorY = "none";
    return () => {
      documentElement.style.overscrollBehaviorY = previous;
      body.style.overscrollBehaviorY = "";
    };
  }, [isTelegram]);

  return (
    <TelegramContext.Provider value={{ isTelegram, status, linkToken, errorCode, onLinked }}>
      <Script src="https://telegram.org/js/telegram-web-app.js?58" strategy="afterInteractive" onLoad={detect} />
      {/* Holding the frame while a mini-app user is redirected off marketing. */}
      {isTelegram && isMarketingRoute(pathname) ? null : children}
    </TelegramContext.Provider>
  );
};
