import { API_URL } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://www.yoldosh.uz';
  
  // Получить все поездки из API
  const response = await fetch(`${API_URL}/public/trips/popular?limit=1000`);
  const data = await response.json();
  
  const trips = data.data.trips || [];
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${trips.map((trip: any) => `
        <url>
          <loc>${baseUrl}/trips/${trip.id}</loc>
          <lastmod>${new Date(trip.updated_at || trip.created_at).toISOString()}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
      `).join('')}
    </urlset>
  `;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}