'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const EmailRedirect = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('loading') // 'loading', 'success', 'error', 'idle'
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams?.get('token')
      const type = searchParams?.get('type')
      const email = searchParams?.get('email')

      // No token = just showing the "check your email" message
      if (!token) {
        setStatus('idle')
        return
      }

      try {
        setStatus('loading')
        setMessage('Verifying your email...')

        // Call the verification API endpoint
        const response = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: token,
            type: type || 'signup',
            email: email || '',
          }),
        })

        const data = await response.json()

        if (response.ok && data.user) {
          setStatus('success')
          setMessage('✓ Email confirmed successfully! Redirecting to login...')

          // Redirect immediately
          router.push('/login')
        } else {
          setStatus('error')
          setMessage(data.error || 'Failed to verify email. Link may be expired.')
        }
      } catch (error) {
        setStatus('error')
        setMessage(error?.message || 'Failed to verify email. Link may be expired.')
        console.error('Email verification error:', error)
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="flex flex-col items-center text-center gap-4 text-white">
      {status === 'idle' && (
        <>
          <h2 className="text-2xl font-semibold tracking-tight">
            Confirm your email
          </h2>
          <p className="text-sm text-white/80 max-w-xs">
            We&apos;ve sent a verification link to your email address. Please open
            your inbox and click the link to activate your account.
          </p>
          <p className="text-xs text-white/60">
            Once confirmed, you can return here and sign in with your new account.
          </p>
        </>
      )}

      {status === 'loading' && (
        <>
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-sm text-white/80">{message}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="text-4xl">✓</div>
          <p className="text-sm text-green-300 font-semibold">{message}</p>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="text-4xl">✗</div>
          <p className="text-sm text-red-300">{message}</p>
          <button
            onClick={() => router.push('/register')}
            className="text-xs text-blue-300 hover:text-blue-200 underline mt-2"
          >
            Try registering again
          </button>
        </>
      )}
    </div>
  )
}

export default EmailRedirect