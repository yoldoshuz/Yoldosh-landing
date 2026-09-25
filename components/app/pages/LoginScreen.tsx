"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter as useRawRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Upload } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { ErrorNote } from "@/components/app/kit";
import { LegalSheet, type LegalDocument } from "@/components/app/sheets/LegalSheet";
import { useTelegram } from "@/components/app/TelegramProvider";
import { TelegramSignIn } from "@/components/app/TelegramSignIn";
import { UserAvatar } from "@/components/app/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi, useCompleteProfile, useRequestOtp, useVerifyOtp } from "@/hooks/api/useAuthApi";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/api";
import { getGuestId } from "@/lib/auth";

type Step = "phone" | "otp" | "profile";

/** `+998 (90) 123-45-67` for the field, `+998901234567` for the wire. */
const formatPhone = (digits: string) => {
  const d = digits.slice(0, 9);
  if (!d) return "";
  const parts = [d.slice(0, 2), d.slice(2, 5), d.slice(5, 7), d.slice(7, 9)].filter(Boolean);
  let out = `(${parts[0]}`;
  if (parts.length > 1) out += `) ${parts[1]}`;
  if (parts.length > 2) out += `-${parts[2]}`;
  if (parts.length > 3) out += `-${parts[3]}`;
  return out;
};

const OTP_LENGTH = 4;
const RESEND_SECONDS = 60;

export const LoginScreen = () => {
  const t = useTranslations("App.Auth");
  // Shared verbs ("Back", "Save", …) live at the root of `App` so every screen
  // reuses one translation rather than each namespace redefining the word.
  const tCommon = useTranslations("App");
  const locale = useLocale();
  const router = useRawRouter();
  const searchParams = useSearchParams();
  const { login, isAuthenticated } = useAuth();
  const { isTelegram, status: telegramStatus, linkToken, errorCode: telegramError, onLinked } = useTelegram();

  /*
    Inside Telegram the sign-in is automatic, so this screen only shows the
    phone step when the backend asked for one. `manualPhone` is the user
    choosing to type the number instead of sharing their contact.
  */
  const [manualPhone, setManualPhone] = useState(false);
  // "signed_out" means they chose to leave; putting the Telegram button back in
  // front of them would just sign them in again.
  const showTelegramStep =
    isTelegram && !manualPhone && telegramStatus !== "authorized" && telegramStatus !== "signed_out";

  /**
   * `next` is attacker-controllable (it rides in the URL), so only same-site
   * absolute paths are honoured — `//evil.com` and `https://evil.com` would
   * otherwise turn the login screen into an open redirect.
   */
  const requestedNext = searchParams.get("next");
  const next = requestedNext && /^\/(?!\/)/.test(requestedNext) ? requestedNext : "/search";

  /**
   * `next` carries a concrete, locale-less path (`/ride/<id>?seats=2`). The
   * localized router resolves hrefs through the `pathnames` map, which has no
   * entry for a filled-in dynamic route, so prefix the locale ourselves and
   * navigate with the plain router.
   */
  const goNext = useCallback(() => router.replace(`/${locale}${next}`), [router, locale, next]);

  const [step, setStep] = useState<Step>("phone");
  const [digits, setDigits] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [legal, setLegal] = useState<LegalDocument | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();
  const completeProfile = useCompleteProfile();

  /** Leaves the Telegram branch for the phone form, saying why if there is a why. */
  const enterPhoneManually = useCallback((notice?: string) => {
    setManualPhone(true);
    setStep("phone");
    setError(notice ?? null);
  }, []);

  /*
    A Telegram account whose number is not Uzbek cannot be linked at all, so
    the exchange fails before any button is pressed. Without this the screen
    just sat there — which is exactly what was reported.
  */
  useEffect(() => {
    if (telegramError === "AUTH_TELEGRAM_PHONE_UNSUPPORTED") enterPhoneManually(t("Telegram.ForeignNumber"));
  }, [telegramError, enterPhoneManually, t]);

  const phoneNumber = `+998${digits}`;
  const phoneValid = digits.length === 9;

  useEffect(() => {
    if (isAuthenticated) goNext();
  }, [isAuthenticated, goNext]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  // Object URLs stay allocated until revoked.
  useEffect(() => {
    if (!avatar) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatar);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatar]);

  const sendOtp = async () => {
    setError(null);
    try {
      // Hands this device's guest identity over, so everything the visitor did
      // before signing up is attributed to the account they end up with.
      await requestOtp.mutateAsync({ phoneNumber, guestId: getGuestId() ?? undefined });
      setStep("otp");
      setOtp("");
      setCooldown(RESEND_SECONDS);
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.OtpRequest")));
    }
  };

  const submitOtp = async (code: string) => {
    setError(null);
    try {
      // Inside Telegram the code proves the number so it can be attached to
      // this Telegram account — `/auth/verify-otp` would sign in without ever
      // making that link, which is exactly how a second account appears.
      if (isTelegram && linkToken) {
        const session = await authApi.telegramLinkPhone({ linkToken, phoneNumber, otp: code });
        login({ accessToken: session.accessToken, refreshToken: session.refreshToken, user: session.user });
        onLinked();
        goNext();
        return;
      }

      const result = await verifyOtp.mutateAsync({ phoneNumber, otp: code });

      // Step 2 either hands back a full session (returning user) or just a
      // userId, meaning the account still has to finish registration.
      if (result?.accessToken && result.user) {
        login({ accessToken: result.accessToken, refreshToken: result.refreshToken, user: result.user });
        goNext();
        return;
      }

      if (result?.userId) {
        setUserId(result.userId);
        setStep("profile");
        return;
      }

      setError(t("Errors.OtpVerify"));
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.OtpVerify")));
      setOtp("");
    }
  };

  const submitProfile = async () => {
    if (!userId || !firstName.trim()) return;
    setError(null);
    try {
      const session = await completeProfile.mutateAsync({
        userId,
        firstName: firstName.trim(),
        avatar,
        referralCode: referralCode.trim() || undefined,
      });
      login(session);
      goNext();
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.Profile")));
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-10">
      {/* Signing in is a detour, not a dead end — always offer the way back.
          Except in Telegram, where the site itself is out of reach. */}
      {!isTelegram && (
        <Link
          href="/"
          className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-ink"
        >
          <ArrowLeft className="size-4" />
          {tCommon("Back")}
        </Link>
      )}

      <Link href="/" className="flex items-center gap-2 mb-8">
        <Image src="/assets/logo.svg" alt="Yoldosh" width={44} height={44} priority />
        <span className="text-2xl font-bold text-neutral-800">Yo&apos;ldosh</span>
      </Link>

      <div className="w-full max-w-sm app-card p-6">
        {showTelegramStep && <TelegramSignIn onEnterPhone={enterPhoneManually} />}

        {!showTelegramStep && step !== "phone" && (
          <button
            type="button"
            onClick={() => {
              setError(null);
              setStep(step === "profile" ? "otp" : "phone");
            }}
            className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800 smooth mb-4 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            {tCommon("Back")}
          </button>
        )}

        {!showTelegramStep && step === "phone" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (phoneValid) void sendOtp();
            }}
            className="space-y-4"
          >
            <div>
              <h1 className="text-xl font-bold">{t("PhoneTitle")}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t("PhoneSubtitle")}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{t("PhoneLabel")}</Label>
              <div className="flex items-center gap-2 rounded-xl border px-3 h-11 focus-within:border-brand-500 smooth">
                <span className="font-medium text-neutral-600">+998</span>
                <input
                  id="phone"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="(90) 123-45-67"
                  value={formatPhone(digits)}
                  onChange={(e) => setDigits(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  className="flex-1 outline-none bg-transparent"
                />
              </div>
            </div>

            <ErrorNote message={error} />

            <Button
              type="submit"
              disabled={!phoneValid || requestOtp.isPending}
              className="h-13 w-full rounded-full bg-brand-500 text-base font-semibold hover:bg-brand-600 disabled:bg-neutral-300 disabled:opacity-100"
            >
              {requestOtp.isPending ? <Loader2 className="size-4 animate-spin" /> : t("Continue")}
              {!requestOtp.isPending && <ArrowRight className="size-4" />}
            </Button>

            {/*
              Opened in place rather than linked. Inside Telegram the marketing
              site is unreachable, so following these links left the user on a
              blank redirect with no way back into the form they were filling.
            */}
            <p className="text-xs text-center text-muted-foreground">
              {t.rich("Terms", {
                offer: (chunks) => (
                  <button type="button" onClick={() => setLegal("offer")} className="link cursor-pointer">
                    {chunks}
                  </button>
                ),
                privacy: (chunks) => (
                  <button type="button" onClick={() => setLegal("privacy")} className="link cursor-pointer">
                    {chunks}
                  </button>
                ),
              })}
            </p>
          </form>
        )}

        {!showTelegramStep && step === "otp" && (
          <div className="space-y-4">
            <div>
              <h1 className="text-xl font-bold">{t("OtpTitle")}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t("OtpSubtitle", { phone: phoneNumber })}</p>
            </div>

            <Input
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={OTP_LENGTH}
              value={otp}
              placeholder="0000"
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, OTP_LENGTH);
                setOtp(value);
                // Auto-submit the moment the code is complete — one less tap.
                if (value.length === OTP_LENGTH) void submitOtp(value);
              }}
              className="h-14 text-center text-2xl tracking-[0.6em] font-mono"
            />

            <ErrorNote message={error} />

            {verifyOtp.isPending && (
              <div className="flex justify-center">
                <Loader2 className="size-5 animate-spin text-brand-500" />
              </div>
            )}

            <Button
              type="button"
              variant="ghost"
              disabled={cooldown > 0 || requestOtp.isPending}
              onClick={() => void sendOtp()}
              className="w-full"
            >
              {cooldown > 0 ? t("ResendIn", { seconds: cooldown }) : t("Resend")}
            </Button>
          </div>
        )}

        {!showTelegramStep && step === "profile" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submitProfile();
            }}
            className="space-y-4"
          >
            <div>
              <h1 className="text-xl font-bold">{t("ProfileTitle")}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t("ProfileSubtitle")}</p>
            </div>

            <div className="flex items-center gap-4">
              <UserAvatar src={avatarPreview} name={firstName} className="size-16" />
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => setAvatar(e.target.files?.[0] ?? null)}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
                  <Upload className="size-4" />
                  {t("UploadAvatar")}
                </Button>
                <p className="text-[11px] text-muted-foreground mt-1">{t("AvatarHint")}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">{t("FirstName")}</Label>
              <Input
                id="firstName"
                maxLength={32}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referral">{t("ReferralCode")}</Label>
              <Input
                id="referral"
                maxLength={20}
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder={t("Optional")}
              />
            </div>

            <ErrorNote message={error} />

            <Button
              type="submit"
              disabled={!firstName.trim() || completeProfile.isPending}
              className="h-13 w-full rounded-full bg-brand-500 text-base font-semibold hover:bg-brand-600 disabled:bg-neutral-300 disabled:opacity-100"
            >
              {completeProfile.isPending ? <Loader2 className="size-4 animate-spin" /> : t("Finish")}
            </Button>
          </form>
        )}
      </div>

      <LegalSheet document={legal} onClose={() => setLegal(null)} />
    </div>
  );
};
