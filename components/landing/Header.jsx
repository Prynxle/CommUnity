"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { georama } from "../../lib/fonts";

export default function Header({ hideHero = false }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const homeHref = pathname === "/landingpage" ? "#home" : "/landingpage";

  const nav = useMemo(
    () => [
      { label: "Home", href: homeHref },
      { label: "About Us", href: "/landingpage/aboutus" },
      { label: "SDG", href: "/landingpage/sdg" }
    ],
    [homeHref]
  );

  useEffect(() => {
    const onResize = () => window.innerWidth >= 1024 && setMobileOpen(false);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const smoothScroll = (href) => (e) => {
    if (!href?.startsWith("#")) return;
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 88; // account for fixed navbar
    window.scrollTo({ top: y, behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header id="top" className="relative overflow-hidden">
      {/* Background */}
      {!hideHero && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-[url('/olopscLogo1.jpg')] bg-cover bg-center bg-no-repeat"
            aria-hidden="true" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/60" />
        </div>
      )}

      {/* NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#1C0770]">
        <div className="w-full px-5 sm:px-6 lg:px-10">
          <div className="flex h-[74px] items-center justify-between">
            <Link href="/landingpage" className="flex items-center gap-3">
              <Image src="/olopsclogo.png" alt="OLOPSC Logo" width={220} height={220} className="h-12 w-auto" />
              <div className="leading-tight">
                <div
                  className={`${georama.className} text-[14px] sm:text-[16px] md:text-[18px] font-extrabold tracking-wide text-white`}
                >
                  Comm-<span className="text-[#FFEB00]">Unity</span>
                </div>
                <div className="text-[11px] sm:text-[12px] md:text-[14px] text-white/75">
                   Incident Reporting System
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3 lg:gap-6">
              <nav className="hidden lg:flex items-center gap-8 text-sm md:text-base text-white/80">
                {nav.map((item) =>
                  item.href.startsWith("/") ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group relative font-medium text-white/85 hover:text-white"
                    >
                      <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-[#FFEB00] transition-all duration-300 group-hover:w-full" />
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={smoothScroll(item.href)}
                      className="group relative font-medium text-white/85 hover:text-white"
                    >
                      <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-[#FFEB00] transition-all duration-300 group-hover:w-full" />
                      {item.label}
                    </a>
                  )
                )}
              </nav>

              <div className="hidden lg:flex items-center gap-6 text-sm md:text-base text-white/80">
                <Link href="/login" className="group relative font-medium text-white/85 hover:text-white">
                  <span className="absolute -bottom-2 left-0 h-[2px] w-0 bg-[#FFEB00] transition-all duration-300 group-hover:w-full" />
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center justify-center h-9 px-4 rounded-xl border border-white/25 bg-white/10 text-[14px] font-semibold text-white transition-all duration-300 hover:bg-white/15 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(0,0,0,0.22)]"
                >
                  Sign Up
                </Link>
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden inline-flex items-center justify-center h-10 w-10 rounded-xl text-white hover:bg-white/15"
              >
                {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (Home / SDG / Sign in / Sign up) */}
      {mobileOpen && (
        <div className="lg:hidden fixed top-[74px] left-0 right-0 z-40 border-b border-white/15 bg-[#1C0770]">
          <div className="px-4 pb-4 pt-3 space-y-4">
            <nav className="flex flex-col gap-2 text-sm text-white/85">
              {nav.map((item) =>
                item.href.startsWith("/") ? (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="block rounded-lg px-2 py-2 font-medium hover:bg-white/10"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    key={item.href}
                    type="button"
                    onClick={smoothScroll(item.href)}
                    className="text-left block w-full rounded-lg px-2 py-2 font-medium hover:bg-white/10"
                  >
                    {item.label}
                  </button>
                )
              )}
            </nav>

            <div className="h-px bg-white/15" />

            <div className="flex flex-col gap-2 text-sm text-white/85">
              <Link
                href="/login"
                className="block rounded-lg px-2 py-2 font-medium hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg px-3 py-2 font-semibold border border-white/25 bg-white/10 text-[14px] text-white hover:bg-white/15"
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      {!hideHero && (
        <>
          <section className="mx-auto max-w-6xl px-10 sm:px-9" id="home">
            <div className="flex min-h-[calc(100vh-74px)] items-center justify-center text-center pt-[82px] pb-10 sm:pt-[90px]">
              <div className="max-w-3xl">
                <h1 className="text-[32px] sm:text-[46px] lg:text-[64px] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
                  Empowering every{" "}
                  <span className="text-[#FFEB00]">voice.</span>
                  <br />
                  Strengthening every{" "}
                  <span className="text-[#FFEB00]">future.</span>
                </h1>

                <p className="mt-4 sm:mt-6 mx-auto max-w-[34rem] text-[15px] sm:text-[18px] leading-7 sm:leading-8 text-white/90">
                  Speak up with confidence—your concerns matter, and your voice helps
                  create a safer, stronger school community. Report, track, and get
                  support in one place.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white border border-white/20 bg-gradient-to-r from-[#2F5BFF] to-[#261CC1] transition hover:-translate-y-1"
                  >
                    Get Started →
                  </Link>

                  <button
                    type="button"
                    onClick={smoothScroll("#designed")}
                    className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-6 py-3 text-[15px] font-semibold text-white border border-white/25 bg-white/10 backdrop-blur-sm transition hover:-translate-y-1"
                  >
                    Learn more
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section id="sdg" className="mx-auto max-w-6xl px-4 py-20 text-white/80" />
        </>
      )}
    </header>
  );
}