"use client";

import { useTranslations } from "next-intl";

import { AppSheet } from "@/components/app/AppSheet";
import { PrivacyPolicy } from "@/components/pages/privacy-policy/page";
import { PublicOffer } from "@/components/pages/public-offer/PublicOffer";

export type LegalDocument = "offer" | "privacy";

/**
 * Shows a legal document without leaving the app.
 *
 * Both texts already exist as landing pages, but inside the mini app the
 * landing is out of reach — following the link dropped the user onto a
 * marketing shell (or nothing at all). The same component is reused here so
 * there is one copy of the text, wrapped in the app's own sheet.
 */
export const LegalSheet = ({ document, onClose }: { document: LegalDocument | null; onClose: () => void }) => {
  const t = useTranslations("App.Settings");

  if (!document) return null;

  return (
    <AppSheet
      open
      onOpenChange={(open) => !open && onClose()}
      title={t(document === "offer" ? "PublicOffer" : "PrivacyPolicy")}
      className="lg:max-w-3xl"
    >
      {/* The documents carry their own page padding, which would double up. */}
      <div className="pb-8 [&_article]:bg-transparent [&_article]:px-0 [&_article]:py-0">
        {document === "offer" ? <PublicOffer /> : <PrivacyPolicy />}
      </div>
    </AppSheet>
  );
};
