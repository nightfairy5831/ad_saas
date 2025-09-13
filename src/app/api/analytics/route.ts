import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma/db'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userResult = getUserFromRequest(request)
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult

    // Get all campaigns for the user
    const campaigns = await prisma.campaign.findMany({
      where: { userId: userId }
    })

    // Get events grouped by campaign name
    const events = await prisma.event.findMany({
      where: { userId: userId }
    })

    // Group events by campaignName
    const eventGroups = events.reduce((acc, event) => {
      const name = event.campaignName || 'Unknown Campaign'
      if (!acc[name]) {
        acc[name] = { pageViews: 0, ctaClicks: 0, purchases: 0, revenue: 0 }
      }

      if (event.type === 'PAGE_VIEW') acc[name].pageViews++
      if (event.type === 'CTA_CLICK') acc[name].ctaClicks++
      if (event.type === 'PURCHASE') acc[name].purchases++
      if (event.revenue) acc[name].revenue += Number(event.revenue)

      return acc
    }, {} as Record<string, any>)

    // Convert campaigns to metrics format, including those with zero events
    const campaignMetrics = campaigns.map(campaign => {
      const stats = eventGroups[campaign.name] || { pageViews: 0, ctaClicks: 0, purchases: 0, revenue: 0 }
      const totalClicks = stats.ctaClicks + stats.purchases

      return {
        name: campaign.name,
        source: campaign.utmSource,
        clicks: totalClicks,
        conversions: stats.purchases,
        conversionRate: stats.pageViews > 0 ? Number((totalClicks / stats.pageViews * 100).toFixed(1)) : 0,
        revenue: Number(stats.revenue.toFixed(2)),
        headline: campaign.headline,
        subheadline: campaign.subheadline,
        cta: campaign.cta
      }
    })

    return Response.json({ campaignMetrics })

  } catch (error) {
    console.error('Analytics API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}