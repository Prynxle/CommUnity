import { NextResponse } from 'next/server'
import authService from '../../../../backend/services/auth'

export async function POST(request) {
  try {
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
    const message =
      error?.message ?? 'Unable to register right now. Please try again.'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
