"use client";

import { useState } from "react";
import { Check, Copy, Gift, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppTopBar } from "@/components/app/AppTopBar";
import { ErrorNote, formatDate, Screen, SectionLabel, SuccessNote } from "@/components/app/kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActivatePromocode, usePromocodes, useReferral } from "@/hooks/api/useProfile";
import { apiErrorMessage } from "@/lib/api";

export const PromocodesScreen = () => {
  const t = useTranslations("App");

  const { data: promocodes } = usePromocodes();
  const { data: referral } = useReferral();
  const activate = useActivatePromocode();

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);
  const [copied, setCopied] = useState(false);

  const submit = async () => {
    setError(null);
    setActivated(false);
    try {
      await activate.mutateAsync(code.trim());
      setCode("");
      setActivated(true);
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.Generic")));
    }
  };

  const copyReferral = async () => {
    if (!referral?.referralCode) return;
    await navigator.clipboard.writeText(referral.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <AppTopBar title={t("Settings.Promocodes")} back="/profile" />
      <Screen className="space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
          className="app-card space-y-3 p-4"
        >
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder={t("Profile.PromoPlaceholder")}
            className="h-13 rounded-2xl border-neutral-300 px-4 font-mono tracking-wider"
          />
          <Button
            type="submit"
            disabled={!code.trim() || activate.isPending}
            className="h-12 w-full rounded-full bg-brand-500 font-semibold hover:bg-brand-600 disabled:bg-neutral-300 disabled:opacity-100"
          >
            {activate.isPending ? <Loader2 className="size-5 animate-spin" /> : t("Profile.Activate")}
          </Button>
        </form>

        <ErrorNote message={error} />
        <SuccessNote message={activated ? t("Profile.PromoActivated") : null} />

        {promocodes && promocodes.length > 0 && (
          <div>
            <SectionLabel>{t("Profile.MyPromocodes")}</SectionLabel>
            <div className="app-card divide-y divide-neutral-100 px-4">
              {promocodes.map((promo) => (
                <div key={promo.id} className="flex items-center justify-between gap-3 py-3.5">
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-ink">{promo.code}</p>
                    {promo.expiresAt && (
                      <p className="text-xs text-ink-muted">{t("Profile.PromoExpires", { date: formatDate(promo.expiresAt) })}</p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-full bg-brand-50 px-3 py-1 font-bold text-brand-600">
                    −{promo.discount}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {referral?.referralCode && (
          <div>
            <SectionLabel>{t("Profile.Referral")}</SectionLabel>
            <div className="app-card p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2">
                  <Gift className="size-5 shrink-0 text-brand-500" />
                  <span className="truncate font-mono text-lg font-bold text-ink">{referral.referralCode}</span>
                </span>
                <Button variant="outline" size="sm" className="shrink-0 rounded-full" onClick={() => void copyReferral()}>
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                  {t(copied ? "Copied" : "Copy")}
                </Button>
              </div>
              <p className="mt-2 text-sm text-ink-muted">
                {t("Profile.ReferredCount", { count: referral.referredCount ?? 0 })}
              </p>
            </div>
          </div>
        )}
      </Screen>
    </>
  );
};
