import { useTranslations } from "next-intl"

export const navLinks = () => {
    const t = useTranslations("Components.Header");

    const links = [
        {
            id: 1,
            title: t("About"),
            href: "/about",
        },
        {
            id: 2,
            title: t("Trips"),
            href: "/trips",
        },
    ]

    return links;
}

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