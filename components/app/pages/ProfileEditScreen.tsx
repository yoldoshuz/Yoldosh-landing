"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, Loader2, Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppTopBar } from "@/components/app/AppTopBar";
import { ErrorNote, formatDate, Screen, Spinner, SuccessNote } from "@/components/app/kit";
import { UserAvatar } from "@/components/app/UserAvatar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFullProfile, useUpdateAvatar, useUpdateProfile } from "@/hooks/api/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { apiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Gender } from "@/types/api";

const BIO_MAX = 128;

/** `YYYY-MM-DD` is what the API takes; built locally so the day cannot shift. */
const toApiDate = (date?: Date) => {
  if (!date) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const parseDate = (value?: string | null) => {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
};

/**
 * "Личные данные" — who the user is, and nothing else.
 *
 * Ride preferences used to live here as switches; they have their own sheet on
 * the profile (where the rest of the app reads them from), and the navigator
 * setting is not part of this product's account screen at all.
 */
export const ProfileEditScreen = () => {
  const t = useTranslations("App");
  const { user } = useAuth();
  const { data: profile, isLoading } = useFullProfile();

  const updateProfile = useUpdateProfile();
  const updateAvatar = useUpdateAvatar();

  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    gender: undefined as Gender | undefined,
    birthday: undefined as Date | undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const current = profile ?? user;

  // Seed the form once the profile lands; `current?.id` keeps it from
  // clobbering edits on every background refetch.
  useEffect(() => {
    if (!current) return;
    setForm({
      firstName: current.firstName ?? "",
      lastName: current.lastName ?? "",
      bio: current.bio ?? "",
      gender: current.gender,
      birthday: parseDate(current.date_of__birthday),
    });
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async () => {
    setError(null);
    setSaved(false);
    try {
      await updateProfile.mutateAsync({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim() || null,
        bio: form.bio.trim() || null,
        gender: form.gender,
        date_of__birthday: toApiDate(form.birthday),
      });
      setSaved(true);
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.Generic")));
    }
  };

  if (isLoading && !user) {
    return (
      <>
        <AppTopBar title={t("Profile.PersonalData")} back />
        <Spinner />
      </>
    );
  }

  return (
    <>
      <AppTopBar title={t("Profile.PersonalData")} back="/profile" />
      <Screen>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void save();
          }}
          className="space-y-4"
        >
          <div className="flex justify-center pt-2">
            <div className="relative">
              <UserAvatar src={current?.avatar} name={current?.firstName} className="size-28" />
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void updateAvatar.mutateAsync(file).catch((err) => setError(apiErrorMessage(err)));
                }}
              />
              <Button
                type="button"
                size="icon"
                aria-label={t("Profile.ChangeAvatar")}
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-1 right-0 size-8 rounded-lg bg-brand-500 hover:bg-brand-600"
              >
                {updateAvatar.isPending ? <Loader2 className="size-4 animate-spin" /> : <Pencil className="size-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Field label={t("Profile.FirstName")} htmlFor="firstName">
              <Input
                id="firstName"
                maxLength={32}
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                className="h-14 rounded-2xl border-neutral-300 px-4"
                required
              />
            </Field>

            <Field label={t("Profile.LastName")} htmlFor="lastName">
              <Input
                id="lastName"
                maxLength={32}
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                className="h-14 rounded-2xl border-neutral-300 px-4"
              />
            </Field>

            {/*
              Our own calendar rather than `<input type="date">`: the native
              picker is a different control on every platform and none of them
              look like the app.
            */}
            <Field label={t("Profile.Birthday")}>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 w-full justify-between rounded-2xl border-neutral-300 px-4 text-base font-normal"
                  >
                    <span className={cn(!form.birthday && "text-ink-muted")}>
                      {form.birthday ? formatDate(form.birthday) : t("Profile.PickDate")}
                    </span>
                    <CalendarDays className="size-5 text-brand-500" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.birthday}
                    onSelect={(date) => setForm((f) => ({ ...f, birthday: date }))}
                    captionLayout="dropdown"
                    startMonth={new Date(1940, 0)}
                    endMonth={new Date()}
                    defaultMonth={form.birthday ?? new Date(1995, 0)}
                    disabled={{ after: new Date() }}
                  />
                </PopoverContent>
              </Popover>
            </Field>

            <Field label={t("Profile.Gender")}>
              <Select value={form.gender ?? ""} onValueChange={(v) => setForm((f) => ({ ...f, gender: v as Gender }))}>
                <SelectTrigger className="h-14! w-full rounded-2xl border-neutral-300 px-4">
                  <SelectValue placeholder={t("Profile.Gender")} />
                </SelectTrigger>
                <SelectContent>
                  {(["MALE", "FEMALE", "OTHER"] as Gender[]).map((g) => (
                    <SelectItem key={g} value={g}>
                      {t(`Profile.Genders.${g}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field label={t("Profile.Phone")} htmlFor="phone">
              <Input
                id="phone"
                value={current?.phoneNumber ?? ""}
                readOnly
                // The number is the account identity — changing it is a
                // re-verification flow, not a profile edit.
                className="h-14 rounded-2xl border-neutral-300 bg-neutral-50 px-4 text-ink-muted"
              />
            </Field>

            <Field label={t("Profile.Bio")} htmlFor="bio">
              <Textarea
                id="bio"
                maxLength={BIO_MAX}
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                className="min-h-28 rounded-2xl border-neutral-300 px-4 py-3"
              />
              <p className="mt-1 text-right text-xs text-ink-muted">
                {form.bio.length}/{BIO_MAX}
              </p>
            </Field>
          </div>

          <ErrorNote message={error} />
          <SuccessNote message={saved ? t("Profile.Saved") : null} />

          <Button
            type="submit"
            disabled={!form.firstName.trim() || updateProfile.isPending}
            className="h-13 w-full rounded-full bg-brand-500 text-base font-semibold hover:bg-brand-600 disabled:bg-neutral-300 disabled:opacity-100"
          >
            {updateProfile.isPending ? <Loader2 className="size-5 animate-spin" /> : t("Save")}
          </Button>
        </form>
      </Screen>
    </>
  );
};

/**
 * Outlined field with the label notched into the top border, the way the
 * mobile forms render them.
 */
const Field = ({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) => (
  <div className="relative">
    <Label
      htmlFor={htmlFor}
      className="absolute -top-2 left-3 z-10 bg-app-bg px-1.5 text-xs font-normal text-ink-muted"
    >
      {label}
    </Label>
    {children}
  </div>
);
