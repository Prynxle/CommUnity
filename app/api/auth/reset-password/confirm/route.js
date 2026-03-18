import { NextResponse } from 'next/server'
import authService from '../../../../../backend/services/auth'

export async function POST(request) {
  try {
    const { token, email, password } = await request.json()

    if (!token || !email || !password) {
      return NextResponse.json(
        { error: 'Token, email, and password are required.' },
        { status: 400 }
      )
    }

    await authService.updatePasswordWithOtp({ token, email, password })

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error?.message ?? 'Unable to reset password. Please try again.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
