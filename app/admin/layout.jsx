"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { getAdminSession, hasValidAdminSession, clearAdminSession } from "../../lib/adminStorage";
import { georama, poppins } from "../../lib/fonts";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const session = getAdminSession();
  const hasSession = hasValidAdminSession(session);
  const admin = isLoginPage || !hasSession ? null : session;

  useEffect(() => {
    if (!hasSession && session) {
      clearAdminSession();
    }
    if (isLoginPage) {
      if (hasSession) {
        router.replace("/admin");
      }
      return;
    }
    if (!hasSession) {
      router.replace("/admin/login");
    }
  }, [hasSession, isLoginPage, router, session]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!hasSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1C0770]">
        <div className="text-white/90">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <AdminHeader admin={admin} />
      <main className="mx-auto w-full overflow-x-hidden">{children}</main>
      <AdminFooter />
    </div>
  );
}

function AdminHeader({ admin }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    clearAdminSession();
    router.push("/admin/login");
    router.refresh();
  }

  const roleLabel =
    admin?.role === "csa_admin"
      ? "CSA Admin"
      : admin?.role === "clinic_admin"
        ? "Clinic Admin"
        : "Admin";

  const greetingName = useMemo(() => {
    const emailName = admin?.email?.split("@")[0]?.replace(/[._-]+/g, " ")?.trim();
    if (!emailName) return "Admin";
    return emailName.replace(/\b\w/g, (char) => char.toUpperCase());
  }, [admin?.email]);

  const nav = [
    { label: "Overview", href: "/admin#overview" },
    { label: "Response", href: "/admin#response" },
    { label: "Reports", href: "/admin#reports" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1C0770]/95 backdrop-blur-xl shadow-[0_10px_35px_rgba(28,7,112,0.24)]">
      <div className="w-full px-5 sm:px-6 lg:px-10">
        <div className="flex h-[74px] items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/olopsclogo.png" alt="OLOPSC Logo" width={220} height={220} className="h-12 w-auto" />
            <div className="leading-tight">
              <div className={`${georama.className} text-[14px] font-extrabold tracking-wide text-white sm:text-[16px] md:text-[18px]`}>
                COMM-<span className="text-[#FFEB00]">UNITY</span>
              </div>
              <div className="text-[11px] text-white/75 sm:text-[12px] md:text-[14px]">
                Incident Reporting System Admin
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3 lg:gap-6">
            <nav className={`${poppins.className} hidden lg:flex items-center gap-8 text-sm md:text-base text-white/80`}>
              {nav.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group relative font-medium text-white/85 transition hover:text-white"
                  >
                    <span
                      className={[
                        "absolute -bottom-2 left-0 h-[2px] bg-[#FFEB00] transition-all duration-300",
                        isActive ? "w-full opacity-100" : "w-0 group-hover:w-full",
                      ].join(" ")}
                    />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-2 text-right text-white/90">
                <div className="text-xs uppercase tracking-[0.22em] text-white/60">Signed in</div>
                <div className="text-sm font-semibold">Hello, {greetingName}</div>
                <div className="text-xs text-white/70">{roleLabel}</div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-10 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-5 text-[14px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-[0_14px_38px_rgba(0,0,0,0.22)]"
              >
                Log out
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/15 lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#1C0770] lg:hidden">
          <div className="space-y-4 px-4 pb-4 pt-3">
            <nav className={`${poppins.className} flex flex-col gap-2 text-sm text-white/85`}>
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-3 py-3 font-medium hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white/90">
              <div className="text-xs uppercase tracking-[0.22em] text-white/60">Signed in</div>
              <div className="mt-1 text-sm font-semibold">Hello, {greetingName}</div>
              <div className="text-xs text-white/70">{roleLabel}</div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function AdminFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-gray-50 bg-white">
      {/* light mode glow background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* blue glow */}
        <div className="absolute right-[-180px] top-[-160px] h-[460px] w-[460px] rounded-full bg-[#261CC1]/10 blur-[140px]" />
        {/* yellow accent glow */}
        <div className="absolute left-1/2 top-[-200px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#FFEB00]/[0.10] blur-[160px]" />
        {/* soft fade to white */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/85 to-white" />
      </div>

      {/* footer content */}
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-5 sm:px-6 py-6">

        <p
          className={[
            georama.className,
            "text-[13.5px] sm:text-[14.5px]",
            "text-gray-700",
          ].join(" ")}
        >
          © <span className="font-semibold text-gray-900">2025</span>{" "}
          <span className="font-semibold text-[#1C0770]">0LOPSC-COMMUNITY</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
