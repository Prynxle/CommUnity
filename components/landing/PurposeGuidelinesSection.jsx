"use client";

import React, { useMemo, useState, useRef, useLayoutEffect, useEffect } from "react";
import { encodesans } from "../../lib/fonts";

export default function PurposeGuidelinesSection() {
  const tabs = useMemo(
    () => [
      { key: "guidelines", label: "Guidelines" },
      { key: "confidentiality", label: "Confidentiality" },
      { key: "emergencies", label: "Emergencies" },
    ],
    []
  );

  const [active, setActive] = useState("emergencies");

  const content = useMemo(
    () => ({
      guidelines: {
        title: "Guidelines",
        items: [
          {
            title: "Be clear and specific",
            desc: "Include what happened, where it occurred, and who was involved (if known).",
          },
          {
            title: "Use respectful language",
            desc: "Reports are handled by staff—keep details factual and avoid harmful wording.",
          },
          {
            title: "Attach helpful evidence",
            desc: "Screenshots, photos, and dates help staff verify and respond faster.",
          },
          {
            title: "Follow up in the system",
            desc: "Check status updates instead of creating duplicate reports for the same concern.",
          },
        ],
      },
      confidentiality: {
        title: "Confidentiality",
        items: [
          {
            title: "Privacy-aware handling",
            desc: "Access to reports is limited to authorized school personnel.",
          },
          {
            title: "Optional anonymity",
            desc: "For sensitive concerns, anonymous reporting may be available (based on policy).",
          },
          {
            title: "Protected information",
            desc: "Only necessary details are collected to support a fair and safe response.",
          },
          {
            title: "Responsible use",
            desc: "False reporting may lead to disciplinary action under school rules.",
          },
        ],
      },
      emergencies: {
        title: "Emergencies",
        items: [
          {
            title: "Immediate danger?",
            desc: "Contact campus security or emergency hotlines first before submitting a report.",
          },
          {
            title: "Medical concerns",
            desc: "Seek the clinic/first responder support immediately, then document in the system.",
          },
          {
            title: "Threats or violence",
            desc: "Report urgently to authorized personnel and follow safety protocols.",
          },
          {
            title: "After action",
            desc: "Use the system to document details for follow-up and case resolution.",
          },
        ],
      },
    }),
    []
  );

  // underline/indicator that matches the active tab button width
  const tabRefs = useRef({});
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useLayoutEffect(() => {
    const el = tabRefs.current[active];
    if (!el) return;

    const parent = el.parentElement;
    if (!parent) return;

    const parentRect = parent.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    setIndicator({
      left: rect.left - parentRect.left,
      width: rect.width,
    });
  }, [active]);

  // reveal-on-scroll (slide up + fade in)
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.18 }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="guidelines"
      ref={sectionRef}
      className={[
        "relative overflow-hidden py-16",
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10",
      ].join(" ")}
    >
      {/* ✅ BACKGROUND: solid/light (NO ombre) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#F8FAFF]" />

      <div className="mx-auto w-full max-w-6xl px-4">
        {/* Header */}
        <div className="max-w-3xl">
          <div className="mx-auto max-w-6xl px-4">
            <h2
              className={[
                encodesans.className,
                "font-semibold text-[#0F172A]",
                // ✅ responsive sizing
                "text-[clamp(1.6rem,4.2vw,3rem)]",
                // ✅ wrap on small screens, force one line on bigger screens
                "whitespace-normal md:whitespace-nowrap",
                // ✅ prevent ugly cut
                "break-words",
              ].join(" ")}
            >
              Our Purpose &amp; Reporting Guidelines
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="mt-4 h-[5px] w-28 rounded-full bg-[#FFEB00]" />
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.25fr_.95fr]">
          {/* LEFT */}
          <div className="grid gap-6">
            <InfoCard
              variant="vision"
              eyebrow="OUR VISION"
              icon={<VisionIcon />}
              title="A safer, more supportive school community."
              desc="Where concerns are heard early and addressed with care, consistency, and accountability."
              chips={["Safety-first", "Supportive culture", "Accountable follow-up"]}
            />

            <InfoCard
              variant="mission"
              eyebrow="OUR MISSION"
              icon={<MissionIcon />}
              title="A structured, student-friendly way to report and resolve concerns."
              desc="Helping schools document issues, coordinate responses, and protect student welfare responsibly."
              chips={["Clear workflow", "Faster response", "Student wellbeing"]}
            />
          </div>

          {/* RIGHT (OMBREEEEE REMOVED) */}
          <div
            className="
              group relative overflow-hidden rounded-[34px]
              border border-[#D7E0FF] bg-white
              shadow-[0_22px_70px_rgba(15,23,42,.12)]
              transition-transform duration-300
              hover:-translate-y-1
            "
          >
            {/* Tabs (pill + sliding indicator) */}
            <div className="relative border-b border-[#261CC1]/12 bg-[#261CC1] px-5 pt-5">
              <div className="relative inline-flex items-center gap-1 rounded-full border border-[#261CC1]/15 bg-white p-1 shadow-[0_12px_28px_rgba(15,23,42,.10)]">
                {tabs.map((t) => {
                  const isActive = active === t.key;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setActive(t.key)}
                      ref={(node) => {
                        if (node) tabRefs.current[t.key] = node;
                      }}
                      className={[
                        "relative z-10 rounded-full px-4 py-2.5 text-[15px] sm:text-[16px] font-semibold transition-colors duration-300",
                        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFEB00]/40",
                        isActive ? "text-[#0B1B57]" : "text-slate-500 hover:text-slate-800",
                      ].join(" ")}
                      aria-pressed={isActive}
                    >
                      {t.label}
                    </button>
                  );
                })}

                <div
                  className="
    pointer-events-none absolute top-1 bottom-1 rounded-full
    bg-[#FFEB00]
    shadow-[0_8px_18px_rgba(255,235,0,.25)]
    ring-1 ring-[#FFEB00]/60
    transition-all duration-300
  "
                  style={{
                    left: indicator.left,
                    width: indicator.width,
                  }}
                />
              </div>

              <div className="mt-4 h-px bg-[#261CC1]/10" />
            </div>

            <div className="p-6 sm:p-7">
              <h3 className="text-[22px] sm:text-[26px] font-semibold text-slate-900">
                {content[active].title}
              </h3>

              <div className="mt-5 grid gap-4">
                {content[active].items.map((it) => (
                  <GuidelineItem key={it.title} title={it.title} desc={it.desc} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * ✅ Left cards now match the “School Updates” style:
 * - White card
 * - Left accent bar (Vision = yellow, Mission = blue)
 * - Clean border + shadow
 */
function InfoCard({ variant = "vision", eyebrow, icon, title, desc, chips = [] }) {
  const accentBar = variant === "mission" ? "bg-[#1D4ED8]" : "bg-[#FFEB00]";

  const iconColor = variant === "mission" ? "text-[#1D4ED8]" : "text-[#CA8A04]";
  const iconBg = variant === "mission" ? "bg-[#EEF2FF]" : "bg-[#FFF7CC]";
  const chipDot = variant === "mission" ? "bg-[#2563EB]" : "bg-[#FFEB00]";
  const bottomLine = variant === "mission" ? "bg-[#2563EB]" : "bg-[#FFEB00]";

  return (
    <div
      className="
        group relative overflow-hidden rounded-[28px]
       border border-[#D7E0FF]
        shadow-[0_18px_55px_rgba(15,23,42,.10)]
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,.14)]
      "
    >
      {/* left accent bar */}
      <div className={`pointer-events-none absolute left-0 top-0 h-full w-[6px] ${accentBar}`} />

      <div className="p-9 sm:p-10">
        {/* top row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={[
                "grid h-12 w-12 place-items-center rounded-2xl",
                iconBg,
                "ring-1 ring-[#D7E0FF]",
              ].join(" ")}
              aria-hidden="true"
            >
              <span className={["grid place-items-center", iconColor].join(" ")}>{icon}</span>
            </div>

            <div className="text-[14px] sm:text-[15px] font-bold tracking-[0.18em] text-[#0B1B57]">
              {eyebrow}
            </div>
          </div>
        </div>

        {/* content */}
        <div className="mt-6 text-[21px] sm:text-[23px] font-semibold leading-[1.25] text-slate-900">
          {title}
        </div>
        <p className="mt-4 text-[15px] sm:text-[16px] leading-7 text-slate-600">{desc}</p>

        {!!chips.length && (
          <div className="mt-6 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span
                key={c}
                className="
                  inline-flex items-center gap-2 rounded-full
                  bg-white px-4 py-2 text-[13px] text-slate-700
                  ring-1 ring-[#BBD0FF]
                  shadow-[0_10px_18px_rgba(15,23,42,.06)]
                  transition
                  group-hover:ring-[#93B2FF]
                "
              >
                <span className={["h-1.5 w-1.5 rounded-full", chipDot].join(" ")} />
                {c}
              </span>
            ))}
          </div>
        )}

        {/* bottom accent line */}
        <div className="mt-7">
          <div className={["h-[3px] w-14 rounded-full", bottomLine].join(" ")} />
        </div>
      </div>
    </div>
  );
}

function GuidelineItem({ title, desc }) {
  return (
    <div
      className="
        group rounded-2xl
        border border-[#D7E0FF]
        bg-white
        p-5
        shadow-[0_12px_30px_rgba(15,23,42,.08)]
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-[#BBD0FF]
        hover:shadow-[0_18px_44px_rgba(15,23,42,.12)]
      "
    >
      <div>
        <div className="text-[16px] sm:text-[17px] font-semibold text-slate-900">
          {title}
        </div>
        <div className="mt-2 text-[14px] sm:text-[15px] leading-7 text-slate-600">
          {desc}
        </div>
      </div>
    </div>
  );
}

/* Icons */
function VisionIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MissionIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22s7-4.4 7-11V6.8L12 3 5 6.8V11c0 6.6 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.2 12.1 11 13.9l3.8-4.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}