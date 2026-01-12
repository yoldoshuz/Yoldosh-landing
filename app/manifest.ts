import { MetadataRoute } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from './i18n/routing'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
    const t = await getTranslations({
        locale: routing.defaultLocale,
        namespace: 'manifest'
    })

    return {
        name: t('name'),
        short_name: t('shortName'),
        description: t('description'),
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#10b981',
        icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
    }
}
