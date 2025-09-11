import { NextRequest, NextResponse } from 'next/server'

export function getUserFromRequest(request: NextRequest): string | NextResponse {
  const userId = request.headers.get('x-user-id')
  
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  return userId
}