import { NextResponse } from 'next/server'
import authService from '../../../../backend/services/auth'

export async function POST(request) {
  try {
    const { email, redirectTo } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    // Send password reset email (Supabase will include a token in the link)
    await authService.resetPassword({
      email,
      redirectTo:
        redirectTo || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error?.message ?? 'Unable to send reset email. Please try again.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
