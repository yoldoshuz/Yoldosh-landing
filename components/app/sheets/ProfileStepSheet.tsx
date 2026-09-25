"use client";

import { useEffect, useState } from "react";
import { Circle, CircleDot } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppSheet } from "@/components/app/AppSheet";
import { ErrorNote } from "@/components/app/kit";
import { PREFERENCE_KEYS, PreferenceField, type PreferenceValues } from "@/components/app/sheets/PreferencePicker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfile } from "@/hooks/api/useProfile";
import { apiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { AppUser, Gender } from "@/types/api";

/** The profile fields that are edited from their own sheet. */
export type ProfileStep = "firstName" | "lastName" | "bio" | "gender" | "preferences";

const GENDERS: Gender[] = ["MALE", "FEMALE", "OTHER"];
const BIO_MAX = 128;

interface ProfileStepSheetProps {
  step: ProfileStep | null;
  onClose: () => void;
  user?: AppUser | null;
}

/**
 * Edits one profile field in a bottom sheet.
 *
 * The mobile build never sends the checklist into the full edit form — each
 * item asks for exactly its own field and saves on the spot, which is what
 * keeps "0 из 7" moving without the user losing their place.
 */
export const ProfileStepSheet = ({ step, onClose, user }: ProfileStepSheetProps) => {
  const t = useTranslations("App.Profile");
  const tCommon = useTranslations("App");
  const update = useUpdateProfile();

  const [text, setText] = useState("");
  const [gender, setGender] = useState<Gender | undefined>();
  const [prefs, setPrefs] = useState<PreferenceValues>({});
  const [error, setError] = useState<string | null>(null);

  // Seed from the profile each time a sheet opens, so reopening after a save
  // shows what was stored rather than the previous draft.
  useEffect(() => {
    if (!step) return;
    setError(null);
    setText(
      step === "bio" ? (user?.bio ?? "") : step === "lastName" ? (user?.lastName ?? "") : (user?.firstName ?? "")
    );
    setGender(user?.gender);
    setPrefs({
      talkative: user?.talkative ?? undefined,
      music_allowed: user?.music_allowed ?? undefined,
      pets_allowed: user?.pets_allowed ?? undefined,
    });
  }, [step, user]);

  if (!step) return null;

  const valid =
    step === "gender"
      ? Boolean(gender)
      : step === "preferences"
        ? PREFERENCE_KEYS.every((key) => prefs[key] != null)
        : text.trim().length > 0;

  const save = async () => {
    setError(null);
    try {
      if (step === "gender") await update.mutateAsync({ gender });
      else if (step === "preferences") await update.mutateAsync(prefs);
      else if (step === "bio") await update.mutateAsync({ bio: text.trim() });
      else if (step === "lastName") await update.mutateAsync({ lastName: text.trim() });
      else await update.mutateAsync({ firstName: text.trim() });
      onClose();
    } catch (e) {
      setError(apiErrorMessage(e, tCommon("Errors.Generic")));
    }
  };

  const title =
    step === "bio"
      ? t("BioSheetTitle")
      : step === "preferences"
        ? t("PreferencesSheetTitle")
        : step === "gender"
          ? t("Gender")
          : step === "lastName"
            ? t("LastName")
            : t("FirstName");

  return (
    <AppSheet
      open
      onOpenChange={(open) => !open && onClose()}
      title={title}
      submitLabel={tCommon("Save")}
      onSubmit={() => void save()}
      submitDisabled={!valid}
      submitting={update.isPending}
    >
      <div className="space-y-4">
        {(step === "firstName" || step === "lastName") && (
          <Input
            autoFocus
            maxLength={32}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="h-14 rounded-2xl border-0 bg-neutral-100 px-4 text-base shadow-none focus-visible:ring-0"
          />
        )}

        {step === "bio" && (
          <div>
            <Textarea
              autoFocus
              maxLength={BIO_MAX}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-32 resize-none rounded-2xl border-0 bg-neutral-100 px-4 py-3.5 text-base shadow-none focus-visible:ring-0"
            />
            <p className="mt-1 text-right text-xs text-ink-muted">
              {text.length}/{BIO_MAX}
            </p>
          </div>
        )}

        {step === "gender" && (
          <div className="space-y-2.5">
            {GENDERS.map((value) => {
              const active = gender === value;
              const Icon = active ? CircleDot : Circle;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setGender(value)}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-4 py-4 text-left transition",
                    active ? "border-brand-400 bg-brand-50" : "border-transparent bg-neutral-100"
                  )}
                >
                  <Icon className={cn("size-6 shrink-0", active ? "text-brand-500" : "text-neutral-400")} />
                  <span className="font-bold text-ink">{t(`Genders.${value}`)}</span>
                </button>
              );
            })}
          </div>
        )}

        {step === "preferences" && (
          <div className="space-y-3">
            {PREFERENCE_KEYS.map((key) => (
              <PreferenceField
                key={key}
                name={key}
                value={prefs[key]}
                onChange={(value) => setPrefs((p) => ({ ...p, [key]: value }))}
              />
            ))}
          </div>
        )}

        <ErrorNote message={error} />
      </div>
    </AppSheet>
  );
};
