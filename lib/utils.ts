import { twMerge } from "tailwind-merge"
import { getLocale } from "next-intl/server"
import { clsx, type ClassValue } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}