/**
 * Telegram Mini App integration.
 *
 * The same build serves the public website and the Telegram web app, so
 * everything here is feature-detected: outside Telegram `getWebApp()` returns
 * undefined and every helper is a no-op.
 */

export interface TelegramInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  isExpanded: boolean;
  platform: string;
  colorScheme: "light" | "dark";
  viewportHeight: number;
  viewportStableHeight: number;
  initData: string;
  initDataUnsafe?: {
    user?: { id: number; first_name?: string; last_name?: string; username?: string; photo_url?: string };
  };
  /** Added in Bot API 7.7; absent on older clients. */
  disableVerticalSwipes?: () => void;
  /** Bot API 6.1+. The SDK logs an error for any method newer than the client. */
  isVersionAtLeast?: (version: string) => boolean;
  /**
   * Bot API 8.0. Fullscreen draws the app edge to edge, under the status bar
   * and Telegram's header; the other launch modes put it below that header.
   */
  isFullscreen?: boolean;
  requestFullscreen?: () => void;
  /**
   * Bot API 8.0. `safeAreaInset` is the device's own unsafe area (status bar,
   * notch, gesture bar); `contentSafeAreaInset` additionally clears Telegram's
   * chrome — the header with "Закрыть" and the ⋮ menu. Both are absent on
   * older clients, where the app simply is not drawn under either.
   */
  safeAreaInset?: TelegramInsets;
  contentSafeAreaInset?: TelegramInsets;
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
  /** Opens a t.me link inside the client — the share sheet among them. */
  openTelegramLink?: (url: string) => void;
  onEvent?: (event: string, handler: () => void) => void;
  offEvent?: (event: string, handler: () => void) => void;
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

/*
  Telegram picks the header's title colour itself, from the YIQ brightness of
  the colour we hand it: above 128 it draws black text. Our #26BC4B lands at
  130 — just over the line, which is why the title came out black on green.
  brand-600 sits at 112 and flips it to white.
*/
const HEADER_GREEN = "#1fa341";
const APP_BG = "#fafafa";

/** Phones, where fullscreen is the posture the app is laid out for. */
const MOBILE_PLATFORMS = new Set(["ios", "android", "android_x"]);

let telegramInitialised = false;

/**
 * Puts the mini app into its native posture: fullscreen on a phone, no
 * accidental dismissal, and chrome coloured like the app rather than the
 * default.
 *
 * Vertical swipes are what close a Telegram mini app, and they fire on any
 * downward drag — including one that was meant to scroll a list. Disabling them
 * is the difference between "a website in a sheet" and something that feels
 * built for the client.
 *
 * Runs once: detection fires both on mount and from the SDK's onLoad, and a
 * second `requestFullscreen` on a client already in fullscreen only earns a
 * `fullscreenFailed` event.
 */
export const initTelegramWebApp = () => {
  const webApp = getWebApp();
  if (!webApp || telegramInitialised) return;
  telegramInitialised = true;

  webApp.ready();
  if (!webApp.isExpanded) webApp.expand();

  // Older clients simply lack these; calling them is best-effort.
  webApp.disableVerticalSwipes?.();
  webApp.setHeaderColor?.(HEADER_GREEN);
  webApp.setBackgroundColor?.(APP_BG);

  /*
    The launch mode depends on where the app was opened from, not on us. The
    chat-list button opens it fullscreen; the menu button and inline buttons
    inside a dialog open it "fullsize" — below Telegram's own header, as a
    sheet. The screens are built for the first: a green bar running under the
    status bar, a floating tab bar over the gesture strip. Asking for
    fullscreen on every phone launch leaves one posture to design for instead
    of two. Desktop clients are left alone — fullscreen there takes over the
    whole monitor.
  */
  const supportsFullscreen = webApp.isVersionAtLeast?.("8.0") ?? false;
  if (supportsFullscreen && !webApp.isFullscreen && MOBILE_PLATFORMS.has(webApp.platform)) {
    try {
      webApp.requestFullscreen?.();
    } catch {
      /* the fullsize layout works too — see `html.tg-app` in globals.css */
    }
  }
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

/* ------------------------------------------------------------ sign-out */

const SIGNED_OUT_KEY = "yoldosh.telegram.signedOut";

/**
 * Remembers that the user signed out *on purpose* inside the mini app.
 *
 * Without it, logging out is a no-op there: the page reloads, `initData` is
 * still sitting in the launch parameters, and the app signs straight back in —
 * or, because that string is single-use, fails with a replay error. The flag
 * lives in `sessionStorage`, so it lasts exactly as long as this mini-app
 * session: closing and reopening from the bot signs the user in again, which
 * is the behaviour people expect from Telegram.
 */
export const markTelegramSignedOut = () => {
  try {
    window.sessionStorage.setItem(SIGNED_OUT_KEY, "1");
  } catch {
    /* storage unavailable — the sign-out is still local, just not remembered */
  }
};

export const clearTelegramSignedOut = () => {
  try {
    window.sessionStorage.removeItem(SIGNED_OUT_KEY);
  } catch {
    /* ignore */
  }
};

export const isTelegramSignedOut = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(SIGNED_OUT_KEY) === "1";
  } catch {
    return false;
  }
};

/* ------------------------------------------------------- safe areas */

/**
 * Publishes Telegram's safe areas as CSS variables.
 *
 * In the client's expanded layout the mini app is drawn *under* both the
 * device status bar and Telegram's own header — the row with "Закрыть" and the
 * ⋮ menu. Nothing in the page knows that, so the first heading ends up behind
 * the client's title and the tab bar ends up under the gesture bar.
 *
 * `contentSafeAreaInset` is the one to pad content against at the top: it is
 * measured from the app's own edge and already accounts for the header.
 * `safeAreaInset.bottom` is the gesture bar, which the tab bar has to clear.
 * Both are Bot API 8.0 — on older clients they are absent, the app is not
 * drawn under anything, and the variables stay at 0.
 */
export const syncSafeAreaInsets = (webApp: TelegramWebApp) => {
  const root = document.documentElement;

  const apply = () => {
    const safe = webApp.safeAreaInset;
    const content = webApp.contentSafeAreaInset;

    /*
      The two stack: the content inset is measured inside the safe one. The
      top only applies in fullscreen — in every other mode the web view starts
      below Telegram's header and is never under the status bar, yet a client
      may still report the device's top inset there, which would push every
      screen down by a status bar's worth of empty green.
    */
    const top = webApp.isFullscreen === false ? 0 : (safe?.top ?? 0) + (content?.top ?? 0);
    const bottom = (safe?.bottom ?? 0) + (content?.bottom ?? 0);

    root.style.setProperty("--tg-safe-top", `${top}px`);
    root.style.setProperty("--tg-safe-bottom", `${bottom}px`);
  };

  apply();
  webApp.onEvent?.("safeAreaChanged", apply);
  webApp.onEvent?.("contentSafeAreaChanged", apply);
  // A rotation or a switch in and out of fullscreen changes both.
  webApp.onEvent?.("viewportChanged", apply);
  webApp.onEvent?.("fullscreenChanged", apply);

  return () => {
    webApp.offEvent?.("safeAreaChanged", apply);
    webApp.offEvent?.("contentSafeAreaChanged", apply);
    webApp.offEvent?.("viewportChanged", apply);
    webApp.offEvent?.("fullscreenChanged", apply);
    root.style.removeProperty("--tg-safe-top");
    root.style.removeProperty("--tg-safe-bottom");
  };
};
