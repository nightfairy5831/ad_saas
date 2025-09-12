import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma/db'

export async function POST(request: NextRequest) {
  const { name, email, company, timezone, password } = await request.json()

  // Check if user already exists in database
  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return NextResponse.json({ error: 'Email is already registered' }, { status: 409 })
  }

  // Create user in Supabase Auth first
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

  if (!data.user) {
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }

  // Then create user in Prisma database
  await prisma.user.create({
    data: {
      id: data.user.id,
      name,
      email,
      company,
      timezone
    }
  })

  return NextResponse.json({ user: data.user })
}