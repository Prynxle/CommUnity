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
    { label: "Meet The Team", href: "/developers" },
  ];

  const profileInitial =
    (profile.firstName?.trim()?.[0] ||
      profile.lastName?.trim()?.[0] ||
      profile.email?.trim()?.[0] ||
      "U").toUpperCase();

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
    if (typeof window === "undefined") return;

    const sections = ["home", "track", "submit-report", "hotlines"];

    const updateActiveSection = () => {
      const scrollY = window.scrollY + 140;
      let current = "#home";

      for (const id of sections) {
        const element = document.getElementById(id);
        if (!element) continue;

        const top = element.offsetTop;
        const bottom = top + element.offsetHeight;

        if (scrollY >= top && scrollY < bottom) {
          current = `#${id}`;
        }
      }

      setActiveHash((prev) => (prev !== current ? current : prev));
    };

    updateActiveSection();

    window.addEventListener("scroll", updateActiveSection);
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("hashchange", updateActiveSection);
    };
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
    setMobileOpen(false);
    clearUserProfile();
    setProfile({ firstName: "", lastName: "", email: "" });
    router.push("/login");
  };

  const nav = useMemo(
    () => [
      { label: "Home", href: "#home" },
      { label: "Track", href: "#track" },
      { label: "Create a Report", href: "#submit-report" },
      { label: "Emergency", href: "#hotlines" },
    ],
    []
  );

  return (
    <header className="sticky top-0 z-[999]">
      <div className="border-b border-white/10 bg-[#1C0770]">
        <div className="w-full px-5 sm:px-6 lg:px-10">
          <div className="flex h-[74px] items-center justify-between">
            <a href="#home" className="flex min-w-0 items-center gap-3">
              <img src="/olopsclogo.png" alt="OLOPSC Logo" className="h-12 w-auto shrink-0" />
              <div className="min-w-0 leading-tight">
                <div
                  className={`${georama.className} text-[14px] font-extrabold tracking-wide text-white sm:text-[16px] md:text-[18px]`}
                >
                  <span className="text-white">COMM</span>
                  <span className="text-[#FFEB00]">UNITY</span>
                </div>
                <div className="truncate text-[11px] text-white/75 sm:text-[12px] md:text-[14px]">
                  Student Concern & Incident Reporting
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-5">
              <nav
                className={`${poppins.className} hidden items-center gap-8 text-sm text-white/80 md:flex md:text-base`}
              >
                {nav
                  .filter((item) => item.href === "#home" || item.href === "#track")
                  .map((item) => {
                    const isActive = activeHash === item.href;

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

              <div className="hidden items-center gap-4 sm:flex">
                <a
                  href="#submit-report"
                  className={[
                    "group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-2xl border px-5",
                    "text-[14px] font-semibold transition-all duration-300",
                    activeHash === "#submit-report"
                      ? "border-[#FFEB00]/45 bg-white/18 text-white -translate-y-1 shadow-[0_20px_45px_rgba(255,235,0,0.12)]"
                      : "border-white/20 bg-white/10 text-white hover:-translate-y-1 hover:bg-white/14",
                  ].join(" ")}
                >
                  <span className="relative z-10">Create a Report</span>
                </a>
              </div>
              <a
                href="#hotlines"
                className={[
                  "group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-2xl border px-5",
                  "text-[14px] font-semibold text-white transition-all duration-300",
                  activeHash === "#hotlines"
                    ? "border-red-300 bg-red-700 -translate-y-1 shadow-[0_20px_45px_rgba(239,68,68,0.24)]"
                    : "border-red-400/40 bg-red-600 hover:-translate-y-1 hover:bg-red-700",
                ].join(" ")}
              >
                <span className="relative z-10">Emergency</span>
              </a>

              <div className="relative hidden items-center gap-2 text-sm sm:flex" ref={menuRef}>
                <span className="hidden text-white/90 sm:inline">Hi, {greetingName}!</span>

                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[#FFEB00]/30 bg-gradient-to-br from-white/15 via-white/10 to-[#FFEB00]/10 text-white shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition hover:-translate-y-0.5 hover:border-[#FFEB00]/50"
                >
                  <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,235,0,0.18),transparent_60%)]" />
                  <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#FFEB00] text-[12px] font-bold text-[#1C0770]">
                    {profileInitial}
                  </span>
                </button>

                {menuOpen && (
                  <div className="absolute right-0 top-full mt-4 w-[300px] overflow-hidden rounded-[26px] border border-white/15 bg-[#1C0770] shadow-[0_20px_55px_rgba(10,6,40,0.45)]">
                    <div className="p-5">
                      <p className="mb-2 text-[12px] uppercase tracking-wider text-white/60">
                        Signed in as
                      </p>

                      <div className="mb-4 rounded-xl border border-white/10 bg-white/10 px-3 py-3">
                        <p className="break-words text-sm font-semibold text-white">
                          {emailLabel}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full rounded-xl border border-[#FFEB00]/40 bg-[#FFEB00] py-2.5 text-sm font-semibold text-[#1C0770] transition hover:brightness-95"
                      >
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/15 md:hidden"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>

          <div
            className={[
              "overflow-hidden transition-all duration-300 md:hidden",
              mobileOpen ? "max-h-[620px] opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div className="px-4 pb-5 sm:px-6">
              <div className="mt-2 rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur-xl">
                <div className="mb-3 rounded-2xl border border-white/10 bg-white/10 p-3">
                  <div className="flex items-center gap-3">
                    <div className="group relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#FFEB00]/30 bg-gradient-to-br from-white/15 via-white/10 to-[#FFEB00]/10 text-white shadow-[0_8px_20px_rgba(0,0,0,0.25)]">
                      <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,235,0,0.18),transparent_60%)]" />
                      <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#FFEB00] text-[12px] font-bold text-[#1C0770]">
                        {profileInitial}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        Hi, {greetingName}!
                      </p>
                      <p className="break-all text-xs text-white/70">{emailLabel}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-3 w-full rounded-xl border border-white/15 bg-white/10 py-2.5 text-sm font-semibold text-white transition hover:bg-white/15"
                  >
                    Log out
                  </button>
                </div>

                <nav className={`${poppins.className} flex flex-col`}>
                  {nav
                    .filter((item) => item.href === "#home" || item.href === "#track")
                    .map((item) => {
                      const isActive = activeHash === item.href;

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
                  <Link
                    href={getSectionHref("#submit-report")}
                    onClick={() => setMobileOpen(false)}
                    className={[
                      "rounded-xl px-3 py-3 text-center transition",
                      activeHash === "#submit-report"
                        ? "bg-white/14 text-white"
                        : "text-white/90 hover:bg-white/10",
                    ].join(" ")}
                  >
                    Create a Report
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
