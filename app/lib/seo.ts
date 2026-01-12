import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

export async function generatePageMetadata(
  locale: string,
  namespace: string,
  path: string
): Promise<Metadata> {

  const t = await getTranslations({
    locale,
    namespace: `metadata.${namespace}`
  })

  return {
    title: t('title'),
    description: t('description'),
    keywords: t.raw('keywords'),

    openGraph: {
      title: t('og.title'),
      description: t('og.description'),
      images: [{ url: t('og.image'), width: 1200, height: 630 }],
      locale:
        locale === 'ru' ? 'ru_RU'
        : locale === 'uz' ? 'uz_UZ'
        : 'en_US',
      type: 'website'
    },

    alternates: {
      canonical: `https://yoldosh.uz/${locale}${path}`,
      languages: {
        ru: `https://yoldosh.uz/ru${path}`,
        en: `https://yoldosh.uz/en${path}`,
        uz: `https://yoldosh.uz/uz${path}`
      }
    }
  }
}
