"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Star } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import { UserAvatar } from "@/components/app/UserAvatar";
import { Screen, Spinner } from "@/components/app/kit";
import { profileApi } from "@/hooks/api/useProfile";
import { useUserRatings } from "@/hooks/api/useRatings";

const ageFrom = (birthday?: string | null) => {
  if (!birthday) return null;
  const d = new Date(birthday);
  if (Number.isNaN(d.getTime())) return null;
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
};

export const PublicProfileScreen = ({ userId }: { userId: string }) => {
  const t = useTranslations("App");

  const { data: user, isLoading } = useQuery({
    queryKey: ["app", "user", userId],
    queryFn: () => profileApi.byId(userId),
    enabled: Boolean(userId),
  });
  const { data: ratings } = useUserRatings(userId);

  if (isLoading) {
    return (
      <>
        <AppTopBar title={t("Profile.Title")} variant="green" back />
        <Spinner />
      </>
    );
  }

  const age = ageFrom(user?.date_of__birthday);

  return (
    <>
      {/* Green panel with a curved base, the avatar straddling the seam. */}
      <div className="app-hero relative pb-16">
        <AppTopBar title={t("Profile.Title")} variant="hero" back className="bg-transparent pb-0" />
        <div className="flex justify-center pt-2">
          <UserAvatar
            src={user?.avatar}
            name={user?.firstName}
            className="size-28 border-4 border-white/25 lg:border-neutral-200"
            fallbackClassName="bg-white/25 lg:bg-brand-400"
          />
        </div>
      </div>

      <Screen className="-mt-4 space-y-3">
        <div className="pb-2 text-center">
          <p className="text-2xl font-bold text-brand-600">
            {user?.firstName} {user?.lastName ?? ""}
          </p>
          <p className="text-brand-500">{t(`Role.${user?.role ?? "Passenger"}`)}</p>
        </div>

        <div className="app-card p-4">
          <p className="font-bold text-ink">{t("Profile.Age")}</p>
          <p className="mt-1 text-ink-muted">{age ? t("Profile.Years", { count: age }) : t("Profile.NotSet")}</p>
        </div>

        <div className="app-card p-4">
          <p className="font-bold text-ink">{t("Profile.Bio")}</p>
          <p className="mt-1 text-ink-muted">{user?.bio || t("Profile.NoBio")}</p>
        </div>

        <Link href={`/users/${userId}` as any} className="app-card flex items-center gap-3 p-4">
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
        </Link>
      </Screen>
    </>
  );
};
