export type Locale = (typeof locales)[number];

export const locales = ["en", "ru", "uz"] as const;
export const defaultLocale: Locale = "ru";