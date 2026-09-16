import { User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { resolveMedia } from "@/lib/api";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  src?: string | null;
  /** Only used for the image alt text; the fallback is always the glyph. */
  name?: string | null;
  className?: string;
  /** Overrides the fallback circle, e.g. a translucent fill on a green bar. */
  fallbackClassName?: string;
}

/**
 * Avatar with the app's standard placeholder.
 *
 * Initials were a poor fallback here: names arrive in three scripts, many
 * accounts are companies rather than people, and a lone Cyrillic letter on a
 * green disc read as a typo. The person glyph is what the mobile build shows,
 * and it stays legible whatever the name is. Sized as a share of the avatar so
 * one component covers every call site from 32px to 112px.
 */
export const UserAvatar = ({ src, name, className, fallbackClassName }: UserAvatarProps) => (
  <Avatar className={cn("shrink-0", className)}>
    <AvatarImage src={resolveMedia(src)} alt={name ?? ""} />
    <AvatarFallback className={cn("bg-brand-400 text-white", fallbackClassName)}>
      <User className="size-[58%]" strokeWidth={2} absoluteStrokeWidth={false} />
    </AvatarFallback>
  </Avatar>
);
