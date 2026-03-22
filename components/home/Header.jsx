"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { georama, poppins } from "../../lib/fonts";
import { clearUserProfile, getUserProfile, STORAGE_KEY } from "../../lib/userStorage";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "" });

  const menuRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const activeHash = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined" || pathname !== "/home") return () => {};
      window.addEventListener("hashchange", onStoreChange);
      return () => window.removeEventListener("hashchange", onStoreChange);
    },
    () => {
      if (typeof window === "undefined" || pathname !== "/home") return "";
      return window.location.hash || "#home";
    },
    () => ""
  );

  const greetingName =
    profile.firstName?.trim() ||
    profile.lastName?.trim() ||
    (profile.email ? profile.email.split("@")[0] : "User");

  const emailLabel = profile.email || "user@example.com";
  const getSectionHref = (hash) => (pathname === "/home" ? hash : `/home${hash}`);
  const nav = [
    { label: "Home", href: getSectionHref("#home"), hash: "#home" },
    { label: "Track", href: getSectionHref("#track"), hash: "#track" },
    { label: "Dashboard", href: getSectionHref("#dashboard"), hash: "#dashboard" },
    { label: "Developer Team", href: "/developers" },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadProfile = () => {
      const stored = getUserProfile();
      if (stored) {
        setProfile({
          firstName: stored.firstName ?? "",
          lastName: stored.lastName ?? "",
          email: stored.email ?? "",
        });
      } else {
        setProfile({ firstName: "", lastName: "", email: "" });
      }
    };

    loadProfile();

    const handleStorage = (event) => {
      if (!event.key || event.key === STORAGE_KEY) loadProfile();
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  const handleLogout = () => {
    setMenuOpen(false);
    clearUserProfile();
    setProfile({ firstName: "", lastName: "", email: "" });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-[999]">
      <div className="bg-[#1C0770] border-b border-white/10">
        <div className="w-full px-5 sm:px-6 lg:px-10">
          <div className="flex h-[74px] items-center justify-between">
            <Link href={getSectionHref("")} className="flex items-center gap-3">
              <Image src="/olopsclogo.png" alt="OLOPSC Logo" width={220} height={220} className="h-12 w-auto" />
              <div className="leading-tight">
                <div
                  className={`${georama.className} text-[14px] sm:text-[16px] md:text-[18px] font-extrabold tracking-wide text-white`}
                >
                  OLOPSC<span className="text-[#FFEB00]">-COMMUNITY</span>
                </div>
                <div className="text-[11px] sm:text-[12px] md:text-[14px] text-white/75">
                  Student Concern & Incident Reporting
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-6">
              <nav className={`${poppins.className} hidden md:flex items-center gap-8 text-sm md:text-base text-white/80`}>
                {nav.map((item) => {
                  const isActive =
                    item.href === "/developers"
                      ? pathname === "/developers"
                      : pathname === "/home" && activeHash === item.hash;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group relative font-medium transition text-white/85 hover:text-white"
                    >
                      <span
                        className={[
                          "absolute -bottom-2 left-0 h-[2px] bg-[#FFEB00] transition-all duration-300",
                          isActive ? "w-full" : "w-0 group-hover:w-full",
                        ].join(" ")}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href={getSectionHref("#submit-report")}
                  className={[
                    "group relative overflow-hidden rounded-2xl border border-white/20 h-10 px-5 inline-flex items-center justify-center",
                    "text-[14px] leading-none font-semibold transition-all duration-300",
                    "bg-white/10 text-white hover:-translate-y-1 hover:bg-white/14",
                    "hover:shadow-[0_22px_55px_rgba(0,0,0,0.28)]",
                  ].join(" ")}
                >
                  <span className="relative z-10">Create a Report</span>
                </Link>

                <Link
                  href={getSectionHref("#hotlines")}
                  className={[
                    "group relative overflow-hidden rounded-2xl border border-white/15 h-10 px-5 inline-flex items-center justify-center",
                    "text-[14px] leading-none font-semibold transition-all duration-300",
                    "bg-white text-[#1a138f] hover:-translate-y-1",
                    "shadow-[0_18px_40px_rgba(0,0,0,0.18)] hover:shadow-[0_22px_60px_rgba(0,0,0,0.24)]",
                  ].join(" ")}
                >
                  <span className="relative z-10">Emergency</span>
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                className={[
                  "md:hidden inline-flex items-center justify-center",
                  "h-10 w-10 rounded-xl",
                  "text-white",
                  "transition-all duration-300",
                  "hover:bg-white/15",
                ].join(" ")}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>

              <div className="relative flex items-center gap-2 text-sm" ref={menuRef}>
                <span className="hidden sm:inline text-white/90">Hi, {greetingName}!</span>

                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition hover:bg-white/15"
                >
                  <span className="text-xs">Profile</span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
                    <p className="mb-2 text-xs text-slate-500">Signed in as</p>
                    <p className="mb-3 text-sm font-semibold text-slate-900">{emailLabel}</p>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-100"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div
            className={[
              "md:hidden overflow-hidden transition-all duration-300",
              mobileOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div className="px-4 pb-5 sm:px-6">
              <div className="mt-2 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
                <nav className={`${poppins.className} flex flex-col`}>
                  {nav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-3 py-3 text-white/90 transition hover:bg-white/10"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-3 h-px bg-white/10" />

                <div className="mt-3 flex flex-col gap-2">
                  <Link
                    href={getSectionHref("#submit-report")}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-3 text-white/90 transition hover:bg-white/10"
                  >
                    Create a Report
                  </Link>

                  <Link
                    href={getSectionHref("#hotlines")}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "inline-flex items-center justify-center",
                      "rounded-xl px-3 py-3",
                      "border border-white/25 bg-white/10",
                      "text-sm font-semibold text-white",
                      "transition-all duration-300",
                      "hover:bg-white/15",
                    ].join(" ")}
                  >
                    Emergency
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
