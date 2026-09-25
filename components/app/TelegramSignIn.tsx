"use client";

import { useState } from "react";
import { Loader2, RefreshCw, Send } from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorNote } from "@/components/app/kit";
import { useTelegram } from "@/components/app/TelegramProvider";
import { Button } from "@/components/ui/button";
import { authApi } from "@/hooks/api/useAuthApi";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorCode, apiErrorMessage } from "@/lib/api";
import { requestTelegramContact } from "@/lib/telegram";

/** Failures the user can act on; anything else gets the generic message. */
const RECOVERABLE = new Set(["AUTH_TELEGRAM_REPLAY", "AUTH_TELEGRAM_EXPIRED", "AUTH_TELEGRAM_LINK_TOKEN_INVALID"]);

interface TelegramSignInProps {
  /**
   * Drops to the ordinary phone + OTP screen, which finishes the linking.
   * `notice` is shown there — it is how the user learns *why* they were moved.
   */
  onEnterPhone: (notice?: string) => void;
}

/**
 * The Telegram half of the sign-in screen.
 *
 * Most people never see it: `/auth/telegram` signs them in on open. It appears
 * only when the backend has no phone for this Telegram account yet, or when the
 * exchange failed and the user needs to know what to do.
 */
export const TelegramSignIn = ({ onEnterPhone }: TelegramSignInProps) => {
  const t = useTranslations("App.Auth");
  const { status, linkToken, errorCode, onLinked } = useTelegram();
  const { login } = useAuth();

  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shareContact = async () => {
    if (!linkToken) return;
    setError(null);
    setSharing(true);

    try {
      const contactProof = await requestTelegramContact();

      // Declined, or a client too old to show the sheet — the manual path is
      // still open, so this is a nudge rather than a failure.
      if (!contactProof) {
        setError(t("Telegram.ContactDeclined"));
        return;
      }

      const session = await authApi.telegramLinkPhone({ linkToken, contactProof });
      login({ accessToken: session.accessToken, refreshToken: session.refreshToken, user: session.user });
      onLinked();
    } catch (e) {
      const code = apiErrorCode(e);

      /*
        The shared contact is not an Uzbek number. Nothing happened on screen
        before this: the request succeeded, the backend refused, and the sheet
        simply closed again. Say what the rule is and move the user on to the
        one route that can still work — typing a +998 number.
      */
      if (code === "AUTH_TELEGRAM_PHONE_UNSUPPORTED") {
        onEnterPhone(t("Telegram.ForeignNumber"));
        return;
      }
      setError(apiErrorMessage(e, t("Telegram.LinkFailed")));
    } finally {
      setSharing(false);
    }
  };

  if (status === "authenticating") {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <Loader2 className="size-7 animate-spin text-brand-500" />
        <p className="text-ink-muted">{t("Telegram.SigningIn")}</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="space-y-4 text-center">
        <RefreshCw className="mx-auto size-8 text-ink-muted" />
        <div>
          <h1 className="text-xl font-bold">{t("Telegram.FailedTitle")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {errorCode && RECOVERABLE.has(errorCode) ? t("Telegram.Reopen") : t("Telegram.FailedText")}
          </p>
        </div>
        <Button variant="outline" onClick={() => onEnterPhone()} className="h-12 w-full rounded-full">
          {t("Telegram.UsePhone")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold">{t("Telegram.PhoneTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("Telegram.PhoneSubtitle")}</p>
      </div>

      <ErrorNote message={error} />

      <Button
        onClick={() => void shareContact()}
        disabled={sharing || !linkToken}
        className="h-13 w-full rounded-full bg-brand-500 text-base font-semibold hover:bg-brand-600 disabled:bg-neutral-300 disabled:opacity-100"
      >
        {sharing ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <>
            <Send className="size-5" />
            {t("Telegram.ShareContact")}
          </>
        )}
      </Button>

      <button
        type="button"
        onClick={() => onEnterPhone()}
        className="w-full cursor-pointer text-sm font-medium text-ink-muted transition hover:text-ink"
      >
        {t("Telegram.EnterManually")}
      </button>
    </div>
  );
};
