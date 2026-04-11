import { NextResponse } from 'next/server'
import authService from '../../../../backend/services/auth'
import { checkRateLimit, getClientIp } from '../../../../lib/rateLimit'

/** Admin account → Supabase email (create these users in Supabase Auth) */
const ADMIN_EMAILS = {
  csa_admin: 'csa_admin@community.local',
  clinic_admin: 'clinic_admin@community.local',
}

const VALID_ROLES = Object.keys(ADMIN_EMAILS)

/**
 * POST /api/auth/admin-login
 * Body: { username: 'csa_admin' | 'clinic_admin', password: string, remember?: boolean }
 * Returns: { user, session, role } so client can store token and role.
 */
export async function POST(request) {
  try {
    const ip = getClientIp(request)
    if (!checkRateLimit(`admin-login:${ip}`, { limit: 25, windowMs: 15 * 60 * 1000 })) {
      return NextResponse.json(
        { error: 'Too many sign-in attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Admin account and password are required.' },
        { status: 400 }
      )
    }

    const role = username.toLowerCase().trim()
    const email = ADMIN_EMAILS[role]

    if (!email || !VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid admin account. Use csa_admin or clinic_admin.' },
        { status: 400 }
      )
    }

    const data = await authService.signIn({ email, password })
    const session = data.session

    return NextResponse.json({
      user: data.user,
      role,
      access_token: session?.access_token ?? null,
      expires_at: session?.expires_at ?? null,
      expires_in: session?.expires_in ?? null,
      token_type: session?.token_type ?? 'bearer',
    })
  } catch {
    return NextResponse.json(
      { error: 'Invalid credentials or account not set up. Please try again.' },
      { status: 401 }
    )
  }
}
