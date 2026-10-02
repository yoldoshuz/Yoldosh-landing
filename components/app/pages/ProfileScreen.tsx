"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { Link, useRouter } from "@/app/i18n/routing";
import { AppIcon } from "@/components/app/AppIcon";
import { AppTopBar } from "@/components/app/AppTopBar";
import {
  CompletionCard,
  ErrorNote,
  formatMoney,
  fullName,
  Row,
  Screen,
  SectionLabel,
  Spinner,
} from "@/components/app/kit";
import { LegalSheet, type LegalDocument } from "@/components/app/sheets/LegalSheet";
import { PREFERENCE_ICON, PREFERENCE_KEYS } from "@/components/app/sheets/PreferencePicker";
import { ProfileStepSheet, type ProfileStep } from "@/components/app/sheets/ProfileStepSheet";
import { UserAvatar } from "@/components/app/UserAvatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyActivity } from "@/hooks/api/useAppTrips";
import { useFullProfile, useUpdateAvatar } from "@/hooks/api/useProfile";
import { useWallet } from "@/hooks/api/useWallet";
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
  const { data: wallet } = useWallet();
  const updateAvatar = useUpdateAvatar();
  const router = useRouter();

  const [tab, setTab] = useState("about");
  const [sheet, setSheet] = useState<ProfileStep | null>(null);
  const [legal, setLegal] = useState<LegalDocument | null>(null);
  const [error, setError] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const current = profile ?? user;

  /*
    The mobile build opens straight onto the two tabs — no "Профиль" heading
    above them, which only repeated the tab bar's label. The bar stays for its
    spacing (and, inside Telegram, for clearing the client's header); the
    heading itself is kept for desktop, where there is no tab bar to name the
    page.
  */
  const topBar = <AppTopBar title={t("Profile.Title")} className="[&_h1]:hidden lg:[&_h1]:block" />;

  if (isLoading && !user) {
    return (
      <>
        {topBar}
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
      {topBar}
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
                <UserAvatar src={current?.avatar} name={current?.firstName} className="size-14" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xl text-ink">{fullName(current) || "—"}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-[15px] text-ink-muted">
                    <AppIcon name="phone_icon" className="size-4" />
                    {current?.phoneNumber}
                  </span>
                </span>
                <AppIcon name="right2" className="size-6 text-ink" />
              </Link>

              {/* The balance sits with the person, as in the mobile build. */}
              <div className="mx-4 flex items-center gap-4 border-t border-neutral-200 py-3.5">
                <span className="grid size-14 shrink-0 place-items-center rounded-full border border-neutral-200">
                  <AppIcon name="wallet" className="size-7 text-[#41B06E]" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xl text-ink">
                    {formatMoney(wallet?.balance ?? 0, t("Trip.Currency"))}
                  </span>
                  <span className="block text-sm text-ink-muted">{t("Profile.BalanceLabel")}</span>
                </span>
                <Link
                  href="/wallet"
                  className="shrink-0 rounded-full bg-brand-500 px-5 py-2.5 text-[15px] font-medium text-white transition hover:bg-brand-600"
                >
                  {t("Profile.TopUp")}
                </Link>
              </div>

              <Link href="/profile/edit" className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-neutral-50">
                <span className="flex-1 text-lg text-ink">{t("Profile.EditProfile")}</span>
                <AppIcon name="right2" className="size-6 text-ink" />
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
              {/*
                Each line is its own way in: a "+" prompt while the field is
                empty, the stored answer once it is filled — tapping either
                opens the same sheet. The separate "Изменить предпочтения" row
                that closed the card was a third way to that sheet, and not in
                the mobile build.
              */}
              <div className="app-card-rail space-y-4 p-4">
                {current?.bio ? (
                  <button
                    type="button"
                    onClick={() => setSheet("bio")}
                    className="block w-full cursor-pointer whitespace-pre-wrap text-left text-ink"
                  >
                    {current.bio}
                  </button>
                ) : (
                  <AddLink label={t("Profile.AddBioCta")} onClick={() => setSheet("bio")} />
                )}

                {prefsSet ? (
                  <button
                    type="button"
                    onClick={() => setSheet("preferences")}
                    className="block w-full cursor-pointer space-y-2 text-left"
                  >
                    {PREFERENCE_KEYS.map((key) => {
                      const on = current?.[key];
                      return (
                        <span
                          key={key}
                          // Green when the user is open to it, red when they would
                          // rather not — the colour carries the answer at a glance.
                          className={cn("flex items-center gap-2.5", on ? "text-brand-600" : "text-danger")}
                        >
                          <AppIcon name={PREFERENCE_ICON[key]} className="size-5" />
                          {t(`Profile.PrefValue.${key}.${on ? "yes" : "no"}`)}
                        </span>
                      );
                    })}
                  </button>
                ) : (
                  <AddLink label={t("Profile.AddPrefsCta")} onClick={() => setSheet("preferences")} />
                )}
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
                <span className="flex-1 text-xl text-brand-600">{t("Profile.AddCar")}</span>
                <AppIcon name="add_ic_square" className="size-8 text-brand-500" />
              </Link>
            </div>

            {/*
              "Отзывы о вас" and "Публичный профиль" used to sit here. Both are
              already reachable — the name row at the top opens the public
              profile, and the rating with its reviews is a card inside it — so
              the pair was a second way to the same two screens.
            */}
          </TabsContent>

          {/* ------------------------------------------------------ Аккаунт */}
          <TabsContent value="account" className="mt-4 flex w-full flex-col gap-2">
            <Row icon="notification" label={t("Settings.Notifications")} href="/profile/notifications" />
            <Row icon="language" label={t("Settings.Language")} href="/profile/language" />
            <Row icon="shield" label={t("Settings.Security")} href="/profile/security" />
            <Row icon="promocode_ic" label={t("Settings.Promocodes")} href="/profile/promocodes" />
            <Row icon="wallet" label={t("Nav.Wallet")} href="/wallet" />

            <Row icon="heart" label={t("Settings.Help")} href="/profile/help" accent />
            <Row icon="star" label={t("Settings.RateUs")} href="/profile/help" accent />

            {/* Opened in place: inside Telegram the landing is unreachable. */}
            <Row icon="public_offer_ic" label={t("Settings.PublicOffer")} onClick={() => setLegal("offer")} />
            <Row icon="privacy_conf_ic" label={t("Settings.PrivacyPolicy")} onClick={() => setLegal("privacy")} />

            <Row icon="logout" label={t("Nav.Logout")} danger onClick={() => void logout()} />
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
  <button
    type="button"
    onClick={onClick}
    className="flex cursor-pointer items-center gap-3 text-left text-lg text-brand-600"
  >
    <AppIcon name="add_ic_square" className="size-7 text-brand-500" />
    {label}
  </button>
);
