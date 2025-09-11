import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request
    const userResult = getUserFromRequest(request)
    if (userResult instanceof NextResponse) return userResult
    const user = { id: userResult }
    
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

      // User should exist since it's created during registration
      if (!userProfile) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json(userProfile)
    } catch (dbError) {
      console.warn('Database error:', dbError)
      return NextResponse.json({ error: 'Database unavailable' }, { status: 500 })
    }
  } catch (error) {
    console.error('User profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get user ID from request
    const userResult = getUserFromRequest(request)
    if (userResult instanceof NextResponse) return userResult
    const user = { id: userResult }

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