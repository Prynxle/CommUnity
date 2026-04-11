import { NextResponse } from 'next/server'
import authService from '../../../../backend/services/auth'
import { checkRateLimit, getClientIp } from '../../../../lib/rateLimit'

function passwordResetRedirectUrl() {
  // Prefer SITE_URL for emails: APP_URL is often localhost in .env.local and would win if checked first.
  const explicit =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)
  return explicit ? `${explicit.replace(/\/$/, '')}/reset-password` : 'http://localhost:3000/reset-password'
}

export async function POST(request) {
  try {
    const ip = getClientIp(request)
    if (!checkRateLimit(`reset-pw:${ip}`, { limit: 8, windowMs: 60 * 60 * 1000 })) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    // Never trust client-supplied redirectTo (phishing / token theft).
    await authService.resetPassword({
      email,
      redirectTo: passwordResetRedirectUrl(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error?.message ?? 'Unable to send reset email. Please try again.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
