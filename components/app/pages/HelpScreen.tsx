"use client";

import { useTranslations } from "next-intl";

import { AppTopBar } from "@/components/app/AppTopBar";
import { Row, Screen } from "@/components/app/kit";

const SUPPORT_TELEGRAM = "https://t.me/yoldosh_support";

export const HelpScreen = () => {
  const t = useTranslations("App");

  return (
    <>
      <AppTopBar title={t("Settings.Help")} back="/profile" />
      <Screen className="space-y-3">
        <p className="py-2 text-center text-ink-muted">{t("Help.Intro")}</p>

        <a href={SUPPORT_TELEGRAM} target="_blank" rel="noopener noreferrer" className="app-row cursor-pointer">
          <span className="flex-1 font-bold text-ink">{t("Help.ContactSupport")}</span>
          <span aria-hidden className="text-ink-muted">
            ›
          </span>
        </a>

        <Row label={<span className="font-bold">{t("Help.Guide")}</span>} href="/for-passengers" />
      </Screen>
    </>
  );
};
