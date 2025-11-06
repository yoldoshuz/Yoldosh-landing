import { useTranslations } from "next-intl"

export const navLinks = () => {
    const t = useTranslations("Components.Header");

    const links = [
        {
            id: 1,
            title: t("Features"),
            href: "#features",
        },
        {
            id: 2,
            title: t("HowItWorks"),
            href: "#howItWorks",
        },
        {
            id: 3,
            title: t("Contacts"),
            href: "#contacts",
        },
    ]

    return links;
}
