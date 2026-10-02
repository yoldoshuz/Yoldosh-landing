import { getWebApp, isTelegramWebApp } from "@/lib/telegram";

export type ShareOutcome = "shared" | "copied" | "failed";

/**
 * Hands a link to whatever share UI the surface has.
 *
 * Inside Telegram that is the client's own "send to chat" picker — the Web
 * Share API is missing from most of its web views, and where it exists it
 * opens the OS sheet on top of the very app the user is sharing from. A
 * browser gets the native sheet where there is one, and the clipboard
 * otherwise, so the action never silently does nothing.
 */
export const shareLink = async (url: string, text: string): Promise<ShareOutcome> => {
  const webApp = getWebApp();
  if (isTelegramWebApp() && webApp?.openTelegramLink) {
    webApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`);
    return "shared";
  }

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ url, text });
      return "shared";
    } catch (error) {
      // Dismissing the sheet is a choice, not a failure worth a fallback.
      if (error instanceof DOMException && error.name === "AbortError") return "shared";
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch {
    return "failed";
  }
};
