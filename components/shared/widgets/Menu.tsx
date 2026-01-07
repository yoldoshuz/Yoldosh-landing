import Link from "next/link";
import Image from "next/image";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useNavIndicator } from "@/hooks/useNavIndicator";

import { motion } from "framer-motion";
import { navLinks } from "@/constants";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/functional/LanguageSwitcher";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

export const Menu = () => {
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

    useNavIndicator({
        pathname,
        containerRef,
        linkRefs,
        setIndicator,
    });

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost">
                    <MenuIcon className="size-6" strokeWidth={2.25} />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>
                        <Link href="/" className="flex flex-row gap-2 items-center">
                            <Image
                                src="/assets/logo.svg"
                                alt="logo"
                                draggable={false}
                                width={28}
                                height={28}
                            />
                            <p className="text-lg font-bold">Yoldosh</p>
                        </Link>
                    </SheetTitle>
                    <SheetDescription></SheetDescription>
                </SheetHeader>
                <div
                    ref={containerRef}
                    className="flex flex-col gap-2 relative"
                >
                    {/* INDICATOR */}
                    <motion.div
                        className="absolute bg-emerald-200/60 pointer-events-none"
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
                        const isActive = pathname === link.href;

                        return (
                            <Link
                                key={link.id}
                                href={link.href}
                                ref={(el) => {
                                    linkRefs.current[link.href] = el;
                                }}
                                className={`flex items-center justify-start gap-2 relative px-4 py-2 text-base font-medium z-10
                                ${isActive ? "text-emerald-800" : "text-neutral-700"}
                                `}
                            >
                                <link.icon className="size-4" strokeWidth={3} />
                                {link.title}
                            </Link>
                        );
                    })}
                </div>
                <SheetFooter>
                    <LanguageSwitcher />
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};
