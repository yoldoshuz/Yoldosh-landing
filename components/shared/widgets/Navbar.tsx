"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from '@/app/i18n/routing';
import { useTranslations } from "next-intl";
import { useNavIndicator } from "@/hooks/useNavIndicator";

import { navLinks } from "@/constants";
import { CloudDownload } from "lucide-react";
import { Button } from "@/components/ui/button";

const Menu = dynamic(() => import("./Menu").then((mod) => mod.Menu), { ssr: false });
const LanguageSwitcher = dynamic(
  () => import("@/components/functional/LanguageSwitcher").then((mod) => mod.LanguageSwitcher),
  {
    ssr: false
  });

export const Navbar = () => {
  const t = useTranslations("Components.Header");
  const pathname = usePathname();

  const containerRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [isScrolled, setIsScrolled] = useState(false);
  const scrollThreshold = 10;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const baseClasses = 'fixed top-0 left-0 w-full z-50 smooth';
  const defaultStateClasses = 'bg-white border-transparent';
  const scrolledStateClasses = 'bg-white/80 backdrop-blur-xl shadow-lg';


  useNavIndicator({
    pathname,
    containerRef,
    linkRefs,
    setIndicator,
  });

  return (
    <header
      className={`${baseClasses} ${isScrolled ? scrolledStateClasses : defaultStateClasses
        }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-5">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-row gap-2 items-center">
            <Image
              src="/assets/logo.svg"
              alt="logo"
              draggable={false}
              width={48}
              height={48}
            />
            <p className="text-2xl font-bold hidden lg:flex text-neutral-800">Yo'ldosh</p>
          </Link>

          {/* NAV LINKS */}
          <div
            ref={containerRef}
            className="hidden md:flex gap-2 relative"
          >
            {/* INDICATOR */}
            <motion.div
              className="absolute rounded-lg bg-emerald-200/60 pointer-events-none"
              animate={{
                x: indicator.x,
                y: indicator.y,
                width: indicator.width,
                height: indicator.height,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 35,
              }}
            />

            {navLinks().map((link) => {
              const isActive = link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(link.href + "/");

              return (
                <Link
                  key={link.id}
                  href={link.href as any}
                  ref={(el) => {
                    linkRefs.current[link.href] = el;
                  }}
                  className={`flex items-center justify-center gap-2 relative px-4 py-2 text-base font-medium z-10
                  ${isActive ? "text-emerald-800" : "text-neutral-700"}
                  `}
                >
                  <link.icon className="size-4" strokeWidth={3} />
                  {link.title}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex">
              <LanguageSwitcher />
            </div>
            <Button className="btn-glow">
              <CloudDownload />
              {t("DownloadApp")}
            </Button>
            <div className="flex md:hidden">
              <Menu />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};