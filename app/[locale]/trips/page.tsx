import Script from 'next/script';

import { Suspense } from 'react';
import { PageProps } from '@/types';
import { getPageJsonLd } from '@/app/lib/jsonld';
import { getTranslations } from 'next-intl/server';
import { generatePageMetadata } from '@/app/lib/seo';

import { Loader2 } from 'lucide-react';
import { SearchPage } from '@/components/pages/trips/TripPage';

export async function generateMetadata({ params }: PageProps) {
  return generatePageMetadata((await params).locale, 'trips', '/trips');
};

export default async function Page({ params }: PageProps) {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: 'metadata.trips' });
  const { page, breadcrumb } = getPageJsonLd({
    locale,
    path: '/trips',
    type: 'SearchResultsPage',
    name: t('title'),
    description: t('description'),
  });

  return (
    <>
      <Script
        id="trips-page-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(page) }}
      />
      <Script
        id="trips-breadcrumb-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="size-8 animate-spin text-emerald-500" />
        </div>
      }>
        <SearchPage />
      </Suspense>
    </>
  );
};