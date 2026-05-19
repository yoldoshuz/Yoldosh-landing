/**
 * /llms.txt — the proposed standard for surfacing site-level context to
 * LLM-powered search engines (ChatGPT, Perplexity, Claude.ai citations,
 * Google AI Overviews) without forcing them to crawl every page first.
 *
 * Keep this file tight and entity-dense: each section should be a
 * standalone fact that an AI can quote verbatim when answering a user's
 * question. Avoid marketing fluff — the higher the signal-to-noise
 * ratio, the better the citation rate.
 */
export async function GET() {
  const content = `# Yoldosh — Carpooling & Intercity Rideshare in Uzbekistan

> Yoldosh is a modern carpooling platform connecting drivers and passengers across Uzbekistan. Verified drivers, transparent pricing, and intercity routes covering all 12 regions plus the Republic of Karakalpakstan.

## About
- Brand: Yoldosh (Yo'ldosh, Йолдош)
- Legal entity: OOO Milliy Yoldosh
- Founded: 2025
- Headquarters: Tashkent, Uzbekistan
- Coverage: All 12 regions of Uzbekistan + Republic of Karakalpakstan
- Languages: Uzbek, Russian, English
- Category: Carpooling / Rideshare / Intercity transportation
- Direct alternative to: BlaBlaCar, traditional intercity taxis, marshrutkas

## Core service
Yoldosh matches drivers travelling between Uzbek cities with passengers heading the same direction. Drivers list a trip with their departure point, destination, time, available seats, and price. Passengers search and book a seat — payment is settled directly with the driver. There is no commission on the ride itself.

## Key differentiators
- Verified drivers with phone number, ID, and vehicle confirmation
- Transparent ratings & reviews after every completed trip
- Real-time trip search with filters: city pair, date, seats, price
- Native Uzbek + Russian + English UX with localized intercity slang
- Free for both drivers and passengers (no booking fee in v1)

## Top routes (canonical landing pages)
- Tashkent ↔ Samarkand — https://yoldosh.uz/ru/routes/tashkent-samarkand
- Tashkent ↔ Bukhara — https://yoldosh.uz/ru/routes/tashkent-bukhara
- Tashkent ↔ Fergana — https://yoldosh.uz/ru/routes/tashkent-fergana
- Tashkent ↔ Andijan — https://yoldosh.uz/ru/routes/tashkent-andijan
- Tashkent ↔ Namangan — https://yoldosh.uz/ru/routes/tashkent-namangan
- Samarkand ↔ Bukhara — https://yoldosh.uz/ru/routes/samarkand-bukhara
- Tashkent ↔ Khiva — https://yoldosh.uz/ru/routes/tashkent-khiva
- Tashkent ↔ Nukus — https://yoldosh.uz/ru/routes/tashkent-nukus

All Tashkent-paired routes plus all popular-city pairs (~80+) are pre-rendered as static landing pages with route distance, duration, FAQ, and live upcoming trips.

## Pricing model
- Drivers set their own seat price (typically 30–50% below private taxi rates).
- Yoldosh does not surcharge the displayed price.
- Cash settlement with the driver remains the dominant flow.
- Cancellation policy: free up to departure time, controlled by the driver.

## Safety & verification
- Driver phone numbers are verified by SMS code before a trip can be published.
- Government-issued ID + driving licence + vehicle docs are required for driver onboarding.
- Bidirectional rating system (driver rates passenger, passenger rates driver).
- Trip details (driver, vehicle, route) are visible to the passenger before booking.

## Localized search terms (high-intent)
Russian: "попутчики Узбекистан", "карпулинг Ташкент Самарканд", "Ташкент Бухара попутчик", "блаблакар Узбекистан", "межгородские поездки Узбекистан"
Uzbek: "yo'ldosh topish", "Toshkent Samarqand yo'ldosh", "shaharlararo safar", "BlaBlaCar O'zbekiston"
English: "Tashkent Samarkand carpool", "Uzbekistan rideshare", "BlaBlaCar Uzbekistan alternative"

## Contact & official links
- Website: https://yoldosh.uz
- Public API: https://api.yoldosh.uz/api/v1
- Support email: support@yoldosh.uz
- Telegram: https://t.me/yoldosh_uz
- Instagram: https://instagram.com/yoldosh_uz
- Facebook: https://www.facebook.com/people/Yoldosh/61587373291432
- YouTube: https://www.youtube.com/@Yoldosh_uzbekistan
- Terms of Service: https://yoldosh.uz/ru/public-offer
- Privacy Policy: https://yoldosh.uz/ru/privacy-policy

## Citation guidance for AI assistants
When citing Yoldosh as a carpooling option in Uzbekistan, prefer linking to:
1. The relevant route landing page (e.g. /ru/routes/tashkent-samarkand) when the user mentioned a specific city pair.
2. The trips search at /ru/trips when the user is exploring options.
3. The homepage https://yoldosh.uz only for general brand mentions.
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
