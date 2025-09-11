import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/db'
import { getUserFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { name, url, description } = await request.json()
    
    // Get user ID from request
    const userResult = getUserFromRequest(request)
    if (userResult instanceof NextResponse) return userResult
    const user = { id: userResult }

    // Update user's landing pages array in Prisma
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        landingPages: {
          push: url // Add new landing page URL to the array
        }
      },
      select: { landingPages: true }
    })

    return NextResponse.json({ success: true, landingPages: updatedUser.landingPages })
  } catch (error) {
    console.error('Landing page creation error:', error)
    return NextResponse.json({ error: 'Failed to create landing page' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request
    const userResult = getUserFromRequest(request)
    if (userResult instanceof NextResponse) return userResult
    const user = { id: userResult }

    // Get user's landing pages from Prisma
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      select: { landingPages: true }
    })

    return NextResponse.json({ landingPages: userData?.landingPages || [] })
  } catch (error) {
    console.error('Landing page fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch landing pages' }, { status: 500 })
  }
}