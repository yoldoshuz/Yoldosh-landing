import Link from "next/link";
import Image from "next/image";

import { Separator } from "../ui/separator";
import { useTranslations } from "next-intl";

export const Footer = () => {
    const t = useTranslations("Components.Footer");
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-neutral-50">
            <div className="mx-auto w-full max-w-7xl p-4 text-muted-foreground py-6 lg:py-8">
                <div className="md:flex md:justify-between">
                    <div className="mb-6 md:mb-0 px-2 sm:px-4">
                        <Link href="/" className="flex flex-row gap-2 items-center">
                            <Image src="logo.svg" alt="logo" width={48} height={48} />
                            <h1 className="text-2xl font-bold">Yoldosh</h1>
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 px-2 sm:px-4">
                        <div>
                            <h2 className="mb-6 text-lg font-semibold text-black ">{t("Product.Title")}</h2>
                            <ul className="space-y-4 text-muted-foreground">
                                <li >
                                    <a href="https://flowbite.com/" className="hover:underline">{t("Product.1")}</a>
                                </li>
                                <li>
                                    <a href="https://tailwindcss.com/" className="hover:underline">{t("Product.2")}</a>
                                </li>
                                <li>
                                    <a href="https://tailwindcss.com/" className="hover:underline">{t("Product.3")}</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-lg font-semibold text-black">{t("Company.Title")}</h2>
                            <ul className="space-y-4 text-muted-foreground">
                                <li >
                                    <a href="https://github.com/themesberg/flowbite" className="hover:underline ">{t("Company.1")}</a>
                                </li>
                                <li>
                                    <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">{t("Company.2")}</a>
                                </li>
                                <li>
                                    <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">{t("Company.3")}</a>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h2 className="mb-6 text-lg font-semibold text-black">{t("Support.Title")}</h2>
                            <ul className="space-y-4 text-muted-foreground">
                                <li >
                                    <a href="#" className="hover:underline">{t("Support.1")}</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:underline">{t("Support.2")}</a>
                                </li>
                                <li>
                                    <a href="#" className="hover:underline">{t("Support.3")}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <Separator className="my-8" />
                <div className="flex items-center justify-center">
                    <span className="text-base text-center text-muted-foreground">
                        © {currentYear} "OOO" Milliy Yoldosh. {t("Rights")}
                    </span>
                </div>
            </div>
        </footer>
    );
};