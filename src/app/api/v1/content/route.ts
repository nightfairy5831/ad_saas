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

    // Step 1: Try Redis cache first
    const cached = await redis.get(cacheKey)
    if (cached) {
      return withCors(cached)
    }

    // Step 2: Search Redis for UTM & copy block pairs using siteId and all 5 parameters
    const redisSearchKey = `utm:${siteId}:${normalizedUtmSource}:${normalizedUtmMedium}:${normalizedUtmCampaign}:${normalizedGclid}:${normalizedFbclid}`
    const redisContent = await redis.get(redisSearchKey)
    
    let selectedSegment: any, variant: any

    if (redisContent) {
      // Found in Redis
      const parsedContent = typeof redisContent === 'string' ? JSON.parse(redisContent) : redisContent
      selectedSegment = { name: parsedContent.campaignName || 'redis_match' }
      variant = parsedContent
    } else {
      // Step 3: Database fallback - first find userId by siteId, then search campaigns
      console.log('Searching for user with siteId:', siteId);

      const user = await prisma.user.findUnique({
        where: { siteId: siteId }
      });

      if (!user) {
        return withCors({ error: 'User not found for siteId' }, 404);
      }

      console.log('Found user:', user.id, 'searching for campaign with UTMs:', { utm_source, utm_medium, utm_campaign, gclid, fbclid });

      const dbCampaign = await prisma.campaign.findFirst({
        where: {
          userId: user.id,
          utmSource: normalizedUtmSource,
          utmMedium: normalizedUtmMedium,
          utmCampaign: normalizedUtmCampaign,
          status: 'ACTIVE'
        }
      })
      
      console.log('Found campaign:', dbCampaign ? { 
        name: dbCampaign.name, 
        utmCampaign: dbCampaign.utmCampaign, 
        utmSource: dbCampaign.utmSource,
        headline: dbCampaign.headline 
      } : 'No campaign found');

      if (dbCampaign) {
        selectedSegment = { name: dbCampaign.name || 'db_match' }
        variant = {
          campaignName: dbCampaign.name,
          headline: dbCampaign.headline || 'Welcome!',
          sub: dbCampaign.subheadline || 'Great to see you here',
          cta: dbCampaign.cta || 'Get Started'
        }

        // Populate Redis cache for future requests using normalized key
        await redis.set(redisSearchKey, JSON.stringify(variant), { ex: CACHE_TTL });
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