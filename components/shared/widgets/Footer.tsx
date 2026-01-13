import Image from "next/image";

import { Link } from '@/app/i18n/routing';
import { useTranslations } from "next-intl";

import { Separator } from "@/components/ui/separator";
import { Headset } from "lucide-react";

export const Footer = () => {
  const t = useTranslations("Components.Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0 px-2 sm:px-4">
            <Link href="/" className="flex flex-row gap-2 items-center">
              <Image src="/assets/logo.svg" alt="logo" draggable={false} width={48} height={48} />
              <p className="text-2xl font-bold text-neutral-800">Yo'ldosh</p>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:grid-cols-3 px-2 sm:px-4">
            <div>
              <h2 className="mb-6 text-lg font-semibold text-black">{t("Product.Title")}</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <Link href="/" className="hover:underline">
                    {t("Product.1")}
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    {t("Product.2")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-semibold text-black">{t("Company.Title")}</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <Link href="/about-us" className="hover:underline">
                    {t("Company.1")}
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    {t("Company.3")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-semibold text-black">{t("Support.Title")}</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <Link href="/" className="hover:underline">
                    {t("Support.2")}
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:underline">
                    {t("Support.3")}
                  </Link>
                </li>
                <li>
                  <Link href="/public-offer" className="hover:underline">
                    {t("Support.4")}
                  </Link>
                </li>
                <li className="text-base flex items-center gap-2 font-bold text-emerald-500">
                  <Headset />
                  <p>+998 94 000 12 58</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            © 2025 - {currentYear} "OOO" Milliy Yo'ldosh. {t("Rights")}
          </span>
        </div>
      </div>
    </footer>
  );
};
