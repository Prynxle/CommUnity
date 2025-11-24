"use client";
// LoginCard.jsx
// Purpose: Collect user credentials and provide basic UX affordances (remember me, show/hide password).
// Why: Serves as the entry point to authentication; UI-only until backend/auth APIs are wired.
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginCard({ containerless = false }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  // Define the showPassword state
  const [showPassword, setShowPassword] = useState(false)

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const Inner = (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Sign In</h2>
        <span />
      </div>

      <form
        className="mt-4 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault()
          setErrorMessage('')
          setSuccessMessage('')

          if (!email || !password) {
            setErrorMessage('Please enter your email and password.')
            return
          }

          setIsLoading(true)
          try {
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password, remember }),
            })

            const payload = await response.json()
            if (!response.ok) {
              throw new Error(payload?.error ?? 'Unable to sign in.')
            }

            setSuccessMessage('Signed in successfully.')
          router.push('/home')
          } catch (error) {
            setErrorMessage(error.message)
          } finally {
            setIsLoading(false)
          }
        }}
      >
        <label className="block text-[16px] font-anek text-white/100">E-mail</label>
        <div className="relative">

          <div className="relative w-full">
            {/* Mail icon */}
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-black">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                <polyline points="3 7 12 13 21 7" />
              </svg>
            </span>

            {/* Email input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-transparent bg-neutral-200/90 pl-12 pr-3 py-3
               text-slate-900 placeholder-slate-500 outline-none
               focus:border-neutral-300 focus:ring-2 focus:ring-white/40 transition"
            />
          </div>

        </div>

        <label className="block text-[16px] font-anek text-white/100">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"} // Toggle between text and password type
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="•••••••••••••••"
            className="w-full rounded-lg border border-transparent bg-neutral-200/90 pl-12 pr-3 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-neutral-300 focus:ring-2 focus:ring-white/40 transition"
          />
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-black">
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>

          {/* Eye Icon to toggle password visibility */}
          <span
            className="pointer-events-auto absolute inset-y-0 right-3 flex items-center cursor-pointer transition-all duration-300"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? (
              // 👁️ Eye Open - Show password
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black transition-all duration-300"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              // 🙈 Eye Slashed - Hide password
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black transition-all duration-300"
              >
                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C5 20 1 12 1 12a20.82 20.82 0 0 1 4.22-5.94" />
                <path d="M22.54 12.88A10.94 10.94 0 0 0 23 12s-4-8-11-8a10.94 10.94 0 0 0-4.24.88" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </span>
        </div>

        <div className="mt-1 flex items-center justify-between text-sm">
          <label className="inline-flex cursor-pointer items-center gap-2 text-white/90">
            <input type="checkbox" className="h-4 w-4 rounded border-white/30 bg-transparent text-white focus:ring-white/30" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          <button type="button" className="text-white/90 hover:text-white underline underline-offset-4">Forgot Password?</button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 w-full rounded-lg bg-white py-3 font-semibold text-slate-900 hover:bg-white/90 transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Signing in…' : 'Login'}
        </button>

        {(errorMessage || successMessage) && (
          <p
            className={`text-sm ${
              errorMessage ? 'text-red-300' : 'text-emerald-300'
            }`}
          >
            {errorMessage || successMessage}
          </p>
        )}
      </form>

      {/* Divider */}
      <div className="my-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/20" />
        <span className="text-sm text-white/80">or</span>
        <div className="h-px flex-1 bg-white/20" />
      </div>

      {/* Google button */}
      <button type="button" className="w-full rounded-lg bg-white/95 py-3 text-slate-900 hover:bg-white inline-flex items-center justify-center gap-3 shadow-sm transition">
        <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.28,6.053,28.884,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.28,6.053,28.884,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c4.798,0,9.18-1.842,12.483-4.837l-5.769-4.869C28.661,35.523,26.422,36,24,36c-5.202,0-9.619-3.317-11.281-7.953l-6.49,5.004C9.551,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.793,2.239-2.231,4.166-4.114,5.572c0,0,0.002-0.001,0.003-0.002l6.492,5.006C35.649,40.648,44,36,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
        <span className="font-medium">Sign In with Google</span>
      </button>

      <p className="mt-4 text-center text-sm text-white/80">
        Don&apos;t have an account? <Link href="/register" className="underline hover:text-white">Register</Link>
      </p>

    </>
  )

  if (containerless) return Inner

  return (
    <div className="relative w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md">
      {Inner}
      <div className="pointer-events-none absolute -inset-[1px] rounded-2xl ring-1 ring-white/20" />
    </div>
  )
}


