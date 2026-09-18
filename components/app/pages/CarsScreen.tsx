"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, ScanLine, Trash2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

import { AppTopBar } from "@/components/app/AppTopBar";
import { EmptyState, ErrorNote, ILLUSTRATION, Screen, Spinner, StatusBadge, SuccessNote } from "@/components/app/kit";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateCar, useDeleteCar, useMyCars, type CreateCarPayload } from "@/hooks/api/useCars";
import { apiErrorMessage } from "@/lib/api";
import { readCarDocument } from "@/lib/ocr";
import { cn } from "@/lib/utils";

const EMPTY_CAR: CreateCarPayload = {
  make: "",
  model: "",
  year: new Date().getFullYear(),
  plate_number: "",
  seats_standard: 4,
  color: "",
};

export const CarsScreen = () => {
  const t = useTranslations("App");

  const { data: cars, isLoading } = useMyCars();
  const createCar = useCreateCar();
  const deleteCar = useDeleteCar();

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<CreateCarPayload>(EMPTY_CAR);
  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [passportFront, setPassportFront] = useState<File | null>(null);
  const [passportBack, setPassportBack] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ready = Boolean(form.make.trim() && form.model.trim() && form.plate_number.trim() && form.color.trim());

  /**
   * Reads a registration photo and fills in whatever it recognised. Existing
   * values win: a field the driver already corrected is never overwritten by a
   * later scan.
   */
  const scan = async (file: File) => {
    setError(null);
    setScanning(true);
    setScanProgress(0);
    try {
      const result = await readCarDocument(file, setScanProgress);
      setForm((f) => ({
        ...f,
        make: f.make || result.make || "",
        model: f.model || result.model || "",
        plate_number: f.plate_number || result.plate_number || "",
        color: f.color || result.color || "",
        year: f.year !== EMPTY_CAR.year ? f.year : (result.year ?? f.year),
      }));
      setScanned(true);
    } catch (e) {
      // A failed scan is not a failed upload — the driver can still type.
      setError(apiErrorMessage(e, t("Cars.ScanFailed")));
    } finally {
      setScanning(false);
    }
  };

  const submit = async () => {
    if (!ready) return;
    setError(null);
    try {
      await createCar.mutateAsync({
        ...form,
        make: form.make.trim(),
        model: form.model.trim(),
        plate_number: form.plate_number.trim().toUpperCase(),
        color: form.color.trim(),
      });
      setForm(EMPTY_CAR);
      setLicenseFront(null);
      setPassportFront(null);
      setPassportBack(null);
      setScanned(false);
      setAdding(false);
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.Generic")));
    }
  };

  if (isLoading) {
    return (
      <>
        <AppTopBar title={t("Cars.Title")} back="/profile" />
        <Spinner />
      </>
    );
  }

  if (adding) {
    return (
      <>
        <AppTopBar title={t("Cars.AddTitle")} onBack={() => setAdding(false)} />
        <Screen>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
            className="space-y-4"
          >
            <p className="text-sm text-ink-muted">{t("Cars.ScanHint")}</p>

            <div>
              <h2 className="text-lg font-bold text-ink">
                {t("Cars.UploadLicense")}
                <span className="text-danger">*</span>
              </h2>
              <Dropzone
                label={t("Cars.FrontSide")}
                hint={t("Cars.SizeHint")}
                file={licenseFront}
                onFile={(file) => {
                  setLicenseFront(file);
                  if (file) void scan(file);
                }}
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-ink">
                {t("Cars.UploadPassport")}
                <span className="text-danger">*</span>
              </h2>
              <Dropzone
                label={t("Cars.FrontSide")}
                hint={t("Cars.SizeHint")}
                file={passportFront}
                onFile={(file) => {
                  setPassportFront(file);
                  if (file) void scan(file);
                }}
              />
              <Dropzone
                label={t("Cars.BackSide")}
                hint={t("Cars.SizeHint")}
                file={passportBack}
                onFile={setPassportBack}
              />
            </div>

            {scanning && (
              <div className="app-card space-y-2 p-4">
                <p className="flex items-center gap-2 text-sm font-medium text-ink">
                  <ScanLine className="size-4 animate-pulse text-brand-500" />
                  {t("Cars.Scanning")}
                </p>
                <Progress value={Math.round(scanProgress * 100)} className="h-1.5" />
              </div>
            )}

            <SuccessNote message={scanned && !scanning ? t("Cars.ScanDone") : null} />

            {/*
              Recognition is imperfect, so the extracted values stay editable —
              they are shown for confirmation, not collected from scratch.
            */}
            <div className="app-card grid gap-3 p-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <h2 className="font-bold text-ink">{t("Cars.RecognisedTitle")}</h2>
                <p className="mt-0.5 text-sm text-ink-muted">{t("Cars.RecognisedHint")}</p>
              </div>

              <div>
                <Label htmlFor="make" className="mb-1.5">
                  {t("Cars.Make")}
                </Label>
                <Input
                  id="make"
                  value={form.make}
                  onChange={(e) => setForm((f) => ({ ...f, make: e.target.value }))}
                  placeholder="Chevrolet"
                  className="h-12 rounded-2xl"
                />
              </div>
              <div>
                <Label htmlFor="model" className="mb-1.5">
                  {t("Cars.Model")}
                </Label>
                <Input
                  id="model"
                  value={form.model}
                  onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                  placeholder="Cobalt"
                  className="h-12 rounded-2xl"
                />
              </div>
              <div>
                <Label htmlFor="year" className="mb-1.5">
                  {t("Cars.Year")}
                </Label>
                <Input
                  id="year"
                  type="number"
                  min={1980}
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={(e) => setForm((f) => ({ ...f, year: Number(e.target.value) }))}
                  className="h-12 rounded-2xl"
                />
              </div>
              <div>
                <Label htmlFor="plate" className="mb-1.5">
                  {t("Cars.Plate")}
                </Label>
                <Input
                  id="plate"
                  value={form.plate_number}
                  onChange={(e) => setForm((f) => ({ ...f, plate_number: e.target.value.toUpperCase() }))}
                  placeholder="01A123BC"
                  className="h-12 rounded-2xl"
                />
              </div>
              <div>
                <Label htmlFor="color" className="mb-1.5">
                  {t("Cars.Color")}
                </Label>
                <Input
                  id="color"
                  value={form.color}
                  onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                  placeholder={t("Cars.ColorPlaceholder")}
                  className="h-12 rounded-2xl"
                />
              </div>
              <div>
                <Label className="mb-1.5">{t("Cars.Seats")}</Label>
                <Select
                  value={String(form.seats_standard)}
                  onValueChange={(v) => setForm((f) => ({ ...f, seats_standard: Number(v) }))}
                >
                  <SelectTrigger className="h-12! w-full rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/*
              The documents are collected here to match the app's flow, but the
              current API creates the car from its fields only and takes the
              paperwork on the separate `/car/{id}/resubmit` step — so they are
              scanned locally and not uploaded yet.
            */}
            <p className="text-xs text-ink-muted">{t("Cars.VerificationNote")}</p>

            <ErrorNote message={error} />

            <Button
              type="submit"
              disabled={!ready || createCar.isPending || scanning}
              className="h-13 w-full rounded-full bg-brand-500 text-base font-semibold hover:bg-brand-600 disabled:bg-neutral-300 disabled:opacity-100"
            >
              {createCar.isPending ? <Loader2 className="size-5 animate-spin" /> : t("Cars.Submit")}
            </Button>
          </form>
        </Screen>
      </>
    );
  }

  return (
    <>
      <AppTopBar
        title={t("Cars.Title")}
        back="/profile"
        trailing={
          <Button
            size="icon"
            aria-label={t("Cars.Add")}
            onClick={() => setAdding(true)}
            className="ml-auto size-9 shrink-0 rounded-full bg-brand-500 hover:bg-brand-600"
          >
            <Plus className="size-5" />
          </Button>
        }
      />
      <Screen>
        {!cars || cars.length === 0 ? (
          <EmptyState
            illustration={ILLUSTRATION.noCar}
            title={t("Cars.Empty")}
            description={t("Cars.EmptyText")}
            action={
              <Button
                onClick={() => setAdding(true)}
                className="h-13 w-full rounded-full bg-brand-500 text-base font-semibold hover:bg-brand-600"
              >
                {t("Cars.Add")}
              </Button>
            }
          />
        ) : (
          <div className="flex w-full flex-col gap-3">
            {cars.map((car) => (
              <div key={car.id} className="app-card w-full p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-ink">
                      {car.make} {car.model} · {car.year}
                    </p>
                    <p className="mt-0.5 text-sm text-ink-muted">
                      {car.plate_number} · {car.color} · {t("Cars.SeatsCount", { count: car.seats_standard })}
                    </p>
                  </div>
                  <StatusBadge status={car.status} label={t(`CarStatus.${car.status}`)} />
                </div>

                {car.status === "REJECTED" && <p className="mt-2 text-xs text-danger">{t("Cars.Rejected")}</p>}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="outline" className="mt-3 rounded-full text-danger hover:text-danger">
                      <Trash2 className="size-4" />
                      {t("Delete")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-3xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("Cars.DeleteConfirm")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {car.make} {car.model} · {car.plate_number}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-full">{t("Cancel")}</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => void deleteCar.mutateAsync(car.id)}
                        className="rounded-full bg-danger hover:bg-danger/90"
                      >
                        {t("Delete")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
        )}
      </Screen>
    </>
  );
};

/** Dashed upload target, mirroring the document steps in the mobile flow. */
const Dropzone = ({
  label,
  hint,
  file,
  onFile,
}: {
  label: string;
  hint: string;
  file: File | null;
  onFile: (file: File | null) => void;
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="mt-3">
      <p className="mb-1.5 text-sm text-ink-muted">{label}</p>
      <label
        className={cn(
          "flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition",
          file ? "border-brand-400 bg-brand-50/50" : "border-neutral-300 bg-neutral-50 hover:border-brand-300"
        )}
      >
        <input
          type="file"
          accept="image/jpeg,image/png"
          className="hidden"
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-24 rounded-xl object-contain" />
        ) : (
          <>
            <Upload className="size-7 text-neutral-400" strokeWidth={1.6} />
            <span className="text-sm text-ink-muted">{hint}</span>
          </>
        )}
      </label>
    </div>
  );
};
