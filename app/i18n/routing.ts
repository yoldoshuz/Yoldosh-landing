import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'ru', 'uz'],
  defaultLocale: 'ru',
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/trips': {
      en: '/trips',
      ru: '/поездки',
      uz: '/safarlar'
    },
    '/trips/passengers/[passengerId]': {
      en: '/trips/passengers/[passengerId]',
      ru: '/поездки/пассажиры/[passengerId]',
      uz: '/safarlar/yolovchilar/[passengerId]'
    },
    '/trips/[tripId]': {
      en: '/trips/[tripId]',
      ru: '/поездки/[tripId]',
      uz: '/safarlar/[tripId]'
    },
    '/about-us': {
      en: '/about-us',
      ru: '/о-нас',
      uz: '/biz-haqimizda'
    },
    '/public-offer': {
      en: '/public-offer',
      ru: '/публичная-офферта',
      uz: '/ommaviy-taklif'
    }
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);