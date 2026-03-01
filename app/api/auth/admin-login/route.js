import { NextResponse } from 'next/server'
import authService from '../../../../backend/services/auth'

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

    return NextResponse.json({
      user: data.user,
      session: data.session,
      role,
    })
  } catch (error) {
    const message =
      error?.message ?? 'Invalid credentials or account not set up. Please try again.'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
