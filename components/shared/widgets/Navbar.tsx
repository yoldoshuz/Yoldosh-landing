"use client"

import Link from "next/link";
import Image from "next/image";

import { useTranslations } from "next-intl";

import { navLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/functional/LanguageSwitcher";

export const Navbar = () => {
  const t = useTranslations("Components.Header");
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 w-full z-20 border bg-neutral-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-5">
        <div className="flex justify-between items-center h-16">
          <div>
            <Link href="/" className="flex flex-row gap-2 items-center">
              <Image src="/assets/logo.svg" alt="logo" width={48} height={48} />
              <p className="text-2xl font-bold hidden md:flex">Yoldosh</p>
            </Link>
          </div>

          <nav className="hidden md:flex sm:space-x-6">
            {navLinks().map((link) => (
              <Link
                href={link.href}
                key={link.id}
                className={`px-3 py-2 text-sm hover:text-emerald-600 smooth ${pathname === link.href ? 'text-emerald-600' : null}`}
              >
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
