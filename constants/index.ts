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


export const tripItems = () => {
    const t = useTranslations("Pages.Popular");

    const items = [
        {
            id: 1,
            from: t("Tashkent"),
            to: t("Samarkand"),
            image: "/city.jpg",
            price: 150000,
            url: ""
        },
        {
            id: 2,
            from: t("Tashkent"),
            to: t("Andijan"),
            image: "/city.jpg",
            price: 170000,
            url: ""
        },
        {
            id: 3,
            from: t("Tashkent"),
            to: t("Bukhara"),
            image: "/city.jpg",
            price: 200000,
            url: ""
        },
        {
            id: 4,
            from: t("Tashkent"),
            to: t("Nukus"),
            image: "/city.jpg",
            price: 250000,
            url: ""
        },
        {
            id: 5,
            from: t("Tashkent"),
            to: t("Navoiy"),
            image: "/city.jpg",
            price: 150000,
            url: ""
        },
    ]
    
    return items;
}