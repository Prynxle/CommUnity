"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { georama } from "../../lib/fonts";
import { FiArrowRight, FiMessageCircle, FiX, FiAlertTriangle } from "react-icons/fi";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState("");

  const quickActions = useMemo(
    () => [
      {
        label: "Emergency: Campus Security",
        text: "Emergency: I need campus security assistance.",
        kind: "emergency",
      },
      {
        label: "Emergency: Clinic / Nurse",
        text: "Emergency: I need the clinic/nurse hotline.",
        kind: "emergency",
      },
      { label: "How do I submit a report?", text: "How do I submit a report?", kind: "faq" },
      { label: "How do I track my report?", text: "How do I track my report?", kind: "faq" },
      { label: "Can I report anonymously?", text: "Can I report anonymously?", kind: "faq" },
      { label: "What details should I include?", text: "What details should I include in a report?", kind: "faq" },
      { label: "Where is the emergency button?", text: "Where is the emergency button?", kind: "faq" },
      { label: "Who sees my report?", text: "Who can see my report?", kind: "faq" },
    ],
    []
  );

  const handleQuickAction = (text) => {
    setSelectedPrompt(text);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={[
            "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] pointer-events-auto",
            "group grid place-items-center",
            "h-14 w-14 rounded-full",
            "bg-gradient-to-b from-[#2F5BFF] to-[#261CC1]",
            "text-white",
            "shadow-[0_18px_55px_rgba(38,28,193,0.22)]",
            "transition-all duration-300",
            "hover:-translate-y-1 hover:shadow-[0_22px_70px_rgba(38,28,193,0.30)]",
            "active:translate-y-0",
          ].join(" ")}
          aria-label="Open OLOPSC UniGuide"
        >
          <FiMessageCircle size={22} />
        </button>
      )}

      {isOpen && (
        <div
          className={[
            "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] pointer-events-auto",
            "w-[calc(100vw-2rem)] max-w-[390px] sm:w-[390px]",
            "max-h-[calc(100vh-7rem)]",
            "overflow-hidden rounded-[28px] bg-white",
            "shadow-[0_24px_80px_rgba(38,28,193,0.20)]",
            "flex flex-col",
          ].join(" ")}
          role="dialog"
          aria-label="OLOPSC UniGuide"
        >
          <div className="border-b border-[#2A178D]/20 bg-[linear-gradient(90deg,#261CC1_0%,#3350D9_38%,#9AA7A4_72%,#E6D400_100%)] px-4 py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                  <Image
                    src="/olopsclogo.png"
                    alt="OLOPSC Logo"
                    width={52}
                    height={52}
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="min-w-0">
                  <div
                    className={`${georama.className} truncate text-[17px] font-semibold leading-tight text-white tracking-wide`}
                  >
                    OLOPSC UniGuide
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-white/85">
                    School help and concern assistant
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className={[
                  "shrink-0 inline-flex h-9 w-9 items-center justify-center",
                  "text-white/95 transition hover:opacity-80",
                ].join(" ")}
                aria-label="Close chatbot"
              >
                <FiX size={18} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="rounded-[24px] border border-[#d9def8] bg-[#f6f7ff] px-4 py-3.5">
              <p className="text-[14px] leading-7 text-gray-700">
                <span className="font-semibold text-[#261CC1]">
                  Hey, welcome to OLOPSC UniGuide!
                </span>{" "}
                What are your concerns today? Choose one of the quick options below so I can guide you faster.
              </p>
            </div>

            {selectedPrompt && (
              <div className="mt-3 rounded-[20px] border border-[#dbe2ff] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(38,28,193,0.06)]">
                <div className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#1C0770]/55">
                  Selected concern
                </div>
                <div className="mt-1.5 text-[14px] font-medium leading-6 text-gray-800">
                  {selectedPrompt}
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="text-[12.5px] font-semibold text-gray-700">Quick questions</div>
              <span className="rounded-full border border-blue-200 bg-[#261CC1]/10 px-2.5 py-1 text-[11px] font-semibold text-[#1a138f]">
                Tap to ask
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {quickActions.map((q) => (
                <button
                  key={q.label}
                  onClick={() => handleQuickAction(q.text)}
                  className={[
                    "group inline-flex items-center gap-2",
                    "rounded-full border border-blue-200 bg-white",
                    "px-3 py-2.5",
                    "text-[12.5px] font-semibold",
                    q.kind === "emergency" ? "text-red-700" : "text-[#1C0770]",
                    "shadow-[0_8px_20px_rgba(38,28,193,0.06)]",
                    "transition hover:-translate-y-0.5 hover:bg-[#261CC1]/[0.05]",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "h-2 w-2 rounded-full",
                      q.kind === "emergency" ? "bg-red-500" : "bg-[#2F5BFF]",
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  <span className="whitespace-nowrap">{q.label}</span>
                  <span className="opacity-70 transition group-hover:opacity-100" aria-hidden="true">
                    <FiArrowRight size={13} />
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-[20px] border border-red-200 bg-red-50 px-3 py-2.5">
              <span className="mt-[2px] text-red-600">
                <FiAlertTriangle />
              </span>
              <p className="text-[12px] leading-snug text-red-700">
                For immediate danger, call <span className="font-semibold">161</span> or Campus Security.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}