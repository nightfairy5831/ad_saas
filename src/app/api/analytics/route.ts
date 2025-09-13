import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { calculateCampaignMetrics } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const userResult = getUserFromRequest(request)
    if (userResult instanceof NextResponse) return userResult
    const userId = userResult

    const campaignMetrics = await calculateCampaignMetrics(userId)

    return Response.json({ campaignMetrics })

  } catch (error) {
    console.error('Analytics API error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}