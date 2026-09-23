/**
 * Telegram Mini App integration.
 *
 * The same build serves the public website and the Telegram web app, so
 * everything here is feature-detected: outside Telegram `getWebApp()` returns
 * undefined and every helper is a no-op.
 */

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  isExpanded: boolean;
  platform: string;
  colorScheme: "light" | "dark";
  viewportStableHeight: number;
  initData: string;
  initDataUnsafe?: {
    user?: { id: number; first_name?: string; last_name?: string; username?: string; photo_url?: string };
  };
  /** Added in Bot API 7.7; absent on older clients. */
  disableVerticalSwipes?: () => void;
  /**
   * Bot API 6.9+. The callback's second argument carries `response` — the
   * signed string the backend validates. `responseUnsafe` is the parsed copy
   * and must never be sent instead.
   */
  requestContact?: (callback: (shared: boolean, result?: { response?: string }) => void) => void;
  enableClosingConfirmation?: () => void;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  BackButton?: { show: () => void; hide: () => void; onClick: (cb: () => void) => void };
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TelegramWebApp };
  }
}

export const getWebApp = (): TelegramWebApp | undefined =>
  typeof window === "undefined" ? undefined : window.Telegram?.WebApp;

/**
 * True when the page is running inside Telegram.
 *
 * `initData` is empty when the SDK script is loaded on an ordinary web page, so
 * the object alone is not proof — the platform string is what distinguishes a
 * real client from the `unknown` stub.
 */
export const isTelegramWebApp = (): boolean => {
  const webApp = getWebApp();
  if (!webApp) return false;
  return Boolean(webApp.initData) || (webApp.platform !== "unknown" && Boolean(webApp.platform));
};

const BRAND_GREEN = "#26bc4b";
const APP_BG = "#fafafa";

/**
 * Puts the mini app into its native posture: full height, no accidental
 * dismissal, and chrome coloured like the app rather than the default.
 *
 * Vertical swipes are what close a Telegram mini app, and they fire on any
 * downward drag — including one that was meant to scroll a list. Disabling them
 * is the difference between "a website in a sheet" and something that feels
 * built for the client.
 */
export const initTelegramWebApp = () => {
  const webApp = getWebApp();
  if (!webApp) return;

  webApp.ready();
  if (!webApp.isExpanded) webApp.expand();

  // Older clients simply lack these; calling them is best-effort.
  webApp.disableVerticalSwipes?.();
  webApp.setHeaderColor?.(BRAND_GREEN);
  webApp.setBackgroundColor?.(APP_BG);
};

/**
 * Asks Telegram for the user's phone, resolving to the signed proof string.
 *
 * Resolves `null` when the user declines or the client is too old to offer the
 * prompt — both mean "fall back to entering the number by hand", not an error.
 */
export const requestTelegramContact = (): Promise<string | null> =>
  new Promise((resolve) => {
    const webApp = getWebApp();
    if (!webApp?.requestContact) {
      resolve(null);
      return;
    }

    let settled = false;
    const settle = (value: string | null) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    try {
      webApp.requestContact((shared, result) => settle(shared ? (result?.response ?? null) : null));
    } catch {
      settle(null);
    }

    // Some clients never invoke the callback if the sheet is dismissed oddly;
    // without this the sign-in screen would sit disabled forever.
    setTimeout(() => settle(null), 60_000);
  });
