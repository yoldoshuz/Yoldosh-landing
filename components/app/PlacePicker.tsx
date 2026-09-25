"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, Clock, Crosshair, Loader2, Search, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { ErrorNote } from "@/components/app/kit";
import {
  currentPosition,
  fetchPlaceSuggestions,
  getRecentPlaces,
  rememberPlace,
  reverseGeocode,
  type Place,
  type PlaceSuggestion,
} from "@/lib/places";

const DEBOUNCE_MS = 300;

/**
 * Full-screen place search, the way the mobile build does it.
 *
 * A dropdown under an inline input was the wrong shape on a phone: the
 * keyboard covers it, and a long list of streets has nowhere to go. This takes
 * the whole screen instead — search field in the green bar, results filling
 * everything below, recent picks when the field is empty.
 */
export const PlacePicker = ({
  open,
  title,
  initialValue,
  onPick,
  onClose,
}: {
  open: boolean;
  title: string;
  initialValue?: string;
  onPick: (place: Place) => void;
  onClose: () => void;
}) => {
  const t = useTranslations("App.Search");

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [recents, setRecents] = useState<Place[]>([]);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setSuggestions([]);
    setError(null);
    setRecents(getRecentPlaces());
    // The whole point of the screen is typing, so start there.
    const id = setTimeout(() => inputRef.current?.focus(), 120);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const id = setTimeout(() => {
      void fetchPlaceSuggestions(query)
        .then((next) => !cancelled && setSuggestions(next))
        .catch(() => !cancelled && setSuggestions([]));
    }, DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [query, open]);

  if (!open) return null;

  const choose = (place: Place) => {
    rememberPlace(place);
    onPick(place);
    onClose();
  };

  const locateMe = async () => {
    setError(null);
    setLocating(true);
    try {
      const position = await currentPosition();
      choose(await reverseGeocode(position.coords.latitude, position.coords.longitude));
    } catch {
      setError(t("LocationFailed"));
    } finally {
      setLocating(false);
    }
  };

  return (
    // Above the tab bar and the sheets: while this is open it *is* the screen.
    <div className="fixed inset-0 z-[60] flex flex-col bg-app-bg">
      <div className="app-topbar shrink-0 px-4 py-3">
        <div className="mx-auto flex w-full max-w-2xl items-center gap-2 lg:max-w-5xl">
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Back")}
            className="-ml-2 shrink-0 cursor-pointer rounded-full p-2 text-white transition hover:bg-white/15 lg:text-ink lg:hover:bg-neutral-200/60"
          >
            <ArrowLeft className="size-5" />
          </button>

          <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-white px-4 shadow-sm">
            <Search className="size-5 shrink-0 text-neutral-400" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={initialValue || title}
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-neutral-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t("Clear")}
                className="shrink-0 cursor-pointer text-neutral-400 transition hover:text-ink"
              >
                <X className="size-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl lg:max-w-5xl">
          <button
            type="button"
            onClick={() => void locateMe()}
            disabled={locating}
            className="flex w-full cursor-pointer items-center gap-4 bg-white px-4 py-4 text-left transition hover:bg-neutral-50"
          >
            {locating ? (
              <Loader2 className="size-5 shrink-0 animate-spin text-brand-500" />
            ) : (
              <Crosshair className="size-5 shrink-0 text-ink" />
            )}
            <span className="min-w-0 flex-1 text-[17px] font-bold text-ink">{t("UseMyLocation")}</span>
            <ChevronRight className="size-5 shrink-0 text-ink-muted" />
          </button>

          <ErrorNote message={error} />

          {(query.trim() ? suggestions : recents).map((item, index) => (
            <button
              key={`${item.name}-${index}`}
              type="button"
              onClick={() =>
                void ("resolve" in item ? (item as PlaceSuggestion).resolve() : Promise.resolve(item)).then(choose)
              }
              className="flex w-full cursor-pointer items-center gap-4 border-t border-neutral-100 px-4 py-4 text-left transition hover:bg-neutral-50"
            >
              {/* Recents keep the clock; live results stand on their own. */}
              {!query.trim() && <Clock className="size-5 shrink-0 text-neutral-400" />}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[17px] text-ink">{item.name}</span>
                {item.detail && <span className="mt-0.5 block truncate text-sm text-ink-muted">{item.detail}</span>}
              </span>
              <ChevronRight className="size-5 shrink-0 text-ink-muted" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
