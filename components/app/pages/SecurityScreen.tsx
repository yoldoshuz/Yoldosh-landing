"use client";

import { useState } from "react";
import { ChevronRight, Loader2, UserX } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppTopBar } from "@/components/app/AppTopBar";
import { UserAvatar } from "@/components/app/UserAvatar";
import { ErrorNote, Screen, SectionLabel } from "@/components/app/kit";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useBlockedUsers, useDeleteAccount, useUnblockUser } from "@/hooks/api/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/api";

export const SecurityScreen = () => {
  const t = useTranslations("App");
  const { logout } = useAuth();

  const { data: blocked } = useBlockedUsers();
  const unblockUser = useUnblockUser();
  const deleteAccount = useDeleteAccount();
  const [error, setError] = useState<string | null>(null);

  const removeAccount = async () => {
    setError(null);
    try {
      await deleteAccount.mutateAsync();
      await logout();
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.Generic")));
    }
  };

  return (
    <>
      <AppTopBar title={t("Settings.Security")} back="/profile" />
      <Screen className="space-y-4">
        <ErrorNote message={error} />

        {/* Irreversible, so it sits behind an explicit confirmation dialog. */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              type="button"
              className="flex w-full cursor-pointer items-start gap-3 rounded-2xl px-1 py-2 text-left transition hover:bg-neutral-100/60"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-lg font-bold text-danger">{t("Settings.DeleteAccount")}</span>
                <span className="mt-0.5 block text-sm leading-relaxed text-neutral-600">{t("Settings.DeleteText")}</span>
              </span>
              <ChevronRight className="mt-1 size-5 shrink-0 text-ink-muted" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>{t("Settings.DeleteAccount")}</AlertDialogTitle>
              <AlertDialogDescription>{t("Settings.DeleteConfirm")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">{t("Cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => void removeAccount()}
                className="rounded-full bg-danger hover:bg-danger/90"
              >
                {deleteAccount.isPending ? <Loader2 className="size-4 animate-spin" /> : t("Delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {blocked && blocked.length > 0 && (
          <div>
            <SectionLabel>{t("Settings.BlockedUsers")}</SectionLabel>
            <div className="app-card divide-y divide-neutral-100 px-4">
              {blocked.map((b) => (
                <div key={b.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <UserAvatar
                      src={b.avatar}
                      name={b.firstName}
                      className="size-10"
                      fallbackClassName="bg-neutral-300"
                    />
                    <span className="truncate font-medium text-ink">
                      {b.firstName} {b.lastName ?? ""}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full"
                    disabled={unblockUser.isPending}
                    onClick={() => void unblockUser.mutateAsync(b.id)}
                  >
                    <UserX className="size-4" />
                    {t("Settings.Unblock")}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Screen>
    </>
  );
};
