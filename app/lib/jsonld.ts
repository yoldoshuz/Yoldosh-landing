type JsonLdOptions = {
    locale: string
    path: string
    type?: 'WebPage' | 'AboutPage' | 'SearchResultsPage' | 'LegalDocument'
    name: string
    description: string
};

const SITE_URL = 'https://yoldosh.uz';

export function getOrganizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Yoldosh",
        legalName: "OOO Milliy Yoldosh",
        url: SITE_URL,
        logo: `${SITE_URL}/assets/logo.svg`,
        foundingDate: "2025",
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: "support@yoldosh.uz",
            availableLanguage: ["ru", "uz", "en"]
        },
        sameAs: [
            "https://t.me/yoldosh_uz",
            "https://instagram.com/yoldosh_uz"
        ]
    };
};

export function getPageJsonLd({
    locale,
    path,
    type = 'WebPage',
    name,
    description
}: JsonLdOptions) {

    const url = `${SITE_URL}/${locale}${path}`;

    return {
        page: {
            "@context": "https://schema.org",
            "@type": type,
            name,
            description,
            url
        },

        breadcrumb: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name:
                        locale === 'ru' ? 'Главная'
                            : locale === 'uz' ? 'Bosh sahifa'
                                : 'Home',
                    item: `${SITE_URL}/${locale}`
                },
                ...(path
                    ? [{
                        "@type": "ListItem",
                        position: 2,
                        name,
                        item: url
                    }]
                    : [])
            ]
        }
    };
};