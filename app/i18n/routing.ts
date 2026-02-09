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
    '/trips/driver/[driverId]': {
      en: '/trips/driver/[driverId]',
      ru: '/поездки/водитель/[driverId]',
      uz: '/safarlar/haydovchi/[driverId]'
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
    },
    '/privacy-policy': {
      en: '/privacy-policy',
      ru: '/политика-конфиденциальности',
      uz: '/maxfiylik-siyosati'
    },
    '/delete-account': {
      en: '/delete-account',
      ru: '/удалить-аккаунт',
      uz: '/hisobni-ochirish'
    }
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);