"use client";

import Header from "../../../components/landing/Header.jsx";
import SdgDevFooter from "../../../components/landing/Footer.jsx";

export default function SDGPage() {
  return (
    <div className="min-h-screen w-full text-slate-900 flex flex-col overflow-hidden bg-[#F8FAFF]">
      {/* ✅ Subtle light-mode background (same vibe as your site) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
        <div className="absolute -left-64 top-20 h-[520px] w-[520px] rounded-full bg-[#261CC1]/10 blur-[140px]" />
        <div className="absolute right-[-220px] top-10 h-[520px] w-[520px] rounded-full bg-[#261CC1]/10 blur-[140px]" />
        <div className="absolute left-1/2 top-48 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#FFEB00]/15 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,23,42,0.06),transparent_55%)]" />
      </div>

      {/* Navbar */}
      <Header hideHero={true} />

      {/* ✅ CONTENT (add space below fixed navbar) */}
      <main className="flex-1 pt-[110px] sm:pt-[50px]">
        <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
          <div className="max-w-full">
            <h1 className="text-[34px] sm:text-[42px] lg:text-[50px] font-semibold leading-[1.05] tracking-[-0.02em] text-slate-900 lg:whitespace-nowrap">
              Sustainable Development Goals
            </h1>

            <div className="mt-4 h-[5px] w-28 rounded-full bg-[#FFEB00]" />

            <p className="mt-5 text-[14px] sm:text-[18px] lg:text-[18px] leading-7 text-slate-600 lg:whitespace-nowrap">
              How OLOPSC-Community supports innovation, sustainable communities, and stronger institutions.
            </p>
          </div>

          {/* Cards grid */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            {/* LEFT CARD */}
            <div className="rounded-[28px] border border-[#D7E0FF] bg-white shadow-[0_18px_55px_rgba(15,23,42,.10)] overflow-hidden">
              <div className="p-7 sm:p-9">
                <div className="text-[14px] font-bold tracking-[0.18em] text-[#0B1B57]">SDG 9</div>
                <h2 className="mt-2 text-[22px] sm:text-[26px] font-semibold text-slate-900">
                  Industry, Innovation, and Infrastructure
                </h2>
                <p className="mt-4 text-[15px] sm:text-[16px] leading-7 text-slate-600">
                  The CommUnity system supports SDG 9 by integrating digital technology into local governance.
                  Features like online document inquiries, email notifications, and report tracking modernize
                  barangay operations, leading to faster, more efficient procedures. By enhancing local
                  infrastructure and providing universal access to public services, CommUnity showcases the
                  power of innovation in strengthening governance.
                </p>

                <div className="mt-7 h-[3px] w-14 rounded-full bg-[#2563EB]" />
              </div>
            </div>

            {/* RIGHT COLUMN (two cards) */}
            <div className="grid gap-6">
              <div className="rounded-[28px] border border-[#D7E0FF] bg-white shadow-[0_18px_55px_rgba(15,23,42,.10)] overflow-hidden">
                <div className="p-7 sm:p-9">
                  <div className="text-[14px] font-bold tracking-[0.18em] text-[#0B1B57]">SDG 11</div>
                  <h2 className="mt-2 text-[22px] sm:text-[26px] font-semibold text-slate-900">
                    Sustainable Cities and Communities
                  </h2>
                  <p className="mt-4 text-[15px] sm:text-[16px] leading-7 text-slate-600">
                    CommUnity advances SDG 11 by fostering cleaner, safer, and more organized communities.
                    Its user-friendly portal enables residents to easily report issues like broken lighting and
                    damaged public areas, ensuring swift resolution. By encouraging active citizen participation,
                    CommUnity connects local leaders and residents, promoting a more sustainable and efficiently
                    managed community.
                  </p>

                  <div className="mt-7 h-[3px] w-14 rounded-full bg-[#FFEB00]" />
                </div>
              </div>

              <div className="rounded-[28px] border border-[#D7E0FF] bg-white shadow-[0_18px_55px_rgba(15,23,42,.10)] overflow-hidden">
                <div className="p-7 sm:p-9">
                  <div className="text-[14px] font-bold tracking-[0.18em] text-[#0B1B57]">SDG 16</div>
                  <h2 className="mt-2 text-[22px] sm:text-[26px] font-semibold text-slate-900">
                    Peace, Justice, and Strong Institutions
                  </h2>
                  <p className="mt-4 text-[15px] sm:text-[16px] leading-7 text-slate-600">
                    The CommUnity system advances SDG 16 by strengthening trust between locals and barangay
                    authorities. It simplifies reporting and tracking, promotes accountability and transparency,
                    and enhances decision-making. With improved communication and reduced delays, CommUnity
                    fosters greater civic participation—contributing to a more equitable and responsive local
                    government.
                  </p>

                  <div className="mt-7 h-[3px] w-14 rounded-full bg-[#2563EB]" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SdgDevFooter className="shrink-0" />
    </div>
  );
}