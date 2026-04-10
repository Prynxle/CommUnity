"use client";

import { useState } from "react";
import { encodesans, inter } from "../../lib/fonts";

const faqs = [
  {
    question: "How do I track my report?",
    answer:
      "After submitting, you’ll receive a reference code (Report ID). Use that Report ID to view your report’s status and timeline updates in the tracking page.",
  },
  {
    question: "What concerns can I report?",
    answer:
      "You can report campus concerns such as medical-related icidents and student welfare concerns. Choose the Category of your report -> Location or then Sub-location -> Describe what happened -> Your name (optional) -> Contact Email -> Evidence (required photo) -> Submit. And you are done! you can copy your report ID for reference."
  },
  {
    question: "Do I need an account to submit a report?",
    answer:
      "Yes. You can't submit a report without creating an account.",
  },
  {
    question: "Can the school respond immediately?",
    answer:
      "Response time depends on the urgency and category. For immediate danger or life-threatening emergencies, call the emergency hotline first—then submit a report so it can be documented and followed up by the appropriate office.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faqs"
      className="relative w-full overflow-hidden py-24 text-slate-900"
    >
      {/* LIGHT BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />

        {/* subtle blue glow (right) */}
        <div className="absolute right-[-180px] top-24 h-[480px] w-[480px] rounded-full bg-[#261CC1]/10 blur-[140px]" />

        {/* faint yellow accent */}
        <div className="absolute left-1/2 top-44 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#FFEB00]/15 blur-[160px]" />
      </div>

      {/* TITLE */}
      <div className="mx-auto max-w-6xl px-10 sm:px-12">
        <h2 className={`${encodesans.className} text-center text-4xl sm:text-5xl font-semibold text-[#0F172A]`}>
          Frequently Asked Questions (FAQs)
        </h2>
        {/* centered underline */}
        <div className="mx-auto mt-4 h-[5px] w-28 rounded-full bg-[#FFEB00]" />
      </div>

      {/* FAQ LIST */}
      <div className="mx-auto mt-14 max-w-4xl px-9 sm:px-=10">
        <div className="space-y-5">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className={[
                  "group relative overflow-hidden rounded-2xl",
                  "border border-slate-200",
                  "bg-white/70 backdrop-blur-md",
                  "shadow-[0_12px_30px_rgba(0,0,0,0.08)]",
                  "transition-all duration-500 ease-out cursor-pointer",
                  "hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]",
                  isOpen
                    ? "border-blue-400 shadow-[0_25px_60px_rgba(37,99,235,0.18)]"
                    : "hover:border-blue-300",
                ].join(" ")}
                onClick={() => toggleFAQ(index)}
              >
                {/* LEFT ACCENT BAR */}
                <span
                  className={[
                    "absolute left-0 top-0 h-full w-[4px] rounded-l-2xl",
                    "bg-blue-500 transition-all duration-500",
                    isOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                  ].join(" ")}
                />

                {/* LIGHT SWEEP ANIMATION */}
                <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:translate-x-[120%] transition-transform duration-1000 ease-out" />

                {/* Question Row */}
                <div className="relative flex items-center justify-between gap-4 px-6 py-5 transition-all duration-300 group-hover:pl-7">
                  <p
                    className={`${inter.className} text-[16px] sm:text-[17px] text-slate-800`}
                  >
                    <span className="font-medium">{index + 1}.</span>{" "}
                    {faq.question}
                  </p>

                  {/* Icon */}
                  <span
                    className={[
                      "text-[24px] font-semibold leading-none flex items-center justify-center",
                      "transition-all duration-300",
                      isOpen
                        ? "text-blue-600 rotate-180 scale-110"
                        : "text-blue-500 group-hover:text-blue-600 group-hover:scale-110",
                    ].join(" ")}
                  >
                    {isOpen ? "×" : "+"}
                  </span>
                </div>

                {/* Answer */}
                <div
                  className={[
                    "relative overflow-hidden px-6",
                    "transition-all duration-300 ease-out",
                    isOpen
                      ? "max-h-[260px] pb-5 opacity-100"
                      : "max-h-0 pb-0 opacity-0",
                  ].join(" ")}
                >
                  <p
                    className={`${inter.className} text-slate-600 text-[14.5px] leading-7`}
                  >
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}