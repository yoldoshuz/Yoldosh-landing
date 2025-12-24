import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "@/components/functional/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/constants";

export const Navbar = () => {
  const t = useTranslations("Components.Header");

  return (
    <header className="fixed top-0 left-0 w-full z-20 border bg-neutral-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-5">
        <div className="flex justify-between items-center h-16">
          <div>
            <Link href="/" className="flex flex-row gap-2 items-center">
              <Image src="/assets/logo.svg" alt="logo" width={48} height={48} />
              <h1 className="text-2xl font-bold hidden md:flex">Yoldosh</h1>
            </Link>
          </div>

          <nav className="hidden md:flex sm:space-x-6">
            {navLinks().map((link) => (
              <Link href={link.href} key={link.id} className="px-3 py-2 text-sm hover:text-emerald-600 smooth">
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-center gap-2">
            <LanguageSwitcher />
            <div>
              <Button className="btn-primary">{t("DownloadApp")}</Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
