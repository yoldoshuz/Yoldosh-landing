"use client";

import { useState } from "react";
import {
  Bell,
  ChevronRight,
  CircleUserRound,
  FileText,
  Globe,
  Heart,
  LogOut,
  MessageSquare,
  Music,
  PawPrint,
  Phone,
  Plus,
  ScrollText,
  ShieldCheck,
  Star,
  Ticket,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import { CompletionCard, Row, Screen, SectionLabel, Spinner } from "@/components/app/kit";
import { UserAvatar } from "@/components/app/UserAvatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFullProfile } from "@/hooks/api/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export const ProfileScreen = () => {
  const t = useTranslations("App");
  const { user, logout } = useAuth();
  const { data: profile, isLoading } = useFullProfile();
  const [tab, setTab] = useState("about");

  const current = profile ?? user;

  if (isLoading && !user) {
    return (
      <>
        <AppTopBar title={t("Profile.Title")} />
        <Spinner />
      </>
    );
  }

  /**
   * The mobile build scores the profile out of seven fields and nudges toward
   * the first unfinished one — same checklist here so the number matches.
   */
  const checklist = [
    { done: Boolean(current?.firstName), labelKey: "AddFirstName", href: "/profile/edit" },
    { done: Boolean(current?.lastName), labelKey: "AddLastName", href: "/profile/edit" },
    { done: Boolean(current?.avatar), labelKey: "AddPhoto", href: "/profile/edit" },
    { done: Boolean(current?.date_of__birthday), labelKey: "AddBirthday", href: "/profile/edit" },
    { done: Boolean(current?.gender), labelKey: "AddGender", href: "/profile/edit" },
    { done: Boolean(current?.bio), labelKey: "AddBio", href: "/profile/edit" },
    { done: Boolean(current?.verified), labelKey: "VerifyAccount", href: "/profile/edit" },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const nextStep = checklist.find((c) => !c.done);

  const preferences = [
    { key: "talkative", icon: MessageSquare, on: current?.talkative },
    { key: "pets_allowed", icon: PawPrint, on: current?.pets_allowed },
    { key: "music_allowed", icon: Music, on: current?.music_allowed },
  ] as const;

  return (
    <>
      <AppTopBar title={t("Profile.Title")} />
      <Screen>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-12 w-full rounded-full bg-neutral-100 p-1 lg:max-w-md">
            <TabsTrigger
              value="about"
              className="h-10 flex-1 rounded-full text-sm font-semibold data-[state=active]:bg-brand-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              {t("Profile.TabAbout")}
            </TabsTrigger>
            <TabsTrigger
              value="account"
              className="h-10 flex-1 rounded-full text-sm font-semibold data-[state=active]:bg-brand-500 data-[state=active]:text-white data-[state=active]:shadow-none"
            >
              {t("Profile.TabAccount")}
            </TabsTrigger>
          </TabsList>

          {/* ------------------------------------------------------- О себе */}
          <TabsContent
            value="about"
            className="mt-4 space-y-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-5 lg:space-y-0"
          >
            <div className="space-y-4">
              <div className="app-card-rail overflow-hidden">
                <Link
                  href="/profile/edit"
                  className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-neutral-50"
                >
                  <UserAvatar src={current?.avatar} name={current?.firstName} className="size-12" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-lg font-bold text-ink">
                      {current?.firstName} {current?.lastName ?? ""}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-muted">
                      <Phone className="size-3.5" />
                      {current?.phoneNumber}
                    </span>
                  </span>
                  <ChevronRight className="size-5 shrink-0 text-ink-muted" />
                </Link>
                <Link
                  href="/profile/edit"
                  className="flex items-center gap-3 border-t border-neutral-100 px-4 py-3.5 transition hover:bg-neutral-50"
                >
                  <span className="flex-1 font-medium text-ink">{t("Profile.EditProfile")}</span>
                  <ChevronRight className="size-5 text-ink-muted" />
                </Link>
              </div>

              <CompletionCard
                title={t("Profile.CompletionTitle")}
                description={t("Profile.CompletionText")}
                done={doneCount}
                total={checklist.length}
                progressLabel={t("Profile.CompletionProgress", { done: doneCount, total: checklist.length })}
                nextAction={
                  nextStep && (
                    <Link href={nextStep.href as any} className="font-semibold text-brand-600 hover:text-brand-700">
                      {t(`Profile.Checklist.${nextStep.labelKey}`)}
                    </Link>
                  )
                }
              />
            </div>

            <div className="space-y-4">
              <div>
                <SectionLabel className="lg:mt-0">{t("Profile.TabAbout")}</SectionLabel>
                <div className="app-card-rail space-y-3 p-4">
                  {current?.bio ? (
                    <p className="text-ink">{current.bio}</p>
                  ) : (
                    <Link href="/profile/edit" className="flex items-center gap-2.5 text-brand-600">
                      <Plus className="size-5 rounded-md border border-brand-300 p-0.5" />
                      {t("Profile.AddBioCta")}
                    </Link>
                  )}

                  {preferences.some((p) => p.on != null) ? (
                    <div className="space-y-2">
                      {preferences.map(({ key, icon: Icon, on }) => (
                        <p
                          key={key}
                          // Green when the user is open to it, red when they'd rather not —
                          // the colour carries the answer at a glance.
                          className={cn("flex items-center gap-2.5", on ? "text-brand-600" : "text-danger")}
                        >
                          <Icon className="size-5 shrink-0" />
                          {t(`Profile.PrefValue.${key}.${on ? "yes" : "no"}`)}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <Link href="/profile/edit" className="flex items-center gap-2.5 text-brand-600">
                      <Plus className="size-5 rounded-md border border-brand-300 p-0.5" />
                      {t("Profile.AddPrefsCta")}
                    </Link>
                  )}

                  <Link
                    href="/profile/edit"
                    className="flex items-center gap-3 border-t border-neutral-100 pt-3 font-medium text-ink"
                  >
                    <span className="flex-1">{t("Profile.ChangePrefs")}</span>
                    <ChevronRight className="size-5 text-ink-muted" />
                  </Link>
                </div>
              </div>

              <div>
                <SectionLabel>{t("Profile.BecomeDriver")}</SectionLabel>
                <Link
                  href="/profile/cars"
                  className="app-card-rail flex items-center gap-3 px-4 py-4 transition hover:bg-neutral-50"
                >
                  <span className="flex-1 font-medium text-brand-600">{t("Profile.AddCar")}</span>
                  <Plus className="size-6 rounded-lg border border-brand-300 p-0.5 text-brand-500" />
                </Link>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Row
                  icon={Star}
                  label={t("Profile.Reviews")}
                  href="/profile/reviews"
                  trailing={
                    <span className="flex items-center gap-1.5 font-mono text-sm font-semibold text-star">
                      <Star className="size-4 fill-star stroke-star" />
                      {(current?.rating ?? 0).toFixed(1)}
                    </span>
                  }
                />
                <Row icon={CircleUserRound} label={t("Profile.PublicProfile")} href={`/users/${current?.id ?? ""}`} />
              </div>
            </div>
          </TabsContent>

          {/* ------------------------------------------------------ Аккаунт */}
          <TabsContent
            value="account"
            className="mt-4 space-y-2 lg:grid lg:grid-cols-2 lg:gap-x-4 lg:gap-y-2 lg:space-y-0"
          >
            <Row icon={Bell} label={t("Settings.Notifications")} href="/profile/notifications" />
            <Row icon={Globe} label={t("Settings.Language")} href="/profile/language" />
            <Row icon={ShieldCheck} label={t("Settings.Security")} href="/profile/security" />
            <Row icon={Ticket} label={t("Settings.Promocodes")} href="/profile/promocodes" />
            <Row icon={Wallet} label={t("Nav.Wallet")} href="/wallet" />

            <Row icon={Heart} label={t("Settings.Help")} href="/profile/help" accent />
            <Row icon={Star} label={t("Settings.RateUs")} href="/profile/help" accent />

            <Row icon={ScrollText} label={t("Settings.PublicOffer")} href="/public-offer" />
            <Row icon={FileText} label={t("Settings.PrivacyPolicy")} href="/privacy-policy" />

            <Row icon={LogOut} label={t("Nav.Logout")} danger onClick={() => void logout()} />
          </TabsContent>
        </Tabs>
      </Screen>
    </>
  );
};
