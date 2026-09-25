"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { AppTopBar } from "@/components/app/AppTopBar";
import { ErrorNote, Screen } from "@/components/app/kit";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useUpdateProfile } from "@/hooks/api/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/api";
import type { NotificationPreferences } from "@/types/api";

/**
 * Four switches, in the mobile build order. A fifth, general, exists on the
 * API but is not offered here: it is a catch-all the app never explains, and a
 * toggle whose effect nobody can describe is worse than no toggle at all.
 */
const KEYS: (keyof NotificationPreferences)[] = ["trips", "newsAndAgreement", "promotionAndDiscounts", "messages"];

export const NotificationSettingsScreen = () => {
  const t = useTranslations("App");
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const [error, setError] = useState<string | null>(null);

  const prefs = user?.notificationPreferences;

  const toggle = async (key: keyof NotificationPreferences, value: boolean) => {
    setError(null);
    try {
      await updateProfile.mutateAsync({ notificationPreferences: { ...prefs, [key]: value } });
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.Generic")));
    }
  };

  return (
    <>
      <AppTopBar title={t("Settings.Notifications")} back="/profile" />
      <Screen className="space-y-3">
        <ErrorNote message={error} />
        <div className="app-card divide-y divide-neutral-100 px-5">
          {KEYS.map((key) => (
            <div key={key} className="flex items-center justify-between gap-4 py-4">
              <Label htmlFor={`notif-${key}`} className="cursor-pointer font-bold text-ink">
                {t(`Settings.NotificationTypes.${key}`)}
              </Label>
              <Switch
                id={`notif-${key}`}
                checked={prefs?.[key] ?? false}
                disabled={updateProfile.isPending}
                onCheckedChange={(v) => void toggle(key, v)}
                className="h-7 w-12 data-[state=checked]:bg-brand-500 [&>span]:size-6"
              />
            </div>
          ))}
        </div>
      </Screen>
    </>
  );
};
