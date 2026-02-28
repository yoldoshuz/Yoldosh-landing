import { Metadata } from 'next';

const locales = ['ru', 'uz', 'en'];
const baseUrl = 'https://yoldosh.uz';

export function generatePageMetadata(
  locale: string,
  path: string,
  title: string,
  description?: string
): Metadata {
  // Убираем параметры запроса для чистого canonical
  const cleanPath = path.split('?')[0];

  // Создаем объект языковых альтернатив
  const languages: Record<string, string> = {};
  locales.forEach((l) => {
    // Внимание: если используешь localized pathnames (ru/о-нас, en/about-us),
    // здесь нужно мапить правильные пути для каждого языка.
    languages[l] = `${baseUrl}/${l}${cleanPath}`;
  });
  languages['x-default'] = `${baseUrl}/ru${cleanPath}`; // дефолтный язык

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}${cleanPath}`,
      languages,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  };
}