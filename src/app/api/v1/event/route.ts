import { NextRequest } from 'next/server'
import { handleCorsOptions, withCors } from '@/lib/cors'

export async function OPTIONS() {
  return handleCorsOptions()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { event_type, segment, ...metadata } = body

    console.log(`Event received: ${event_type}`, {
      segment,
      metadata,
      timestamp: new Date().toISOString()
    })

    const response = {
      success: true,
      event_type,
      segment,
      timestamp: new Date().toISOString()
    }

    return withCors(response)
  } catch (error) {
    console.error('Error processing event:', error)
    return withCors({ error: 'Internal server error' }, 500)
  }
}