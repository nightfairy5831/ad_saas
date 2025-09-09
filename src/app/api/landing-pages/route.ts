import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/db'

export async function POST(request: NextRequest) {
  try {
    const { name, url, description } = await request.json()
    
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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