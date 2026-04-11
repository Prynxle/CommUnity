"use client";

import { useState } from "react";
import Link from "next/link";
import Beams from "../../components/backgrounds/Beams";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [message, setMessage] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Unable to send reset email.");
      }
      setStatus("success");
      setMessage("Check your inbox for a password reset link.");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  return (
    <div className="relative min-h-screen w-full">
      <div className="absolute inset-0 -z-10">
        <Beams
          beamWidth={3}
          beamHeight={50}
          beamNumber={30}
          lightColor="#7070FA"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-y-auto px-4 py-16 sm:py-8">
        <Link
          href="/"
          className="absolute left-4 top-4 text-sm text-white/90 hover:text-white z-20"
        >
          ← Back to sign in
        </Link>

        <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white">Forgot password</h1>
            <p className="mt-2 text-sm text-white/80">
              Enter your email and we’ll send a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-white/95">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-transparent bg-neutral-200/90 px-4 py-3 text-sm text-slate-900 outline-none focus:border-neutral-300 focus:ring-2 focus:ring-white/40"
              required
            />

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full rounded-lg bg-white py-3 font-semibold text-slate-900 hover:bg-white/90 transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "submitting" ? "Sending…" : "Send reset link"}
            </button>

            {message && (
              <p className={`text-sm ${status === "error" ? "text-red-300" : "text-emerald-300"}`}>
                {message}
              </p>
            )}
          </form>

          <p className="mt-6 text-center text-sm text-white/80">
            Remembered your password? <Link href="/" className="underline hover:text-white">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
