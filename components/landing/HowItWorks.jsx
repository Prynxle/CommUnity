"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { worksans, encodesans } from "../../lib/fonts";

export default function HowItWorks() {
  const steps = useMemo(
    () => [
      {
        title: "Submit a Report",
        Icon: ReportIcon,
        popover: (
          <div className="space-y-2">
            <div className="font-semibold text-slate-900">How to submit:</div>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Choose a category (bullying, facilities, peer conflict, etc.).</li>
              <li>Add what happened, where, when, and who was involved (if known).</li>
              <li>Attach evidence if available (photo, screenshot, note).</li>
              <li>Review details and submit securely.</li>
            </ul>
          </div>
        ),
      },
      {
        title: "Receive Confirmation",
        Icon: ConfirmIcon,
        popover: (
          <div className="text-slate-600 leading-relaxed">
            After you submit, the report is marked as{" "}
            <span className="text-slate-900 font-medium">Received</span>. You’ll get a confirmation in
            the system once staff has logged your report for review.
          </div>
        ),
      },
      {
        title: "Track Case Status",
        Icon: TrackIcon,
        popover: (
          <div className="text-slate-600 leading-relaxed">
            Track updates like <span className="text-slate-900 font-medium">Received</span>,{" "}
            <span className="text-slate-900 font-medium">Under Review</span>, and{" "}
            <span className="text-slate-900 font-medium">Resolved</span>. This helps reduce repeated
            follow-ups and keeps everything transparent.
          </div>
        ),
      },
      {
        title: "Get Updates",
        Icon: UpdatesIcon,
        popover: (
          <div className="text-slate-600 leading-relaxed">
            You’ll receive in-app updates (and email if enabled) whenever the status changes—so you stay
            informed until the concern is resolved.
          </div>
        ),
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(null);
  const popoverRefs = useRef([]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRefs.current.some((ref) => ref && ref.contains(e.target))) return;
      setActiveIndex(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopover = (index) => setActiveIndex((prev) => (prev === index ? null : index));

  return (
    <section className="relative py-28 text-slate-900">
      {/* LIGHT MODE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
        <div className="absolute -left-64 top-14 h-[520px] w-[520px] rounded-full bg-[#2B2BFF]/10 blur-[120px]" />
        <div className="absolute right-[-220px] top-8 h-[520px] w-[520px] rounded-full bg-[#2B2BFF]/10 blur-[120px]" />
        <div className="absolute left-1/2 top-32 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#FFEB00]/18 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(15,23,42,0.06),transparent_55%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-4">
              <h2 className={`${encodesans.className} text-center text-4xl sm:text-5xl font-semibold text-[#0F172A]`}>
                How it works
              </h2>

        {/* centered underline */}
        <div className="mx-auto mt-4 h-[5px] w-28 rounded-full bg-[#FFEB00]" />
      </div>

      {/* STEPS */}
      <div className="mx-auto mt-16 max-w-6xl px-4">
        <div className="flex flex-col items-center justify-center gap-10 md:flex-row md:gap-12">
          {steps.map((step, index) => (
            <Step
              key={step.title}
              step={step}
              index={index}
              activeIndex={activeIndex}
              togglePopover={togglePopover}
              popoverRefs={popoverRefs}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>

      <div className="h-16 md:h-20" aria-hidden="true" />

      <style jsx>{`
        .animate-pop {
          animation: pop 0.22s ease-out;
        }
        @keyframes pop {
          from {
            opacity: 0;
            transform: translate(-50%, -8px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0px);
          }
        }
      `}</style>
    </section>
  );
}

function Step({ step, index, activeIndex, togglePopover, popoverRefs, isLast }) {
  const isActive = activeIndex === index;
  const Icon = step.Icon;

  return (
    <div className="flex items-center">
      <div className="relative flex flex-col items-center">
        <button
          type="button"
          onClick={() => togglePopover(index)}
          className={[
            "group relative grid h-20 w-20 place-items-center rounded-full",
            "border border-slate-200 bg-white",
            "shadow-[0_10px_25px_rgba(0,0,0,0.08)]",
            "transition-all duration-300 ease-out",
            "hover:-translate-y-2 hover:scale-105",
            "hover:border-blue-500",
            "hover:shadow-[0_15px_40px_rgba(37,99,235,0.25)]",
            isActive ? "ring-4 ring-blue-200 border-blue-500 shadow-[0_15px_45px_rgba(37,99,235,0.35)]" : "",
          ].join(" ")}
          aria-expanded={isActive}
          aria-controls={`how-step-${index}`}
        >
          <span className="absolute inset-0 rounded-full bg-blue-50 scale-0 transition-transform duration-300 group-hover:scale-100" />

          <span
            className={[
              "relative z-10 transition-all duration-300",
              "text-slate-700 group-hover:text-slate-900",
              "group-hover:scale-110",
              isActive ? "text-slate-900" : "",
            ].join(" ")}
          >
            <Icon />
          </span>
        </button>

        <p className={`${worksans.className} mt-3 text-center text-[15px] text-slate-700`}>{step.title}</p>

        {isActive && (
          <div
            id={`how-step-${index}`}
            ref={(el) => (popoverRefs.current[index] = el)}
            className={[
              "animate-pop absolute top-[110%] left-1/2 -translate-x-1/2",
              "w-[300px] sm:w-[340px]",
              "rounded-2xl border border-slate-200",
              "bg-white",
              "p-5 shadow-[0_20px_60px_rgba(0,0,0,0.15)]",
              "z-50",
            ].join(" ")}
          >
            <div className="relative text-sm">{step.popover}</div>
          </div>
        )}
      </div>

      {!isLast && (
        <div className="hidden items-center md:flex ml-6">
          <div className="h-[2px] w-28 bg-blue-400" />
          <div className="ml-3 h-2.5 w-2.5 rotate-45 bg-blue-500" />
        </div>
      )}
    </div>
  );
}

/* ICONS */
function ReportIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h7l3 3v15H7V3z" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M9.5 10.5h6M9.5 14h6M9.5 17.5h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ConfirmIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M22 11.5V12a10 10 0 1 1-6.2-9.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M22 4 12 14l-3-3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrackIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h10M4 12h16M4 18h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M15 6l1.5 1.5L19 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 18l1.5 1.5L13 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UpdatesIcon() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22a2.2 2.2 0 0 0 2.2-2.2H9.8A2.2 2.2 0 0 0 12 22Z"
        fill="currentColor"
        opacity="0.9"
      />
      <path
        d="M18 9a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}