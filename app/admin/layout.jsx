"use client";

import { useEffect, useMemo, useState } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FiMenu, FiX } from "react-icons/fi";
import { getAdminSession, clearAdminSession } from "../../lib/adminStorage";
import { poppins } from "../../lib/fonts";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/admin/login";
  const session = getAdminSession();
  const hasSession = Boolean(session?.role && session?.access_token);
  const admin = isLoginPage || !hasSession ? null : session;

  useEffect(() => {
    if (isLoginPage) {
      if (hasSession) {
        router.replace("/admin");
      }
      return;
    }
    if (!hasSession) {
      router.replace("/admin/login");
    }
  }, [hasSession, isLoginPage, router]);

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
      <main className="w-full overflow-x-hidden">{children}</main>
    </div>
  );
}

function AdminHeader({ admin }) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeHash, setActiveHash] = useState("#home");
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    clearAdminSession();
    router.push("/admin/login");
    router.refresh();
  }

  const greetingName =
    admin?.role === "csa_admin"
      ? "Ms. Bobis"
      : admin?.role === "clinic_admin"
      ? "Sir Payte"
      : "Admin";

  const navItems = useMemo(
    () => [
      { label: "Home", href: "#home" },
      { label: "School Dashboard", href: "#admin-dashboard" },
      { label: "Student Reports", href: "#student-reports" },
    ],
    []
  );

  useEffect(() => {
    if (pathname !== "/admin") return;

    const updateActiveSection = () => {
      const scrollY = window.scrollY + 140;

      const home = document.getElementById("home");
      const dashboard = document.getElementById("admin-dashboard");
      const hotlines = document.getElementById("hotlines");
      const studentReports = document.getElementById("student-reports");

      let current = "#home";

      if (
        dashboard &&
        scrollY >= dashboard.offsetTop - 120 &&
        (!hotlines || scrollY < hotlines.offsetTop - 120)
      ) {
        current = "#admin-dashboard";
      } else if (
        hotlines &&
        scrollY >= hotlines.offsetTop - 120 &&
        (!studentReports || scrollY < studentReports.offsetTop - 120)
      ) {
        current = "#hotlines";
      } else if (studentReports && scrollY >= studentReports.offsetTop - 120) {
        current = "#student-reports";
      } else if (
        home &&
        scrollY < (dashboard?.offsetTop ?? Number.POSITIVE_INFINITY) - 120
      ) {
        current = "#home";
      }

      setActiveHash(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1C0770] shadow-sm">
      <div className="w-full px-5 sm:px-6 lg:px-8">
        <div className="flex h-[74px] items-center justify-between">
          <Link href="/admin" className="flex min-w-0 items-center gap-3">
            <img
              src="/olopsclogo.png"
              alt="OLOPSC Logo"
              className="h-11 w-auto shrink-0"
            />

            <div className="min-w-0 leading-tight">
              <div
                className={`${poppins.className} text-[16px] font-extrabold tracking-wide text-white sm:text-[18px]`}
              >
                <span className="text-white">COMM</span>
                <span className="text-[#FFEB00]">UNITY</span>
              </div>

              <div className="truncate text-[12px] text-white/70">
                Student Concern & Incident Reporting
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <nav
              className={`${poppins.className} hidden items-center gap-7 text-sm text-white/80 lg:flex`}
            >
              {navItems.map((item) => {
                const isActive =
                  pathname === "/admin" && activeHash === item.href;

                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className="group relative font-medium text-white/85 transition hover:text-white"
                  >
                    <span
                      className={[
                        "absolute -bottom-2 left-0 h-[2px] bg-[#FFEB00] transition-all duration-300",
                        isActive ? "w-full" : "w-0 group-hover:w-full",
                      ].join(" ")}
                    />
                    {item.label}
                  </a>
                );
              })}
            </nav>

            <a
              href="#hotlines"
              className={[
                "inline-flex h-10 items-center justify-center rounded-2xl border px-5 text-[14px] font-semibold text-white transition-all duration-300",
                activeHash === "#hotlines"
                  ? "border-red-300 bg-red-700"
                  : "border-red-400/40 bg-red-600 hover:-translate-y-1 hover:bg-red-700",
              ].join(" ")}
            >
              Emergency
            </a>

            <span className="hidden text-sm text-white/85 lg:inline">
              Hi, {greetingName}!
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-white/20 lg:inline-flex"
            >
              Log out
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/15 lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        <div
          className={[
            "overflow-hidden transition-all duration-300 lg:hidden",
            mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <div className="pb-5">
            <div className="mt-2 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
              <nav className={`${poppins.className} flex flex-col`}>
                {navItems.map((item) => {
                  const isActive =
                    pathname === "/admin" && activeHash === item.href;

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={[
                        "rounded-xl px-3 py-3 transition",
                        isActive
                          ? "bg-white/14 text-white"
                          : "text-white/90 hover:bg-white/10",
                      ].join(" ")}
                    >
                      {item.label}
                    </a>
                  );
                })}
              </nav>

              <div className="mt-3 h-px bg-white/10" />

              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl border border-white/15 bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  Log out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}