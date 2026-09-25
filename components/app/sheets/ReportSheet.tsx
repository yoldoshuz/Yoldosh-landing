"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { AppSheet } from "@/components/app/AppSheet";
import { ErrorNote, SuccessNote } from "@/components/app/kit";
import { Textarea } from "@/components/ui/textarea";
import { useReportTrip } from "@/hooks/api/useAppTrips";
import { apiErrorMessage } from "@/lib/api";

/**
 * "Пожаловаться на поездку" as a sheet.
 *
 * It was an alert dialog, which is the wrong control twice over: a modal
 * alert is for confirming something destructive, and writing a paragraph in
 * one on a phone leaves the textarea fighting the keyboard for space.
 */
export const ReportSheet = ({ tripId, open, onClose }: { tripId: string; open: boolean; onClose: () => void }) => {
  const t = useTranslations("App");
  const report = useReportTrip();

  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (!open) return;
    setText("");
    setError(null);
    setSent(false);
  }, [open]);

  const submit = async () => {
    setError(null);
    try {
      await report.mutateAsync({ tripId, reason: "OTHER", description: text.trim() });
      setSent(true);
      // Long enough to read the confirmation, short enough not to feel stuck.
      setTimeout(onClose, 1400);
    } catch (e) {
      setError(apiErrorMessage(e, t("Errors.Generic")));
    }
  };

  return (
    <AppSheet
      open={open}
      onOpenChange={(next) => !next && onClose()}
      title={t("Trip.ReportTitle")}
      description={t("Trip.ReportSubtitle")}
      showDescription
      submitLabel={t("Send")}
      onSubmit={() => void submit()}
      submitDisabled={!text.trim() || sent}
      submitting={report.isPending}
    >
      <div className="space-y-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("Trip.ReportPlaceholder")}
          maxLength={500}
          className="min-h-36 resize-none rounded-2xl border-0 bg-neutral-100 px-4 py-3.5 text-base shadow-none focus-visible:ring-0"
        />
        <ErrorNote message={error} />
        <SuccessNote message={sent ? t("Trip.ReportSent") : null} />
      </div>
    </AppSheet>
  );
};
