import { API_URL } from '@/lib/api';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.yoldosh.uz';

    // Статические страницы
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/about-us`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/trips`,
            lastModified: new Date(),
            changeFrequency: 'hourly' as const,
            priority: 0.9,
        },
    ];

    // // Динамические страницы поездок (получить из API)
    // const trips = await fetch(`${API_URL}/public/trips/popular`)
    //     .then(res => res.json());

    // const tripPages = trips.data.trips.map((trip: any) => ({
    //     url: `${baseUrl}/trips/${trip.id}`,
    //     lastModified: new Date(trip.updated_at || trip.created_at),
    //     changeFrequency: 'daily' as const,
    //     priority: 0.7,
    // }));

    return [
        ...staticPages,
        // ...tripPages,
    ];
}