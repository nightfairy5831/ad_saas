import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/db'
import { getUserFromRequest } from '@/lib/auth'
import { calculateCampaignMetrics } from '@/lib/analytics'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request
    const userResult = getUserFromRequest(request)
    if (userResult instanceof NextResponse) return userResult
    const user = { id: userResult }

    try {
      // Get campaigns with real analytics data
      const campaignMetrics = await calculateCampaignMetrics(user.id)

      // Transform to match frontend interface
      const transformedCampaigns = campaignMetrics.map(campaign => ({
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        utmSource: campaign.utmSource,
        utmMedium: campaign.utmMedium,
        utmCampaign: campaign.utmCampaign,
        copyVariations: {
          headline: campaign.headline || '',
          subheadline: campaign.subheadline || '',
          cta: campaign.cta || ''
        },
        clicks: campaign.clicks,
        conversions: campaign.conversions,
        archived: false,
        landingPageUrl: campaign.landingPageUrl
      }))

      return NextResponse.json(transformedCampaigns)
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  } catch (error) {
    console.error('Campaigns fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from request
    const userResult = getUserFromRequest(request)
    if (userResult instanceof NextResponse) return userResult
    const user = { id: userResult }

    const body = await request.json()
    const { name, status, utmSource, utmMedium, utmCampaign, copyVariations, landingPageUrl } = body

    try {
      const campaign = await prisma.campaign.create({
        data: {
          name,
          status: status.toUpperCase(),
          utmSource,
          utmMedium,
          utmCampaign,
          headline: copyVariations?.headline,
          subheadline: copyVariations?.subheadline,
          cta: copyVariations?.cta,
          landingPageUrl,
          userId: user.id
        }
      })

      // Transform to match frontend interface
      const transformedCampaign = {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status.toLowerCase(),
        utmSource: campaign.utmSource,
        utmMedium: campaign.utmMedium,
        utmCampaign: campaign.utmCampaign,
        copyVariations: {
          headline: campaign.headline || '',
          subheadline: campaign.subheadline || '',
          cta: campaign.cta || ''
        },
        clicks: 0,
        conversions: 0,
        archived: false,
        landingPageUrl: campaign.landingPageUrl
      }

      return NextResponse.json(transformedCampaign)
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      
      // Handle unique constraint violation (P2002 is Prisma's code for unique constraint failure)
      if (dbError.code === 'P2002' && dbError.meta?.target?.includes('utm_source') && dbError.meta?.target?.includes('utm_medium') && dbError.meta?.target?.includes('utm_campaign')) {
        return NextResponse.json({ 
          error: 'A campaign with these UTM parameters already exists. Please use different UTM source, medium, or campaign values.',
          errorCode: 'DUPLICATE_UTM'
        }, { status: 409 })
      }
      
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  } catch (error) {
    console.error('Campaign creation error:', error)
    return NextResponse.json({ error: 'Failed to create campaign' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get user ID from request
    const userResult = getUserFromRequest(request)
    if (userResult instanceof NextResponse) return userResult
    const user = { id: userResult }

    const body = await request.json()
    const { id, name, status, utmSource, utmMedium, utmCampaign, copyVariations, landingPageUrl } = body

    try {
      const campaign = await prisma.campaign.update({
        where: { 
          id,
          userId: user.id 
        },
        data: {
          name,
          status: status.toUpperCase(),
          utmSource,
          utmMedium,
          utmCampaign,
          headline: copyVariations?.headline,
          subheadline: copyVariations?.subheadline,
          cta: copyVariations?.cta,
          landingPageUrl
        }
      })

      // Transform to match frontend interface
      const transformedCampaign = {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status.toLowerCase(),
        utmSource: campaign.utmSource,
        utmMedium: campaign.utmMedium,
        utmCampaign: campaign.utmCampaign,
        copyVariations: {
          headline: campaign.headline || '',
          subheadline: campaign.subheadline || '',
          cta: campaign.cta || ''
        },
        clicks: 0,
        conversions: 0,
        archived: false,
        landingPageUrl: campaign.landingPageUrl
      }

      return NextResponse.json(transformedCampaign)
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  } catch (error) {
    console.error('Campaign update error:', error)
    return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get user ID from request
    const userResult = getUserFromRequest(request)
    if (userResult instanceof NextResponse) return userResult
    const user = { id: userResult }

    const body = await request.json()
    const { id } = body

    try {
      await prisma.campaign.delete({
        where: { 
          id,
          userId: user.id 
        }
      })

      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  } catch (error) {
    console.error('Campaign delete error:', error)
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 })
  }
}