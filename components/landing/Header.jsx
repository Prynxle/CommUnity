"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  return (
    <header id="top" className="relative overflow-hidden">
      {/* Background */}
      {!hideHero && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-[url('/olopsc.jpg')] bg-cover bg-center bg-no-repeat"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/60" />
        </div>
      )}

      {/* NAVBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#1C0770]">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex h-[74px] items-center justify-between">
            <Link href="/landingpage" className="flex items-center gap-3">
              <img src="/olopsclogo.png" alt="OLOPSC Logo" className="h-12 w-auto" />
              <div className="leading-tight">
                <div
                  className={`${georama.className} text-[14px] sm:text-[16px] md:text-[18px] font-extrabold tracking-wide text-white`}
                >
                  OLOPSC<span className="text-[#FFEB00]">-COMMUNITY</span>
                </div>
                <div className="text-[11px] sm:text-[12px] md:text-[14px] text-white/75">
                  Student Concern &amp; Incident Reporting
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

      {/* HERO */}
      {!hideHero && (
        <>
          <section className="mx-auto max-w-6xl px-4" id="home">
            <div className="flex min-h-[calc(100vh-74px)] items-center justify-center text-center pt-[74px]">
              <div className="max-w-3xl">
                <h1 className="text-[40px] sm:text-[52px] lg:text-[70px] font-semibold leading-[1.08] tracking-[-0.02em] text-white">
                  Empowering every{" "}
                  <span className="text-[#FFEB00]">voice.</span>
                  <br />
                  Strengthening every{" "}
                  <span className="text-[#FFEB00]">standard.</span>
                </h1>

                <p className="mt-6 mx-auto max-w-[60ch] text-[16px] sm:text-[20px] leading-8 text-white/90">
                  Speak up with confidence—your concerns matter, and your voice helps
                  create a safer, stronger school community. Report, track, and get
                  support in one place.
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                  <button className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold text-white border border-white/20 bg-gradient-to-r from-[#2F5BFF] to-[#261CC1] transition hover:-translate-y-1">
                    Get Started →
                  </button>

                  <button className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[15px] font-semibold text-white border border-white/25 bg-white/10 backdrop-blur-sm transition hover:-translate-y-1">
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