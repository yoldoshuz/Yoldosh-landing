"use client";

import { useState } from "react";
import { MoveRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { AppTopBar } from "@/components/app/AppTopBar";
import { EmptyState, ErrorNote, formatDateTime, formatMoney, ILLUSTRATION, Screen, Spinner, StatusBadge } from "@/components/app/kit";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCancelParcel, useMyParcels } from "@/hooks/api/useParcels";
import { apiErrorMessage } from "@/lib/api";

const CANCELLABLE = ["PENDING", "CONFIRMED"];

export const ParcelsScreen = () => {
  const t = useTranslations("App");
  const { data: parcels, isLoading } = useMyParcels();
  const cancelParcel = useCancelParcel();

  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const cancel = async (parcelId: string) => {
    if (!reason.trim()) return;
    setError(null);
    try {
      await cancelParcel.mutateAsync({ parcelId, cancellationReason: reason.trim() });
      setReason("");
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.Generic")));
    }
  };

  return (
    <>
      <AppTopBar title={t("Parcels.Title")} back="/profile" />

      {isLoading ? (
        <Spinner />
      ) : !parcels || parcels.length === 0 ? (
        <Screen className="flex flex-1 items-center justify-center">
          <EmptyState
            illustration={ILLUSTRATION.documents}
            title={t("Parcels.Empty")}
            description={t("Parcels.EmptyText")}
            action={
              <Button asChild className="h-13 w-full rounded-full bg-brand-500 text-base font-semibold hover:bg-brand-600">
                <Link href="/search">{t("Parcels.FindTrip")}</Link>
              </Button>
            }
          />
        </Screen>
      ) : (
        <Screen className="space-y-3">
          <ErrorNote message={error} />

          {parcels.map((parcel) => (
            <div key={parcel.id} className="app-card p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="flex min-w-0 items-center gap-2 font-bold text-ink">
                  <span className="truncate">{parcel.pickup_location?.city ?? "—"}</span>
                  <MoveRight className="size-4 shrink-0 text-brand-500" />
                  <span className="truncate">{parcel.dropoff_location?.city ?? "—"}</span>
                </p>
                <StatusBadge status={parcel.status} label={t(`ParcelStatus.${parcel.status}`)} />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-sm text-ink-muted">{formatDateTime(parcel.created_at)}</span>
                <span className="font-bold text-brand-600">{formatMoney(parcel.price)}</span>
              </div>

              <div className="mt-3 flex items-center gap-2">
                {parcel.trip_id && (
                  <Button asChild size="sm" variant="outline" className="rounded-full">
                    <Link href={`/ride/${parcel.trip_id}` as any}>{t("Parcels.ViewTrip")}</Link>
                  </Button>
                )}

                {CANCELLABLE.includes(parcel.status) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="ghost" className="rounded-full text-danger hover:text-danger">
                        {t("Cancel")}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-3xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t("Parcels.CancelPrompt")}</AlertDialogTitle>
                      </AlertDialogHeader>
                      <Input
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder={t("Parcels.CancelPlaceholder")}
                        className="h-12 rounded-2xl"
                      />
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-full">{t("Cancel")}</AlertDialogCancel>
                        <AlertDialogAction
                          disabled={!reason.trim()}
                          onClick={() => void cancel(parcel.id)}
                          className="rounded-full bg-danger hover:bg-danger/90"
                        >
                          {t("Send")}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </Screen>
      )}
    </>
  );
};
