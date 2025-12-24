import { useTranslations } from "next-intl";

export const navLinks = () => {
  const t = useTranslations("Components.Header");

  const links = [
    {
      id: 1,
      title: t("Home"),
      href: "/",
    },
    {
      id: 2,
      title: t("About"),
      href: "/about-us",
    },
    {
      id: 3,
      title: t("Trips"),
      href: "/trips",
    },
  ];

  return links;
};

export const REGIONS = () => {
  const t = useTranslations("Components.Regions");

  const REGIONS = [
    { id: 1, name: t("Andijan") },
    { id: 2, name: t("Bukhara") },
    { id: 3, name: t("Jizzakh") },
    { id: 4, name: t("Qashqadarya") },
    { id: 5, name: t("Navoiy") },
    { id: 6, name: t("Namangan") },
    { id: 7, name: t("Samarkand") },
    { id: 8, name: t("Sirdarya") },
    { id: 9, name: t("TashkentCity") },
    { id: 10, name: t("Tashkent") },
    { id: 11, name: t("Fergana") },
    { id: 12, name: t("Khorezm") },
    { id: 13, name: t("Karakalpakstan") },
    { id: 14, name: t("Surkhandarya") },
  ];

  return REGIONS;
};
