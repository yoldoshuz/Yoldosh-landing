"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronRight, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppSheet } from "@/components/app/AppSheet";
import { AppTopBar } from "@/components/app/AppTopBar";
import { ErrorNote, formatDate, Screen, Spinner } from "@/components/app/kit";
import { PREFERENCE_ICON, PREFERENCE_KEYS } from "@/components/app/sheets/PreferencePicker";
import { UserAvatar } from "@/components/app/UserAvatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { profileApi } from "@/hooks/api/useProfile";
import { useUserRatings } from "@/hooks/api/useRatings";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

const ageFrom = (birthday?: string | null) => {
  if (!birthday) return null;
  const d = new Date(birthday);
  if (Number.isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
};

/**
 * How everyone else sees a person: what they chose to share, their rating, and
 * the way to stop hearing from them. Nothing editable — the account holder
 * reaches their own version of this screen too, and it must read the same.
 */
export const PublicProfileScreen = ({ userId }: { userId: string }) => {
  const t = useTranslations("App");
  const { user: me } = useAuth();

  const { data: user, isLoading } = useQuery({
    queryKey: ["app", "user", userId],
    queryFn: () => profileApi.byId(userId),
    enabled: Boolean(userId),
  });
  const { data: ratings } = useUserRatings(userId);

  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [confirmBlock, setConfirmBlock] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [blocked, setBlocked] = useState(false);

  const block = useMutation({
    mutationFn: () => profileApi.blockUser(userId),
    onSuccess: () => setBlocked(true),
    onError: (e) => setError(apiErrorMessage(e, t("Errors.Generic"))),
  });

  if (isLoading) {
    return (
      <>
        <AppTopBar title={t("Profile.Title")} variant="green" back />
        <Spinner />
      </>
    );
  }

  const age = ageFrom(user?.date_of__birthday);
  const prefsSet = PREFERENCE_KEYS.some((key) => user?.[key] != null);
  const isMe = me?.id === userId;

  return (
    <>
      {/*
        The hero's bottom edge bulges downward at the centre, so its lowest
        point is the box bottom — pulling the content up into it (as a negative
        margin did) hid the name behind the curve on a phone.
      */}
      <div className="app-hero relative pb-10">
        <AppTopBar title={t("Profile.Title")} variant="hero" back className="bg-transparent pb-0" />
        <div className="flex justify-center pt-1">
          <UserAvatar
            src={user?.avatar}
            name={user?.firstName}
            className="size-28 border-4 border-white/25 lg:border-neutral-200"
            fallbackClassName="bg-white/25 lg:bg-brand-400"
          />
        </div>
      </div>

      <Screen className="space-y-3 pt-5">
        <div className="pb-1 text-center">
          <p className="text-2xl font-bold text-brand-600">
            {user?.firstName} {user?.lastName ?? ""}
          </p>
          <p className="text-brand-500">{t(`Role.${user?.role ?? "Passenger"}`)}</p>
        </div>

        <Card title={t("Profile.Age")}>
          <p className="mt-1 text-ink-muted">{age ? t("Profile.Years", { count: age }) : t("Profile.NotSet")}</p>
        </Card>

        <Card title={t("Profile.Bio")}>
          <p className="mt-1 whitespace-pre-wrap text-ink-muted">{user?.bio || t("Profile.NoBio")}</p>
        </Card>

        {prefsSet && (
          <Card title={t("Profile.PreferencesSheetTitle")}>
            <div className="mt-2 space-y-2">
              {PREFERENCE_KEYS.filter((key) => user?.[key] != null).map((key) => {
                const Icon = PREFERENCE_ICON[key];
                const on = user?.[key];
                return (
                  <p key={key} className={cn("flex items-center gap-2.5", on ? "text-brand-600" : "text-danger")}>
                    <Icon className="size-5 shrink-0" strokeWidth={1.8} />
                    {t(`Profile.PrefValue.${key}.${on ? "yes" : "no"}`)}
                  </p>
                );
              })}
            </div>
          </Card>
        )}

        <button
          type="button"
          onClick={() => setReviewsOpen(true)}
          className="app-card flex w-full cursor-pointer items-center gap-3 p-4 text-left"
        >
          <span className="min-w-0 flex-1">
            <span className="block font-bold text-ink">
              {t(user?.role === "Driver" ? "Profile.DriverRating" : "Profile.PassengerRating")}
            </span>
            <span className="mt-0.5 block text-xs text-ink-muted">
              {t("Profile.ReviewCount", { count: ratings?.length ?? 0 })}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5 font-semibold text-ink">
            <Star className="size-5 fill-star stroke-star" />
            {(user?.rating ?? 0).toFixed(1)}
          </span>
          <ChevronRight className="size-5 shrink-0 text-ink-muted" />
        </button>

        <ErrorNote message={error} />

        {/* Blocking yourself is not a thing, so the row simply is not there. */}
        {!isMe && (
          <button
            type="button"
            disabled={blocked || block.isPending}
            onClick={() => setConfirmBlock(true)}
            className="w-full cursor-pointer py-3 text-left font-medium text-danger transition disabled:cursor-default disabled:text-ink-muted"
          >
            {blocked ? t("Profile.Blocked") : t("Profile.BlockUser")}
          </button>
        )}
      </Screen>

      <AppSheet
        open={reviewsOpen}
        onOpenChange={setReviewsOpen}
        title={t(user?.role === "Driver" ? "Profile.DriverRating" : "Profile.PassengerRating")}
      >
        <div className="space-y-3 pb-8">
          {!ratings || ratings.length === 0 ? (
            <p className="py-10 text-center text-ink-muted">{t("Profile.NoReviews")}</p>
          ) : (
            ratings.map((rating) => (
              <div key={rating.id} className="rounded-2xl bg-neutral-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={cn("size-4", i < rating.rating ? "fill-star stroke-star" : "stroke-neutral-300")}
                      />
                    ))}
                  </span>
                  <span className="text-xs text-ink-muted">{formatDate(rating.createdAt)}</span>
                </div>
                {rating.feedback && <p className="mt-2 text-ink">{rating.feedback}</p>}
              </div>
            ))
          )}
        </div>
      </AppSheet>

      <AlertDialog open={confirmBlock} onOpenChange={setConfirmBlock}>
        <AlertDialogContent className="rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Profile.BlockConfirm", { name: user?.firstName ?? "" })}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">{t("Cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void block.mutateAsync()}
              className="rounded-full bg-danger hover:bg-danger/90"
            >
              {t("Profile.BlockUser")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="app-card p-4">
    <p className="font-bold text-ink">{title}</p>
    {children}
  </div>
);
