"use client";

import { useState } from 'react'
import Link from 'next/link'

export default function RegistrationCard({ containerless = false }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  const Inner = (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-white">Create Account</h2>
        <span />
      </div>

      <form className="mt-6 space-y-6" onSubmit={(e) => e.preventDefault()}>
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[16px] font-anek text-white/100 mb-3">First Name</label>
            <div className="relative">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full rounded-lg border border-transparent bg-neutral-200/90 px-10 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-neutral-300 focus:ring-2 focus:ring-white/40 transition"
              />
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-black">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[16px] font-anek text-white/100 mb-3">Last Name</label>
            <div className="relative">
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full rounded-lg border border-transparent bg-neutral-200/90 px-10 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-neutral-300 focus:ring-2 focus:ring-white/40 transition"
              />
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-black">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
              </span>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="mt-[100px]">
          <label className="block text-[16px] font-anek text-white/100 mb-3">E-mail</label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-transparent bg-neutral-200/90 px-10 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-neutral-300 focus:ring-2 focus:ring-white/40 transition"
            />
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
          </div>
        </div>

        {/* Password */}
        <div className="mt-[100px]">
          <label className="block text-[16px] font-anek text-white/100 mb-3">Password</label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="•••••••••••••••"
              className="w-full rounded-lg border border-transparent bg-neutral-200/90 px-10 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-neutral-300 focus:ring-2 focus:ring-white/40 transition"
            />
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-black">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </span>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mt-[100px]">
          <label className="block text-[16px] font-anek text-white/100 mb-3">Confirm Password</label>
          <div className="relative">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="•••••••••••••••"
              className="w-full rounded-lg border border-transparent bg-neutral-200/90 px-10 py-3 text-slate-900 placeholder-slate-500 outline-none focus:border-neutral-300 focus:ring-2 focus:ring-white/40 transition"
            />
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-black">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
            </span>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-white/30 bg-transparent text-white focus:ring-white/30 mt-1"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
          />
          <label className="text-white/90 cursor-pointer">
            I agree to the <button type="button" className="underline hover:text-white">Terms of Service</button> and <button type="button" className="underline hover:text-white">Privacy Policy</button>
          </label>
        </div>

        <button type="submit" className="mt-2 w-full rounded-lg bg-white py-3 font-semibold text-slate-900 hover:bg-white/90 transition">Create Account</button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/20" />
        <span className="text-sm text-white/80">or</span>
        <div className="h-px flex-1 bg-white/20" />
      </div>

      {/* Google button */}
      <button type="button" className="w-full rounded-lg bg-white/95 py-3 text-slate-900 hover:bg-white inline-flex items-center justify-center gap-3 shadow-sm transition">
        <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.28,6.053,28.884,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.28,6.053,28.884,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c4.798,0,9.18-1.842,12.483-4.837l-5.769-4.869C28.661,35.523,26.422,36,24,36c-5.202,0-9.619-3.317-11.281-7.953l-6.49,5.004C9.551,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.793,2.239-2.231,4.166-4.114,5.572c0,0,0.002-0.001,0.003-0.002l6.492,5.006C35.649,40.648,44,36,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
        <span className="font-medium">Sign Up with Google</span>
      </button>

      <p className="mt-6 text-center text-sm text-white/80">
        Already have an account? <Link href="/" className="underline hover:text-white">Sign In</Link>
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
