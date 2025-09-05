import { NextRequest, NextResponse } from 'next/server'
import { redis, CACHE_TTL } from '@/lib/redis'
import { mockSegments, mockVariants } from '@/lib/mockdata'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { utm_campaign, utm_source, utm_content, gclid, fbclid } = body

    // Create cache key from UTM parameters
    const cacheKey = `content:${utm_campaign || ''}:${utm_source || ''}:${utm_content || ''}:${gclid ? 'gclid' : ''}:${fbclid ? 'fbclid' : ''}`

    // Try to get from cache first
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Find matching segment based on UTM parameters
    const matchedSegment = mockSegments.find(segment => {
      const campaignMatch = !utm_campaign || segment.utm_campaign === utm_campaign
      const sourceMatch = !utm_source || segment.utm_source === utm_source
      const contentMatch = !utm_content || segment.utm_content === utm_content
      const gclidMatch = !gclid || segment.gclid === true
      const fbclidMatch = !fbclid || segment.fbclid === true

      // Check if any parameter matches (OR logic)
      if (utm_campaign && segment.utm_campaign === utm_campaign) return true
      if (utm_source && segment.utm_source === utm_source) return true
      if (utm_content && segment.utm_content === utm_content) return true
      if (gclid && segment.gclid) return true
      if (fbclid && segment.fbclid) return true

      return false
    })

    // Default segment if no match
    const selectedSegment = matchedSegment || mockSegments[0]

    // Find variant for the segment
    const variant = mockVariants.find(v => v.segment_name === selectedSegment.name)

    if (!variant) {
      return NextResponse.json(
        { error: 'No content variant found for segment' },
        { status: 404 }
      )
    }

    // Prepare response
    const response = {
      segment: selectedSegment.name,
      blocks: {
        headline: variant.headline,
        sub: variant.sub,
        bullets: variant.bullets || [],
        cta: variant.cta
      }
    }

    // Cache the response
    await redis.set(cacheKey, response, { ex: CACHE_TTL })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}