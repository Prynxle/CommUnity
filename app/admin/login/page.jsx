"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Beams from "../../../components/backgrounds/Beams";
import { poppins } from "../../../lib/fonts";
import { saveAdminSession } from "../../../lib/adminStorage";

const ADMIN_OPTIONS = [
  { value: "csa_admin", label: "CSA Admin (Student Welfare, Harassment, Peer Conflict)" },
  { value: "clinic_admin", label: "Clinic Admin (Trauma, Medical, Others)" },
];

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    if (!username || !password) {
      setErrorMessage("Please select an admin account and enter the password.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, remember }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error ?? "Invalid credentials.");
      }
      saveAdminSession(
        {
          email: data.user?.email ?? username,
          role: data.role,
          access_token: data.session?.access_token ?? "",
        },
        remember
      );
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
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
          rotation={1}
        />
      </div>

      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center overflow-y-auto px-4 py-16 sm:py-8">
        <Link
          href="/landingpage"
          className="absolute left-4 top-4 text-sm text-white/90 hover:text-white z-20"
        >
          ← Back to site
        </Link>

        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="/olopsclogo.png"
            width={220}
            height={220}
            alt="CommUnity"
            className="drop-shadow h-16 w-16 sm:h-20 sm:w-20 md:h-[120px] md:w-[120px] object-contain"
          />
          <h1
            className={`${poppins.className} mt-4 text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl`}
          >
            Admin Portal
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/80">
            Welcome to your Admin Portal. Please choose your department and Login.
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-md sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block text-sm font-medium text-white/95">
              Admin account
            </label>
            <select
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-transparent bg-neutral-200/90 px-4 py-3 text-sm sm:text-base text-slate-900 outline-none focus:border-neutral-300 focus:ring-2 focus:ring-white/40"
              required
            >
              <option value="">Select account...</option>
              {ADMIN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-white/95">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-transparent bg-neutral-200/90 px-4 py-3 pr-10 text-slate-900 placeholder-slate-500 outline-none focus:border-neutral-300 focus:ring-2 focus:ring-white/40"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <label className="flex items-center gap-2 text-sm text-white/90">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-white/30 bg-transparent text-white focus:ring-white/30"
              />
              Remember me
            </label>

            {errorMessage && (
              <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-lg bg-white py-3 font-semibold text-slate-900 transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-white/70">
            Are you a College Student? If yes, <Link href="/login" className="underline hover:text-white">Click Here.</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
