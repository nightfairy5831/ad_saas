import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/db'

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      // Try to get user profile from Prisma
      let userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        select: { 
          id: true,
          name: true, 
          email: true, 
          company: true, 
          timezone: true,
          projectName: true,
          primaryDomain: true,
          siteId: true
        }
      })

      // If user doesn't exist in Prisma, create it from Supabase Auth data
      if (!userProfile) {
        userProfile = await prisma.user.create({
          data: {
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.name || null,
            company: user.user_metadata?.company || null,
            timezone: user.user_metadata?.timezone || 'America/New_York'
          },
          select: { 
            id: true,
            name: true, 
            email: true, 
            company: true, 
            timezone: true,
            projectName: true,
            primaryDomain: true,
            siteId: true
          }
        })
      }

      return NextResponse.json(userProfile)
    } catch (dbError) {
      // If Prisma fails, fall back to Supabase Auth metadata
      console.warn('Database unavailable, using Supabase Auth metadata:', dbError)
      return NextResponse.json({
        id: user.id,
        name: user.user_metadata?.name || null,
        email: user.email,
        company: user.user_metadata?.company || null,
        timezone: user.user_metadata?.timezone || 'America/New_York',
        projectName: null,
        primaryDomain: null,
        siteId: null
      })
    }
  } catch (error) {
    console.error('User profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectName, primaryDomain, siteId } = await request.json()

    try {
      // Update user profile in Prisma
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          projectName,
          primaryDomain,
          siteId
        },
        select: { 
          id: true,
          name: true, 
          email: true, 
          company: true, 
          timezone: true,
          projectName: true,
          primaryDomain: true,
          siteId: true
        }
      })

      return NextResponse.json(updatedUser)
    } catch (dbError) {
      console.warn('Database unavailable, using Supabase Auth metadata:', dbError)
      return NextResponse.json({ error: 'Failed to save to database' }, { status: 500 })
    }
  } catch (error) {
    console.error('User profile update error:', error)
    return NextResponse.json({ error: 'Failed to update user profile' }, { status: 500 })
  }
}