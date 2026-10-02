import { useId } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolveMedia } from "@/lib/api";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  /** Only used for the image alt text; the fallback is always the glyph. */
  name?: string | null;
  className?: string;
  /**
   * Overrides the disc behind the silhouette — `text-*` sets its colour, e.g.
   * `text-white/25` for the translucent disc on the green profile header.
   */
  fallbackClassName?: string;
}

/**
 * Avatar with the app's standard placeholder.
 *
 * Initials were a poor fallback here: names arrive in three scripts, many
 * accounts are companies rather than people, and a lone Cyrillic letter on a
 * green disc read as a typo. The placeholder is the mobile build's
 * `person.png` — a solid white head and shoulders, cut off by the disc —
 * redrawn as a vector so it stays crisp from the 40px list row to the 112px
 * profile header.
 */
export const UserAvatar = ({ src, name, className, fallbackClassName }: UserAvatarProps) => (
  <Avatar className={cn("shrink-0", className)}>
    <AvatarImage src={resolveMedia(src)} alt={name ?? ""} />
    <AvatarFallback className={cn("bg-transparent text-[#41B06E]", fallbackClassName)}>
      <PersonGlyph />
    </AvatarFallback>
  </Avatar>
);

const PersonGlyph = () => {
  // One per avatar: a shared id resolves to whichever copy came first, and
  // that one may sit inside a hidden row.
  const clipId = useId();
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
      <defs>
        <clipPath id={clipId}>
          <circle cx="50" cy="50" r="50" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="50" fill="currentColor" />
      <g clipPath={`url(#${clipId})`} fill="white">
        <circle cx="50" cy="42" r="17" />
        <ellipse cx="50" cy="101" rx="28" ry="29" />
      </g>
    </svg>
  );
};
