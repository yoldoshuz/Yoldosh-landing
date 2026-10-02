"use client";

import { useTranslations } from "next-intl";

import { AppIcon } from "@/components/app/AppIcon";
import { AppTopBar } from "@/components/app/AppTopBar";
import { EmptyState, formatDate, ILLUSTRATION, Screen, Spinner } from "@/components/app/kit";
import { useUserRatings } from "@/hooks/api/useRatings";
import { useAuth } from "@/hooks/useAuth";

export const ReviewsScreen = () => {
  const t = useTranslations("App");
  const { user } = useAuth();
  const { data: ratings, isLoading } = useUserRatings(user?.id);

  return (
    <>
      <AppTopBar title={t("Profile.Reviews")} back="/profile" />

      {isLoading ? (
        <Spinner />
      ) : !ratings || ratings.length === 0 ? (
        <Screen className="flex flex-1 items-center justify-center">
          <EmptyState illustration={ILLUSTRATION.noReviews} title={t("Profile.NoReviews")} />
        </Screen>
      ) : (
        <Screen className="space-y-3">
          {ratings.map((rating) => (
            <div key={rating.id} className="app-card p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <AppIcon key={i} name={i < rating.rating ? "fill_star_ic" : "empty_star_ic"} className="size-4" />
                  ))}
                </span>
                <span className="text-xs text-ink-muted">{formatDate(rating.createdAt)}</span>
              </div>
              {rating.feedback && <p className="mt-2 text-ink">{rating.feedback}</p>}
            </div>
          ))}
        </Screen>
      )}
    </>
  );
};
