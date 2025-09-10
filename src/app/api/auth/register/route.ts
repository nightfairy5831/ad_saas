import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, timezone, password } = await request.json()

    // Create user in Supabase Auth with metadata (always ADMIN role for registration)
    const supabase = await createClient()
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, company, timezone, role: 'ADMIN' }
      }
    })

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    return NextResponse.json({ user: data.user })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}