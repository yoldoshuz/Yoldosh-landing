"use client";

import { useRef, useState } from "react";
import {
  Bell,
  ChevronRight,
  CircleUserRound,
  FileText,
  Globe,
  Heart,
  LogOut,
  Phone,
  Plus,
  ScrollText,
  ShieldCheck,
  Star,
  Ticket,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import { CompletionCard, ErrorNote, Row, Screen, SectionLabel, Spinner } from "@/components/app/kit";
import { LegalSheet, type LegalDocument } from "@/components/app/sheets/LegalSheet";
import { PREFERENCE_ICON, PREFERENCE_KEYS } from "@/components/app/sheets/PreferencePicker";
import { ProfileStepSheet, type ProfileStep } from "@/components/app/sheets/ProfileStepSheet";
import { UserAvatar } from "@/components/app/UserAvatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyActivity } from "@/hooks/api/useAppTrips";
import { useFullProfile, useUpdateAvatar } from "@/hooks/api/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

/** A checklist entry either opens a sheet, picks a file, or goes somewhere. */
type ChecklistAction = { sheet: ProfileStep } | { avatar: true } | { href: string };

export const ProfileScreen = () => {
  const t = useTranslations("App");
  const { user, logout } = useAuth();
  const { data: profile, isLoading } = useFullProfile();
  const { data: activity } = useMyActivity("passenger");
  const updateAvatar = useUpdateAvatar();
  const router = useRouter();

  const [tab, setTab] = useState("about");
  const [sheet, setSheet] = useState<ProfileStep | null>(null);
  const [legal, setLegal] = useState<LegalDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const current = profile ?? user;

  if (isLoading && !user) {
    return (
      <>
        <AppTopBar title={t("Profile.Title")} />
        <Spinner />
      </>
    );
  }

  const prefsSet = PREFERENCE_KEYS.every((key) => current?.[key] != null);
  const hasTrips = (activity?.pages[0]?.total ?? 0) > 0;

  /**
   * Seven steps, in the mobile build's order, each nudging the user straight
   * into the thing it is missing rather than into the full edit form.
   */
  const checklist: { done: boolean; labelKey: string; action: ChecklistAction }[] = [
    { done: Boolean(current?.firstName), labelKey: "AddFirstName", action: { sheet: "firstName" } },
    { done: Boolean(current?.lastName), labelKey: "AddLastName", action: { sheet: "lastName" } },
    { done: Boolean(current?.avatar), labelKey: "AddPhoto", action: { avatar: true } },
    { done: Boolean(current?.bio), labelKey: "AddBio", action: { sheet: "bio" } },
    { done: Boolean(current?.gender), labelKey: "AddGender", action: { sheet: "gender" } },
    { done: prefsSet, labelKey: "AddPrefs", action: { sheet: "preferences" } },
    { done: hasTrips, labelKey: "FirstTrip", action: { href: "/search" } },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const nextStep = checklist.find((c) => !c.done);

  const runAction = (action: ChecklistAction) => {
    if ("sheet" in action) setSheet(action.sheet);
    else if ("avatar" in action) avatarRef.current?.click();
    else router.push(action.href as never);
  };

  const pickAvatar = (file?: File) => {
    if (!file) return;
    setError(null);
    void updateAvatar.mutateAsync(file).catch((e) => setError(apiErrorMessage(e, t("Errors.Generic"))));
  };

  return (
    <>
      <AppTopBar title={t("Profile.Title")} />
      <Screen>
        <input
          ref={avatarRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => pickAvatar(e.target.files?.[0])}
        />

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-12 w-full rounded-full bg-neutral-100 p-1 lg:h-14">
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
          <TabsContent value="about" className="mt-4 flex w-full flex-col gap-4">
            <ErrorNote message={error} />

            <div className="app-card-rail w-full overflow-hidden">
              {/*
                The name row is the person, so it opens how everyone else sees
                them; editing is the row below it. Both used to land on the
                edit form, which left the public profile unreachable.
              */}
              <Link
                href={`/users/${current?.id ?? ""}` as never}
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

            {nextStep && (
              <CompletionCard
                title={t("Profile.CompletionTitle")}
                description={t("Profile.CompletionText")}
                done={doneCount}
                total={checklist.length}
                progressLabel={t("Profile.CompletionProgress", { done: doneCount, total: checklist.length })}
                nextAction={
                  <button
                    type="button"
                    onClick={() => runAction(nextStep.action)}
                    className="cursor-pointer font-semibold text-brand-600 transition hover:text-brand-700"
                  >
                    {t(`Profile.Checklist.${nextStep.labelKey}`)}
                  </button>
                }
              />
            )}

            <div className="w-full">
              <SectionLabel className="mt-0">{t("Profile.TabAbout")}</SectionLabel>
              <div className="app-card-rail space-y-3 p-4">
                {current?.bio ? (
                  <p className="text-ink">{current.bio}</p>
                ) : (
                  <AddLink label={t("Profile.AddBioCta")} onClick={() => setSheet("bio")} />
                )}

                {prefsSet ? (
                  <div className="space-y-2">
                    {PREFERENCE_KEYS.map((key) => {
                      const Icon = PREFERENCE_ICON[key];
                      const on = current?.[key];
                      return (
                        <p
                          key={key}
                          // Green when the user is open to it, red when they would
                          // rather not — the colour carries the answer at a glance.
                          className={cn("flex items-center gap-2.5", on ? "text-brand-600" : "text-danger")}
                        >
                          <Icon className="size-5 shrink-0" strokeWidth={1.8} />
                          {t(`Profile.PrefValue.${key}.${on ? "yes" : "no"}`)}
                        </p>
                      );
                    })}
                  </div>
                ) : (
                  <AddLink label={t("Profile.AddPrefsCta")} onClick={() => setSheet("preferences")} />
                )}

                <button
                  type="button"
                  onClick={() => setSheet("preferences")}
                  className="flex w-full cursor-pointer items-center gap-3 border-t border-neutral-100 pt-3 text-left font-medium text-ink"
                >
                  <span className="flex-1">{t("Profile.ChangePrefs")}</span>
                  <ChevronRight className="size-5 text-ink-muted" />
                </button>
              </div>
            </div>

            <div>
              <SectionLabel>{t("Profile.BecomeDriver")}</SectionLabel>
              {/*
                Straight into the form. The garage list in between was a dead
                step: a driver with no car saw an empty page and had to press
                "add" a second time.
              */}
              <Link
                href={{ pathname: "/profile/cars", query: { add: "1" } }}
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
          </TabsContent>

          {/* ------------------------------------------------------ Аккаунт */}
          <TabsContent value="account" className="mt-4 flex w-full flex-col gap-2">
            <Row icon={Bell} label={t("Settings.Notifications")} href="/profile/notifications" />
            <Row icon={Globe} label={t("Settings.Language")} href="/profile/language" />
            <Row icon={ShieldCheck} label={t("Settings.Security")} href="/profile/security" />
            <Row icon={Ticket} label={t("Settings.Promocodes")} href="/profile/promocodes" />
            <Row icon={Wallet} label={t("Nav.Wallet")} href="/wallet" />

            <Row icon={Heart} label={t("Settings.Help")} href="/profile/help" accent />
            <Row icon={Star} label={t("Settings.RateUs")} href="/profile/help" accent />

            {/* Opened in place: inside Telegram the landing is unreachable. */}
            <Row icon={ScrollText} label={t("Settings.PublicOffer")} onClick={() => setLegal("offer")} />
            <Row icon={FileText} label={t("Settings.PrivacyPolicy")} onClick={() => setLegal("privacy")} />

            <Row icon={LogOut} label={t("Nav.Logout")} danger onClick={() => void logout()} />
          </TabsContent>
        </Tabs>
      </Screen>

      <ProfileStepSheet step={sheet} onClose={() => setSheet(null)} user={current} />
      <LegalSheet document={legal} onClose={() => setLegal(null)} />
    </>
  );
};

/** "+ Расскажите о себе" — the pale green prompt inside the О себе card. */
const AddLink = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="flex cursor-pointer items-center gap-2.5 text-left text-brand-600">
    <Plus className="size-5 rounded-md border border-brand-300 p-0.5" />
    {label}
  </button>
);
