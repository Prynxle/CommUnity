import { NextResponse } from 'next/server'
import authService from '../../../../backend/services/auth'
import { checkRateLimit, getClientIp } from '../../../../lib/rateLimit'

export async function POST(request) {
  try {
    const ip = getClientIp(request)
    if (!checkRateLimit(`register:${ip}`, { limit: 12, windowMs: 60 * 60 * 1000 })) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { email, password, metadata } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    const data = await authService.signUp({
      email,
      password,
      metadata: metadata ?? {},
    })

    return NextResponse.json({ user: data.user }, { status: 201 })
  } catch (error) {
    console.error('[auth register]', error)
    return NextResponse.json(
      { error: 'Unable to register right now. Please try again.' },
      { status: 400 }
    )
  }
}
