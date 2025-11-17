import React from 'react'

// EmailRedirect.jsx
// Simple prompt shown after registration telling the user to confirm their email.
const EmailRedirect = () => {
  return (
    <div className="flex flex-col items-center text-center gap-4 text-white">
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
    </div>
  )
}

export default EmailRedirect