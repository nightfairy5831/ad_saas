import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma/db'
import { getUserFromRequest } from '@/lib/auth'

// Generate a secure and unique API key
async function generateApiKey(prefix: string = 'sk_live_', userId: string): Promise<string> {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const keyLength = 28
  
  let attempts = 0
  const maxAttempts = 5
  
  while (attempts < maxAttempts) {
    // Generate random key part
    let randomPart = ''
    for (let i = 0; i < keyLength; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    const apiKey = prefix + randomPart
    
    try {
      // Check if this key already exists for any user
      const existingUser = await prisma.user.findFirst({
        where: {
          apiKeys: {
            path: ['$[*].key'],
            array_contains: apiKey
          }
        }
      })
      
      // If no existing key found, return the unique key
      if (!existingUser) {
        return apiKey
      }
      
      attempts++
    } catch (error) {
      // If database check fails, add timestamp to ensure uniqueness
      const timestamp = Date.now().toString(36).substring(0, 8)
      return prefix + randomPart.substring(0, keyLength - timestamp.length) + timestamp
    }
  }
  
  // Fallback: add timestamp to ensure uniqueness
  const timestamp = Date.now().toString(36).substring(0, 8)
  const randomPart = crypto.randomUUID().replace(/-/g, '').substring(0, keyLength - timestamp.length)
  return prefix + randomPart + timestamp
}

export async function GET(request: NextRequest) {
  try {
    // Get user ID from request
    const userResult = getUserFromRequest(request)
    if (userResult instanceof NextResponse) return userResult
    const user = { id: userResult }

    try {
      // Get user's API keys
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        select: { apiKeys: true }
      })

      return NextResponse.json({ apiKeys: userProfile?.apiKeys || [] })
    } catch (dbError) {
      console.warn('Database unavailable:', dbError)
      return NextResponse.json({ apiKeys: [] })
    }
  } catch (error) {
    console.error('API keys fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch API keys' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get user ID from request
    const userResult = getUserFromRequest(request)
    if (userResult instanceof NextResponse) return userResult
    const user = { id: userResult }

    const { name, type = 'production' } = await request.json()

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'API key name is required' }, { status: 400 })
    }

    const prefix = type === 'development' ? 'sk_test_' : 'sk_live_'
    const generatedKey = await generateApiKey(prefix, user.id)
    
    const newApiKey = {
      id: crypto.randomUUID(),
      name: name.trim(),
      key: generatedKey,
      type,
      createdAt: new Date().toISOString(),
      lastUsedAt: null,
      requestCount: 0
    }

    try {
      // Get current API keys
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        select: { apiKeys: true }
      })

      const currentApiKeys = (userProfile?.apiKeys as any[]) || []
      
      // Check if API key of same type already exists
      const existingKeyIndex = currentApiKeys.findIndex((key: any) => key.type === type)
      
      let updatedApiKeys
      if (existingKeyIndex !== -1) {
        // Update existing key
        updatedApiKeys = [...currentApiKeys]
        updatedApiKeys[existingKeyIndex] = newApiKey
      } else {
        // Add new key
        updatedApiKeys = [...currentApiKeys, newApiKey]
      }

      // Update user with new API key
      await prisma.user.update({
        where: { id: user.id },
        data: { apiKeys: updatedApiKeys }
      })

      return NextResponse.json({ apiKey: newApiKey })
    } catch (dbError) {
      console.warn('Database unavailable:', dbError)
      return NextResponse.json({ error: 'Failed to save API key' }, { status: 500 })
    }
  } catch (error) {
    console.error('API key generation error:', error)
    return NextResponse.json({ error: 'Failed to generate API key' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get user ID from request
    const userResult = getUserFromRequest(request)
    if (userResult instanceof NextResponse) return userResult
    const user = { id: userResult }

    const { searchParams } = new URL(request.url)
    const keyId = searchParams.get('id')

    if (!keyId) {
      return NextResponse.json({ error: 'API key ID is required' }, { status: 400 })
    }

    try {
      // Get current API keys
      const userProfile = await prisma.user.findUnique({
        where: { id: user.id },
        select: { apiKeys: true }
      })

      const currentApiKeys = (userProfile?.apiKeys as any[]) || []
      const updatedApiKeys = currentApiKeys.filter((key: any) => key.id !== keyId)

      // Update user with remaining API keys
      await prisma.user.update({
        where: { id: user.id },
        data: { apiKeys: updatedApiKeys }
      })

      return NextResponse.json({ success: true })
    } catch (dbError) {
      console.warn('Database unavailable:', dbError)
      return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 })
    }
  } catch (error) {
    console.error('API key deletion error:', error)
    return NextResponse.json({ error: 'Failed to delete API key' }, { status: 500 })
  }
}