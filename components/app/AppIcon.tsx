import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * Every icon the mobile build ships, by its file name in
 * `public/assets/svg/icons`. Kept as a literal union so a typo is a type error
 * rather than an empty square on someone's phone.
 */
export type AppIconName =
  | "add_ic_square"
  | "airconditioner_icon"
  | "arrow_down"
  | "arrow_left"
  | "arrow_right"
  | "calendar"
  | "camera"
  | "camera_reverse"
  | "cancel"
  | "cash_icon"
  | "chat"
  | "close"
  | "completed"
  | "conditioner"
  | "copy_ic"
  | "dark"
  | "discount"
  | "door"
  | "edit"
  | "edit_icon"
  | "edit_square"
  | "empty_star_ic"
  | "english"
  | "fast_book"
  | "fill_star_ic"
  | "filter"
  | "food"
  | "from"
  | "get_bill_icon"
  | "group"
  | "half_star_ic"
  | "heart"
  | "ic_add"
  | "ic_back"
  | "ic_calendar"
  | "ic_choose_color"
  | "ic_location_green"
  | "ic_location_red"
  | "ic_money"
  | "ic_reload_green"
  | "ic_small_car"
  | "ic_time_circle"
  | "ic_upload"
  | "ic_uploaded_doc"
  | "in_progress"
  | "language"
  | "light"
  | "location"
  | "location_iconG"
  | "location_iconR"
  | "lock"
  | "logout"
  | "minus_ic_square"
  | "more_pessengers"
  | "music_icon"
  | "notification"
  | "pets_icon"
  | "phone_icon"
  | "privacy_conf_ic"
  | "promocode_ic"
  | "public_offer_ic"
  | "refresh_in_ic"
  | "report_icon"
  | "right2"
  | "russian"
  | "save_time"
  | "scan"
  | "search"
  | "send"
  | "setting"
  | "share_icon"
  | "shield"
  | "smoke"
  | "smoking_icon"
  | "star"
  | "suitcase"
  | "swap"
  | "talkative"
  | "to"
  | "uz_flag_icon"
  | "vector"
  | "verified"
  | "wallet";

/**
 * Icons whose colours are the point — flags, the green/red pins, the blue
 * badge, the orange stars. Flattened to one colour they would read as blobs,
 * so these are drawn as pictures and ignore `currentColor`.
 */
const MULTICOLOR = new Set<AppIconName>([
  "english",
  "russian",
  "uz_flag_icon",
  "location_iconG",
  "location_iconR",
  "ic_location_green",
  "ic_location_red",
  "from",
  "to",
  "verified",
  "fill_star_ic",
  "empty_star_ic",
  "half_star_ic",
  "edit_square",
]);

const src = (name: AppIconName) => `/assets/svg/icons/${name}.svg`;

interface AppIconProps {
  name: AppIconName;
  /** Size with `size-*`, colour with `text-*` — the same way a lucide icon took them. */
  className?: string;
  style?: CSSProperties;
  /** Screen-reader name; without one the icon is decorative and hidden. */
  label?: string;
}

/**
 * An icon from the mobile build.
 *
 * The SVGs are exported with their colours baked in (#41B06E, #212121,
 * #9E9E9E…), which would pin every icon to whatever the app happened to use
 * on that screen. Drawing the file as a CSS mask over `currentColor` keeps the
 * artwork exactly as designed while letting the surrounding text colour paint
 * it — green on the active tab, white on the green bar, red for a "no".
 */
export const AppIcon = ({ name, className, style, label }: AppIconProps) => {
  const a11y = label ? { role: "img", "aria-label": label } : { "aria-hidden": true };

  if (MULTICOLOR.has(name)) {
    return (
      <span
        {...a11y}
        className={cn("inline-block size-5 shrink-0 bg-contain bg-center bg-no-repeat", className)}
        style={{ backgroundImage: `url(${src(name)})`, ...style }}
      />
    );
  }

  const mask = `url(${src(name)}) center / contain no-repeat`;
  return (
    <span
      {...a11y}
      className={cn("inline-block size-5 shrink-0 bg-current", className)}
      style={{ mask, WebkitMask: mask, ...style }}
    />
  );
};
