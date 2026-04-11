import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * POST /api/auth/verify
 * Verify email confirmation token from email link
 * Body: { token, type, email }
 */
export async function POST(request) {
  try {
    const { token, type, email } = await request.json()

    if (!token || !type || !email) {
      return NextResponse.json(
        { error: 'Token, type, and email are required.' },
        { status: 400 }
      )
    }

    // Call Supabase to verify the OTP token
    const supabase = createClient(
      process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    )

    const { data, error } = await supabase.auth.verifyOtp({
      type: type, // 'signup', 'recovery', etc.
      token: token,
      email: email,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message || 'Email verification failed.' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: data?.user,
      message: 'Email verified successfully!',
    })
  } catch (error) {
    console.error('[auth verify error]', error)
    return NextResponse.json(
      { error: 'Verification failed. Please try again.' },
      { status: 500 }
    )
  }
}
