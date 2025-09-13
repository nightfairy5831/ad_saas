import { NextRequest } from 'next/server'
import { handleCorsOptions, withCors } from '@/lib/cors'
import { prisma } from '@/lib/prisma/db'

export async function OPTIONS() {
  return handleCorsOptions()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_type, segment, site_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, gclid, fbclid, revenue, is_holdout } = body

    console.log(`Event received: ${event_type}`, { segment, is_holdout })

    // Map event_type to database enum (only 3 types: view, cta, purchase)
    const eventTypeMap: any = {
      'PAGE_VIEW': 'PAGE_VIEW',
      'CTA_CLICK': 'CTA_CLICK', 
      'PURCHASE_CLICK': 'PURCHASE'
    }

    // Save to database (find user by site_id or use default)
    const user = await prisma.user.findFirst({
      where: { siteId: site_id }
    })

    if (user) {
      await prisma.event.create({
        data: {
          type: eventTypeMap[event_type] || 'PAGE_VIEW',
          campaignName: segment,
          utmSource: utm_source,
          utmMedium: utm_medium,
          utmCampaign: utm_campaign,
          utmContent: utm_content,
          utmTerm: utm_term,
          gclid,
          fbclid,
          revenue: revenue ? parseFloat(revenue) : null,
          isHoldout: Boolean(is_holdout),
          userId: user.id
        }
      })
    }

    const response = {
      success: true,
      event_type,
      segment,
      timestamp: new Date().toISOString()
    }

    return withCors(response)
  } catch (error) {
    console.error('Error processing event:', error)
    return withCors({ error: 'Internal server error' }, 500)
  }
}