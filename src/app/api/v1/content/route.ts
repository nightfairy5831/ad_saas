import { NextRequest } from 'next/server'
import { redis, CACHE_TTL } from '@/lib/redis'
import { handleCorsOptions, withCors } from '@/lib/cors'

export const runtime = 'edge'

export async function OPTIONS() {
  return handleCorsOptions()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { utm_campaign, utm_source, utm_medium, gclid, fbclid, site_id } = body
    const siteId = site_id

    // Normalize UTM parameters - use space for missing values
    const normalizedUtmSource = utm_source || ' '
    const normalizedUtmMedium = utm_medium || ' '
    const normalizedUtmCampaign = utm_campaign || ' '
    const normalizedGclid = gclid || ' '
    const normalizedFbclid = fbclid || ' '

    // Create cache key from siteId and all 5 UTM parameters
    const cacheKey = `content:${siteId}:${normalizedUtmSource}:${normalizedUtmMedium}:${normalizedUtmCampaign}:${normalizedGclid}:${normalizedFbclid}`

    // Try Redis cache for formatted content with manual JSON parsing for better performance
    const cachedRaw = await redis.get(cacheKey)
    if (cachedRaw) {
      const cached = typeof cachedRaw === 'string' ? JSON.parse(cachedRaw) : cachedRaw
      return withCors(cached, 200, {
        'Cache-Control': 'public, max-age=3600', // 1 hour browser cache
        'CDN-Cache-Control': 'public, max-age=86400', // 24 hour CDN cache
        'Vary': 'Accept-Encoding'
      })
    }

    // If no content found, return 404
    return withCors({ error: 'No content variant found for parameters' }, 404)
  } catch (error) {
    console.error('Error fetching content:', error);
    return withCors({ error: 'Internal server error' }, 500);
  }
}