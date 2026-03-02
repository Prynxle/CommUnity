import { createClient } from '@supabase/supabase-js'

/**
 * Supabase Auth Service
 *
 * This module centralizes every interaction with Supabase auth so the rest of
 * the codebase can stay framework-agnostic and you only ever touch backend code
 * inside `backend/services`.
 *
 * Environment variables (define them in `.env.local` or the hosting provider):
 * - SUPABASE_URL
 * - SUPABASE_ANON_KEY
 *
 * NOTE:
 * Never import this file from a client component – it depends on Node env vars.
 */

const SUPABASE_URL =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let _supabase = null
function getSupabase() {
  // Important: do NOT throw at module import time. This file can be imported during builds.
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      '[auth service] Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_ANON_KEY.'
    )
  }
  if (_supabase) return _supabase
  _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
  return _supabase
}

const handle = async (promise, label) => {
  const { data, error } = await promise
  if (error) {
    const message = `[auth service:${label}] ${error.message}`
    const err = new Error(message)
    err.__supabase = error
    throw err
  }
  return data
}

export const authService = {
  /**
   * Create a new user (email + password). Optional metadata is stored in the user profile.
   */
  async signUp({ email, password, metadata = {} }) {
    if (!email || !password) {
      throw new Error('[auth service:signUp] Email and password are required.')
    }

    const supabase = getSupabase()
    const data = await handle(
      supabase.auth.signUp({
        email,
        password,
        options: { data: metadata, emailRedirectTo: undefined },
      }),
      'signUp'
    )

    return data
  },

  /**
   * Sign in an existing user with email + password.
   */
  async signIn({ email, password }) {
    if (!email || !password) {
      throw new Error('[auth service:signIn] Email and password are required.')
    }

    const supabase = getSupabase()
    const data = await handle(
      supabase.auth.signInWithPassword({ email, password }),
      'signInWithPassword'
    )

    return data
  },

  /**
   * Send a password reset email (Supabase magic-link flow).
   */
  async resetPassword({ email, redirectTo }) {
    if (!email) {
      throw new Error('[auth service:resetPassword] Email is required.')
    }

    const supabase = getSupabase()
    await handle(
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo ?? undefined,
      }),
      'resetPassword'
    )
    return true
  },

  /**
   * Verify a password reset token (OTP) and set the new password.
   */
  async updatePasswordWithOtp({ token, password, email }) {
    if (!token || !password || !email) {
      throw new Error(
        '[auth service:updatePasswordWithOtp] Token, email, and password are required.'
      )
    }

    const supabase = getSupabase()
    const data = await handle(
      supabase.auth.verifyOtp({
        type: 'recovery',
        token,
        email,
      }),
      'verifyOtp'
    )

    await handle(
      supabase.auth.updateUser({ password }),
      'updatePasswordAfterOtp'
    )

    return data
  },

  /**
   * Fetch the current session/user using a Supabase access token (from cookies or headers).
   */
  async getSession(accessToken) {
    if (!accessToken) {
      throw new Error('[auth service:getSession] Access token is required.')
    }

    const supabase = getSupabase()
    const data = await handle(
      supabase.auth.getUser(accessToken),
      'getUserFromToken'
    )

    return data
  },

  /**
   * Server-side sign-out (revokes refresh token for the user).
   */
  async signOut() {
    const supabase = getSupabase()
    await handle(supabase.auth.signOut(), 'signOut')
    return true
  },
}

export default authService
