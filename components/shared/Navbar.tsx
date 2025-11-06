import Link from "next/link";
import Image from "next/image";

import { LanguageSwitcher } from "@/app/providers/LanguageSwitcher";
import { navLinks } from "@/constants";
import { useTranslations } from "next-intl";
import { Button } from "../ui/button";

export const Navbar = () => {
  const t = useTranslations("Components.Header");

  return (
    <header className="fixed top-0 left-0 w-full z-10 border bg-neutral-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <Link href="/" className="flex flex-row gap-2 items-center">
              <Image src="logo.svg" alt="logo" width={48} height={48} />
              <h1 className="text-2xl font-bold">Yoldosh</h1>
            </Link>
          </div>

          <nav className="hidden md:flex sm:space-x-6">
            {navLinks().map((link) => (
              <Link
                href={link.href}
                key={link.id}
                className="px-3 py-2 text-sm hover:text-teal-600 smooth"
              >
                {link.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-center gap-2">
            <LanguageSwitcher />
            <div className="hidden md:flex">
              <Button className="btn-primary">
                {t("DownloadApp")}
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};