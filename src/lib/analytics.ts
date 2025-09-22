import { prisma } from '@/lib/prisma/db'

interface EventStats {
  pageViews: number;
  ctaClicks: number;
  purchases: number;
  revenue: number;
}

interface CampaignWithMetrics {
  id: string;
  name: string;
  status: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  headline?: string | null;
  subheadline?: string | null;
  cta?: string | null;
  textblock?: string[];
  landingPageUrl?: string | null;
  clicks: number;
  conversions: number;
  conversionRate: number;
  revenue: number;
}

export async function calculateCampaignMetrics(userId: string): Promise<CampaignWithMetrics[]> {
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
  }, {} as Record<string, EventStats>)

  // Convert campaigns to metrics format, including those with zero events
  const campaignMetrics = campaigns.map(campaign => {
    // Try to find events by campaign name first, then by UTM combination
    let stats = eventGroups[campaign.name]
    if (!stats) {
      const utmKey = `${campaign.utmSource}_${campaign.utmMedium}_${campaign.utmCampaign}`
      stats = eventGroups[utmKey]
    }
    stats = stats || { pageViews: 0, ctaClicks: 0, purchases: 0, revenue: 0 }

    const totalClicks = stats.ctaClicks + stats.purchases

    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status.toLowerCase(),
      source: campaign.utmSource,
      utmSource: campaign.utmSource,
      utmMedium: campaign.utmMedium,
      utmCampaign: campaign.utmCampaign,
      landingPageUrl: campaign.landingPageUrl,
      clicks: totalClicks,
      conversions: stats.purchases,
      conversionRate: stats.pageViews > 0 ? Number((totalClicks / stats.pageViews * 100).toFixed(1)) : 0,
      revenue: Number(stats.revenue.toFixed(2)),
      headline: campaign.headline,
      subheadline: campaign.subheadline,
      cta: campaign.cta,
      textblock: campaign.textblock
    }
  })

  return campaignMetrics
}