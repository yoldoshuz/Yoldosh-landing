import { Home, Route, Users } from "lucide-react";
import { useTranslations } from "next-intl";

export const navLinks = () => {
  const t = useTranslations("Components.Header");

  const links = [
    {
      id: 1,
      title: t("Home"),
      href: "/",
      icon: Home,
    },
    {
      id: 2,
      title: t("About"),
      href: "/about-us",
      icon: Users,
    },
    {
      id: 3,
      title: t("Trips"),
      href: "/trips",
      icon: Route
    },
  ];

  return links;
};

export const ourStats = () => {
  const t = useTranslations("Pages.About");

  const stats = [
    {
      id: 1,
      title: t("stats.0.title"),
      description: t("stats.0.description")
    },
    {
      id: 2,
      title: t("stats.1.title"),
      description: t("stats.1.description")
    },
    {
      id: 3,
      title: t("stats.2.title"),
      description: t("stats.2.description")
    },
    {
      id: 4,
      title: t("stats.3.title"),
      description: t("stats.3.description")
    },
    {
      id: 5,
      title: t("stats.4.title"),
      description: t("stats.4.description")
    },
    {
      id: 6,
      title: t("stats.5.title"),
      description: t("stats.5.description")
    }
  ];

  return stats;
};

export const cardsItem = () => {
  const t = useTranslations("Pages.About");

  const cards = [
    {
      id: 1,
      title: t("cards.0.title"),
      description: t("cards.0.description")
    },
    {
      id: 2,
      title: t("cards.1.title"),
      description: t("cards.1.description")
    },
    {
      id: 3,
      title: t("cards.2.title"),
      description: t("cards.2.description")
    },
    {
      id: 4,
      title: t("cards.3.title"),
      description: t("cards.3.description")
    },
    {
      id: 5,
      title: t("cards.4.title"),
      description: t("cards.4.description")
    },
    {
      id: 6,
      title: t("cards.5.title"),
      description: t("cards.5.description")
    }
  ];

  return cards;
};