import Image from "next/image";
import { Headset, Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/app/i18n/routing";
import { Separator } from "@/components/ui/separator";

const TelegramIcon = () => (
  <svg
    role="img"
    aria-label="Telegram"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const FacebookIcon = () => (
  <svg
    role="img"
    aria-label="Facebook"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073c0 6.019 4.388 10.997 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.313 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.955.925-1.955 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.07 24 18.092 24 12.073z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg
    role="img"
    aria-label="YouTube"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M23.5 6.203a2.955 2.955 0 0 0-2.078-2.09C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.422.613A2.955 2.955 0 0 0 .5 6.203 30.12 30.12 0 0 0 0 12a30.12 30.12 0 0 0 .5 5.797 2.955 2.955 0 0 0 2.078 2.09C4.5 20.5 12 20.5 12 20.5s7.5 0 9.422-.613a2.955 2.955 0 0 0 2.078-2.09A30.12 30.12 0 0 0 24 12a30.12 30.12 0 0 0-.5-5.797zM9.75 15.568V8.432L15.818 12 9.75 15.568z" />
  </svg>
);


export const Footer = () => {
  const t = useTranslations("Components.Footer");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-50" aria-label="Site footer">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          {/* Brand + Socials */}
          <div className="mb-6 md:mb-0 px-2 sm:px-4">
            <Link
              href="/"
              className="flex flex-row gap-2 items-center"
              aria-label="Yoldosh — home"
            >
              <Image
                src="/assets/logo.svg"
                alt="Yoldosh logo"
                draggable={false}
                width={48}
                height={48}
              />
              <p className="text-2xl font-bold text-neutral-800">
                Yo'ldosh
              </p>
            </Link>

            {/* Social Links */}
            <div
              className="flex items-center gap-3 mt-4"
              aria-label="Social media links"
            >
              <a
                href="https://t.me/yoldosh"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Yoldosh on Telegram"
                className="text-muted-foreground hover:text-emerald-500 transition-colors"
              >
                <TelegramIcon />
              </a>

              <a
                href="https://www.facebook.com/people/Yoldosh/61587373291432"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Yoldosh on Facebook"
                className="text-muted-foreground hover:text-emerald-500 transition-colors"
              >
                <FacebookIcon />
              </a>

              <a
                href="https://www.youtube.com/@Yoldosh_uzbekistan"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Yoldosh on YouTube"
                className="text-muted-foreground hover:text-emerald-500 transition-colors"
              >
                <YouTubeIcon />
              </a>
            </div>

            {/* Contact information */}
            <div
              className="flex flex-col items-start gap-2 mt-6 text-sm"
              aria-label="Contact information"
            >
              <li className="flex items-center gap-2 font-bold text-emerald-500">
                <Headset aria-hidden="true" className="size-5" />
                <a href="tel:+998940001258" aria-label="Call support: +998 94 000 12 58">
                  +998 94 000 12 58
                </a>
              </li>
              <li className="flex items-center gap-2 font-bold text-emerald-500">
                <Mail aria-hidden="true" className="size-5" />
                <a href="mailto:support@yoldosh.uz" aria-label="Call support: +998 94 000 12 58">
                  support@yoldosh.uz
                </a>
              </li>
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 lg:grid-cols-3 px-2 sm:px-4">
            <div>
              <h2 className="mb-6 text-lg font-semibold text-neutral-800">{t("Product.Title")}</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <Link href="/for-passengers" className="hover:underline">
                    {t("Product.1")}
                  </Link>
                </li>
                <li>
                  <Link href="/for-drivers" className="hover:underline">
                    {t("Product.2")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-semibold text-neutral-800">{t("Company.Title")}</h2>
              <ul className="space-y-4 text-muted-foreground">
                <li>
                  <Link href="/about-us" className="hover:underline">
                    {t("Company.1")}
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:underline">
                    {t("Company.3")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-lg font-semibold text-neutral-800">{t("Support.Title")}</h2>
              <ul className="space-y-4 text-muted-foreground">
                {/* <li>
                  <Link href="/" className="hover:underline">
                    {t("Support.2")}
                  </Link>
                </li> */}
                <li>
                  <Link href="/privacy-policy" className="hover:underline">
                    {t("Support.3")}
                  </Link>
                </li>
                <li>
                  <Link href="/public-offer" className="hover:underline">
                    {t("Support.4")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Separator className="my-8" />
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            © 2025–{currentYear} "OOO" Milliy Yo'ldosh. {t("Rights")}
          </span>
        </div>
      </div>
    </footer>
  );
};
