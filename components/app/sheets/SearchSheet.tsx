"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

import { AppIcon } from "@/components/app/AppIcon";
import { isSearchReady, SearchFields, type SearchValue } from "@/components/app/SearchFields";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";

/**
 * "Поиск поездки" dropping from the top of the results, opened by tapping the
 * route summary — the mobile build's way of changing a search without going
 * back to the home screen. Edits a draft, so closing it leaves the results
 * exactly as they were.
 */
export const SearchSheet = ({
  open,
  value,
  onClose,
  onSubmit,
}: {
  open: boolean;
  value: SearchValue;
  onClose: () => void;
  onSubmit: (next: SearchValue) => void;
}) => {
  const t = useTranslations("App.Search");
  const [draft, setDraft] = useState(value);

  // Start from what is on screen every time it opens.
  useEffect(() => {
    if (open) setDraft(value);
  }, [open, value]);

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent
        side="top"
        showCloseButton={false}
        // No transform for the desktop centring: the place and date pickers
        // inside are `position: fixed`, and a transformed ancestor would trap
        // them inside this panel instead of the screen.
        className="gap-0 rounded-b-[26px] border-0 p-0 lg:top-6 lg:mx-auto lg:w-full lg:max-w-xl lg:rounded-[26px]"
      >
        <div data-app-topbar>
          <div className="mx-auto w-full max-w-2xl px-4 pb-6">
            <div className="flex items-center gap-2 py-3">
              <button
                type="button"
                onClick={onClose}
                aria-label={t("Close")}
                className="-ml-2 shrink-0 cursor-pointer rounded-full p-2 text-ink transition hover:bg-neutral-100"
              >
                <AppIcon name="close" className="size-5" />
              </button>
              <SheetTitle className="min-w-0 flex-1 truncate text-center text-xl font-bold text-ink">
                {t("ResultsTitle")}
              </SheetTitle>
              <span aria-hidden className="w-7 shrink-0" />
            </div>
            <SheetDescription className="sr-only">{t("Subtitle")}</SheetDescription>

            <SearchFields value={draft} onChange={setDraft} />

            <Button
              onClick={() => {
                if (!isSearchReady(draft)) return;
                onSubmit(draft);
                onClose();
              }}
              disabled={!isSearchReady(draft)}
              className="mt-6 h-13 w-full rounded-full bg-brand-500 text-base font-semibold hover:bg-brand-600 disabled:bg-neutral-200 disabled:text-ink-muted disabled:opacity-100"
            >
              {t("Submit")}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
