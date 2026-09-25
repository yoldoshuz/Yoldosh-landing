"use client";

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AppSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Read by screen readers only unless `showDescription` is set. */
  description?: string;
  showDescription?: boolean;
  children?: ReactNode;
  /** Renders the green primary button; omit for a sheet that only informs. */
  submitLabel?: string;
  onSubmit?: () => void;
  submitDisabled?: boolean;
  submitting?: boolean;
  className?: string;
}

/**
 * The app's bottom sheet: grab handle, bold title, content, one green action.
 *
 * Every "fill in one field" step in the mobile build is this shape — the
 * checklist on the profile, the ride report, the legal documents — so the
 * chrome lives here and callers supply only the body.
 */
export const AppSheet = ({
  open,
  onOpenChange,
  title,
  description,
  showDescription,
  children,
  submitLabel,
  onSubmit,
  submitDisabled,
  submitting,
  className,
}: AppSheetProps) => (
  <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent
      side="bottom"
      showCloseButton={false}
      className={cn(
        // Capped rather than sized: a one-field sheet stays short, a long one
        // scrolls inside itself instead of pushing the action off-screen.
        "gap-0 rounded-t-[26px] border-0 p-0 max-h-[88dvh]",
        // Desktop has no bottom edge to rise from — centre it as a dialog.
        "lg:inset-x-auto lg:bottom-auto lg:left-1/2 lg:top-1/2 lg:w-full lg:max-w-lg lg:-translate-x-1/2 lg:-translate-y-1/2 lg:rounded-[26px]",
        className
      )}
    >
      <div className="flex max-h-[88dvh] flex-col">
        <div className="shrink-0 pt-3">
          <span aria-hidden className="mx-auto block h-1 w-10 rounded-full bg-neutral-300 lg:hidden" />
        </div>

        <div className="shrink-0 px-6 pb-4 pt-4">
          <SheetTitle className="text-[22px] font-bold leading-tight text-ink">{title}</SheetTitle>
          {description ? (
            <SheetDescription className={cn("mt-1.5 text-sm text-ink-muted", !showDescription && "sr-only")}>
              {description}
            </SheetDescription>
          ) : (
            // Radix warns when a dialog has no description; the title says it all.
            <SheetDescription className="sr-only">{title}</SheetDescription>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6">{children}</div>

        {submitLabel && (
          <div className="shrink-0 px-6 pb-7 pt-5 safe-bottom">
            <Button
              type="button"
              onClick={onSubmit}
              disabled={submitDisabled || submitting}
              className="h-14 w-full rounded-2xl bg-brand-500 text-base font-semibold hover:bg-brand-600 disabled:bg-neutral-200 disabled:text-ink-muted disabled:opacity-100"
            >
              {submitting ? <Loader2 className="size-5 animate-spin" /> : submitLabel}
            </Button>
          </div>
        )}
      </div>
    </SheetContent>
  </Sheet>
);
