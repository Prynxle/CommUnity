import { NextResponse } from 'next/server'
import authService from '../../../../backend/services/auth'
import { checkRateLimit, getClientIp } from '../../../../lib/rateLimit'

export async function POST(request) {
  try {
    const ip = getClientIp(request)
    if (!checkRateLimit(`login:${ip}`, { limit: 25, windowMs: 15 * 60 * 1000 })) {
      return NextResponse.json(
        { error: 'Too many sign-in attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      )
    }

    const data = await authService.signIn({ email, password })
    const session = data.session

    // Do not return refresh_token or full session to the client JSON.
    return NextResponse.json({
      user: data.user,
      access_token: session?.access_token ?? null,
      expires_at: session?.expires_at ?? null,
      expires_in: session?.expires_in ?? null,
      token_type: session?.token_type ?? 'bearer',
    })
  } catch {
    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 401 }
    )
  }
}