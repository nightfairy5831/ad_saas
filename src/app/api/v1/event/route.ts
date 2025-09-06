import { NextRequest, NextResponse } from 'next/server'

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

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error processing event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}