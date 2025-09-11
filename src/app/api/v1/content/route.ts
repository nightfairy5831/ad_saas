import { NextRequest } from 'next/server'
import { redis, CACHE_TTL } from '@/lib/redis'
import { handleCorsOptions, withCors } from '@/lib/cors'
import { prisma } from '@/lib/prisma/db'

export async function OPTIONS() {
  return handleCorsOptions()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { utm_campaign, utm_source, utm_content, gclid, fbclid } = body

    // Create cache key from UTM parameters
    const cacheKey = `content:${utm_campaign || ''}:${utm_source || ''}:${utm_content || ''}:${gclid ? 'gclid' : ''}:${fbclid ? 'fbclid' : ''}`

    // Step 1: Try Redis cache first
    const cached = await redis.get(cacheKey)
    if (cached) {
      return withCors(cached)
    }

    // Step 2: Search Redis for UTM & copy block pairs
    const redisSearchKey = `utm:${utm_campaign || utm_source || 'default'}`
    const redisContent = await redis.get(redisSearchKey)
    
    let selectedSegment: any, variant: any

    if (redisContent) {
      // Found in Redis
      selectedSegment = { name: 'redis_match' }
      variant = redisContent
    } else {
      // Step 3: Database fallback - search campaigns
      const dbCampaign = await prisma.campaign.findFirst({
        where: {
          OR: [
            { utmCampaign: utm_campaign },
            { utmSource: utm_source },
            { utmContent: utm_content }
          ],
          status: 'ACTIVE'
        }
      })

      if (dbCampaign) {
        selectedSegment = { name: dbCampaign.name || 'db_match' }
        variant = {
          headline: dbCampaign.headline || 'Welcome!',
          sub: dbCampaign.subheadline || 'Great to see you here',
          cta: dbCampaign.cta || 'Get Started'
        }
      }

    if (!variant) {
      return withCors({ error: 'No content variant found for segment' }, 404)
    }

    // Prepare response
    const response = {
      segment: selectedSegment?.name || 'default',
      blocks: {
        headline: variant?.headline || 'Welcome!',
        sub: variant?.sub || 'Great to see you here',
        bullets: variant?.bullets || [],
        cta: variant?.cta || 'Get Started'
      }
    }

    // Cache the response
    await redis.set(cacheKey, response, { ex: CACHE_TTL });

    return withCors(response);
    } 
  }catch (error) {
    console.error('Error fetching content:', error);
    return withCors({ error: 'Internal server error' }, 500);
  }
}