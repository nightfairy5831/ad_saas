import { NextResponse } from 'next/server'

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Site-ID',
}

export function handleCorsOptions() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  })
}

export function withCors(response: any, status?: number, additionalHeaders?: Record<string, string>) {
  return NextResponse.json(response, {
    status,
    headers: { ...corsHeaders, ...additionalHeaders },
  })
}