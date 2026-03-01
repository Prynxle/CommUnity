"use client";

import Image from "next/image";
import { useMemo } from "react";
import { encodesans, inter } from "../../lib/fonts";

export default function DesignedForSchool() {
  const cards = useMemo(
    () => [
      {
        title: "Student Concerns",
        desc:
          "Report bullying, harassment, classroom concerns, peer conflicts, or well-being issues—handled with care.",
        img: "/cards/student.jpg",
        alt: "Student concerns",
      },
      {
        title: "Chatbot Assistance",
        desc:
          "Select from pre-empted questions to receive guided assistance and complete your report step by step.",
        img: "/typing.jpg",
        alt: "Chatbot",
      },
      {
        title: "Call for Help",
        desc:
          "Instant connection to campus emergency services for fast response in critical situations.",
        img: "/emergency.jpg",
        alt: "Emergency",
      },
      {
        title: "Case Tracking",
        desc:
          "Transparent case timeline updates to reduce repeated follow-ups and ensure accountability.",
        img: "/cards/tracking.jpg",
        alt: "Case tracking",
      },
    ],
    []
  );

  return (
    <section className="relative w-full py-20">
      {/* ✅ Branded light background (white + blue/yellow) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-white">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-slate-50" />
        <div className="absolute -left-44 top-12 h-[520px] w-[520px] rounded-full bg-[#261CC1]/10 blur-[110px]" />
        <div className="absolute right-[-260px] top-[-120px] h-[620px] w-[620px] rounded-full bg-[#261CC1]/12 blur-[120px]" />
        <div className="absolute left-1/2 top-10 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-[#FFEB00]/22 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <h2 className={`${encodesans.className} text-4xl sm:text-5xl font-semibold text-[#0F172A]`}>
          Designed for a school environment
        </h2>

        <div className="mt-4 h-[5px] w-28 rounded-full bg-[#FFEB00]" />

        <p className={`${inter.className} mt-6 max-w-2xl text-[17px] sm:text-[18px] leading-8 text-[#334155]`}>
          Built around real campus workflows—so students can report with confidence, and staff can respond faster with
          clear, organized context.
        </p>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <SlideRevealCard key={c.title} title={c.title} desc={c.desc} img={c.img} alt={c.alt} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SlideRevealCard({ title, desc, img, alt }) {
  return (
    <div
      className="
        group relative h-[360px] overflow-hidden rounded-[28px]
        border border-[#261CC1]/15 bg-white
        shadow-[0_18px_55px_rgba(15,23,42,.12)]
        transition-transform duration-300
        hover:-translate-y-1
      "
    >
      {/* IMAGE (fixed) */}
      <div className="absolute inset-0">
        <Image
          src={img}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover object-center scale-[1.06]"
          priority={false}
        />

        {/* ✅ soft branded tint */}
        <div className="pointer-events-none absolute -left-14 -top-14 h-52 w-52 rounded-full bg-[#261CC1]/14 blur-[90px]" />
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-52 w-52 rounded-full bg-[#FFEB00]/18 blur-[100px]" />
      </div>

      {/* DEFAULT bottom label */}
      <div
        className="
          absolute inset-x-0 bottom-0
          h-[44%]
          px-6 pb-6 pt-7
          transition-opacity duration-300
          group-hover:opacity-0
        "
      >
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-[#0B1B57]/55 via-[#0B1B57]/20 to-transparent rounded-b-[28px]" />

        <div className="relative">
          <div className={`${encodesans.className} text-[20px] font-semibold text-white`}>
            {title}
          </div>

          <div className={`${inter.className} mt-1 text-[13px] text-white/80`}>
            Learn more details
          </div>

          {/* ✅ small yellow accent line */}
          <div className="mt-4 h-[3px] w-14 rounded-full bg-[#FFEB00]/90" />
        </div>
      </div>

      {/* HOVER PANEL */}
      <div
        className="
          absolute inset-x-0 bottom-0
          h-[72%]
          translate-y-[54%] opacity-0
          transition-all duration-500 ease-out
          group-hover:translate-y-0 group-hover:opacity-100
        "
      >
        {/* ✅ White panel (branded) */}
        <div className="absolute inset-0 bg-white/95 backdrop-blur-xl" />

        {/* ✅ top fade */}
        <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-[#261CC1]/8 to-transparent" />

        <div className="relative flex h-full flex-col justify-end px-6 pb-7">
          {/* ✅ blue micro label */}
          <div className={`${inter.className} text-[11px] font-semibold tracking-[0.22em] text-[#261CC1]/80`}>
            HIGHLIGHT
          </div>

          <div className={`${encodesans.className} mt-2 text-[20px] font-semibold text-[#0F172A]`}>
            {title}
          </div>

          <p className={`${inter.className} mt-3 text-[14px] leading-6 text-[#475569]`}>
            {desc}
          </p>

          {/* ✅ branded divider */}
          <div className="mt-5 flex items-center gap-2">
            <div className="h-[3px] w-10 rounded-full bg-[#261CC1]/50" />
            <div className="h-[3px] w-6 rounded-full bg-[#FFEB00]" />
          </div>
        </div>
      </div>

      {/* ✅ hover ring */}
      <div
        className="
          pointer-events-none absolute inset-0 rounded-[28px]
          opacity-0 transition-opacity duration-300
          group-hover:opacity-100
          ring-2 ring-[#261CC1]/15
        "
        aria-hidden="true"
      />
    </div>
  );
}