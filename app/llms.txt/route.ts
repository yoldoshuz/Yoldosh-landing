export async function GET() {
    const content = `# Yoldosh - Carpooling Service for Uzbekistan

## About
Yoldosh is a modern, fast, and secure carpooling platform connecting drivers and passengers across Uzbekistan. We provide safe, affordable, and eco-friendly intercity transportation, serving as the modern alternative to traditional intercity taxis.

## Core Values & Mission
- Safety first: Verified drivers and transparent rating system.
- Affordability: Fair pricing without hidden fees.
- Accessibility: Fully localized in Uzbek, Russian, and English.

## Services
- Intercity carpooling and passenger transportation
- Real-time trip search with advanced filtering (date, price, seats)
- Verified driver profiles with vehicle details
- Secure booking and reservation system

## Coverage
We operate across all 12 regions of Uzbekistan, the Republic of Karakalpakstan, and Tashkent city. Popular routes include:
- Tashkent - Samarkand
- Tashkent - Bukhara
- Khiva - Bukhara
- Fergana Valley routes (Andijan, Namangan, Fergana)
- Nukus, Termez, Navoi, and all major destinations.

## Key Features
- Multi-language platform (uz, ru, en)
- Driver and passenger verification system
- Transparent pricing and flexible payment options
- Rating and review ecosystem for community trust
- 24/7 customer support

## Contact & Links
- Website: https://yoldosh.uz
- Support Email: support@yoldosh.uz
- Public API: https://api.yoldosh.uz/api/v1/api-docs/
- Terms of Service: https://yoldosh.uz/public-offer
- Privacy Policy: https://yoldosh.uz/privacy-policy
- Operator: "OOO Milliy Yoldosh"
`;

    return new Response(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, max-age=86400',
        },
    });
}