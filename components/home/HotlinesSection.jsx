// components/home/EmergencyResponse.jsx
"use client";

import { inter, anekLatin } from "../../lib/fonts";
import { FiArrowRight } from "react-icons/fi";

export default function EmergencyResponse() {
  return (
    <section
      id="hotlines"
      className="relative w-full overflow-hidden border-b border-gray-200 bg-white py-12 sm:py-16 scroll-mt-28"
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-56 top-24 h-[520px] w-[520px] rounded-full bg-[#261CC1]/10 blur-[120px]" />
        <div className="absolute right-[-240px] top-[-160px] h-[620px] w-[620px] rounded-full bg-[#261CC1]/10 blur-[130px]" />
        <div className="absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#FFEB00]/[0.10] blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/55 to-white" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 overflow-hidden">
        {/* Header */}
        <p className={`${inter.className} text-[14px] font-semibold tracking-[0.22em] text-[#1a138f] mb-2`}>
          INSTANT HELP, ANYTIME
        </p>

        <h2
          className={`${anekLatin.className} text-[32px] sm:text-[40px] font-semibold tracking-[-0.02em] text-gray-900`}
        >
          Emergency Response
        </h2>

        <p className="mt-2 text-[16px] sm:text-[18px] leading-relaxed text-gray-700 max-w-3xl">
          Reach critical services in just one tap. Use the primary emergency hotline for
          life-threatening situations, or select a campus hotline for focused assistance.
        </p>

        <div className="mt-5 h-[4px] w-full bg-[#2F5BFF]" />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* LEFT CARD */}
          <div className="rounded-3xl border border-gray-200 bg-white shadow-[0_18px_55px_rgba(38,28,193,0.12)] overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-7">
              <h3 className={`${anekLatin.className} text-[20px] sm:text-[24px] lg:text-[28px] font-semibold text-gray-900`}>
                Call Marikina Emergency Hotline
              </h3>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-[#261CC1]/10 px-3 py-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#FFEB00]" />
                  <span className="text-[13px] font-semibold text-[#1a138f] tracking-wide">
                    PRIORITY • CAMPUS
                  </span>
                </span>
              </div>

              <p className="mt-4 text-[14px] sm:text-[16px] leading-relaxed text-gray-700">
                For any situation where life, health, or safety is in immediate danger inside campus,
                contact Marikina Emergency Hotline.
              </p>

              {/* MAIN CALL BUTTON */}
              <a
                href="tel:09496733019"
                className="group relative mt-6 inline-flex w-full items-center justify-center overflow-hidden
                           h-12 rounded-full border border-blue-600
                           bg-gradient-to-b from-[#2F5BFF] to-[#261CC1]
                           px-4 sm:px-6 text-[14px] sm:text-[16px] font-semibold text-white
                           shadow-[0_18px_40px_rgba(38,28,193,0.22)]
                           transition-all duration-300
                           hover:-translate-y-0.5 hover:shadow-[0_22px_55px_rgba(38,28,193,0.30)]"
              >
                CALL 09496733019 NOW
              </a>

              <div className="my-6 h-px bg-gray-200" />

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                <span className="text-[13px] font-semibold tracking-[0.16em] text-red-600">
                  ONLY FOR REAL EMERGENCIES
                </span>
              </div>

              <p className="mt-3 text-[15px] leading-relaxed text-gray-600">
                For non-urgent concerns and follow-ups, use the directory (Clinic, Guidance, Admin).
              </p>

              <div className="mt-6 h-[6px] w-full rounded-full bg-[#FFEB00]/50" />
            </div>
          </div>

          {/* RIGHT CARD */}
          <div className="rounded-3xl border border-gray-200 bg-white shadow-[0_18px_55px_rgba(38,28,193,0.12)] overflow-hidden">
            <div className="p-4 sm:p-6 lg:p-7 border-b border-gray-200">
              <h4 className="text-[14px] font-semibold tracking-[0.22em] text-gray-500">
                CAMPUS HOTLINES
              </h4>
              <p className="mt-2 text-[15px] text-gray-700">
                Save these contacts so you can reach the right office quickly.
              </p>
            </div>

            <div className="px-4 sm:px-6 lg:px-7 py-4 sm:py-5 max-h-[420px] overflow-y-auto">
              <div className="space-y-4">
                {hotlines.map((item) => (
                  <HotlineCard key={item.office} {...item} />
                ))}
              </div>

              <p className="mt-5 text-[14px] text-gray-500">
                Tip: Use the Emergency button in the header for fastest access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Hotline Card */
function HotlineCard({ office, desc, num1, num2, tel }) {
  return (
    <div
      className="relative rounded-2xl border border-blue-200 bg-white p-4 sm:p-5
                    shadow-[0_12px_35px_rgba(38,28,193,0.10)]
                    transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(38,28,193,0.14)]"
    >
      {/* ✅ changed from ombre to SOLID BLUE */}
      <div className="absolute left-0 top-0 h-full w-[6px] bg-[#2F5BFF] rounded-l-2xl" />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[16px] font-semibold text-gray-900">{office}</p>
          <p className="mt-1 text-[14px] text-gray-600">{desc}</p>

          <p className="mt-2 text-[15px] text-gray-800">
            {num1}
            {num2 && (
              <>
                <br />
                <span className="text-gray-500">{num2}</span>
              </>
            )}
          </p>
        </div>

        {/* FIXED CALL BUTTON */}
        <a
          href={`tel:${tel}`}
          className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2
                     h-10 rounded-full border border-blue-200 bg-white
                     px-4 text-[14px] font-semibold text-[#1a138f]
                     shadow-sm transition
                     hover:bg-[#261CC1]/10 hover:-translate-y-0.5"
        >
          CALL
          <span className="grid place-items-center h-6 w-6 rounded-full bg-[#261CC1]/10">
            <FiArrowRight size={14} />
          </span>
        </a>
      </div>
    </div>
  );
}

/* Hotline Data */
const hotlines = [
  {
    office: "Campus Clinic / Nurse",
    desc: "First aid & medical assistance",
    num1: "0942-0055",
    num2: "Clinic desk",
    tel: "09420055",
  },
  {
    office: "Campus Security Office",
    desc: "On-site safety & response",
    num1: "0949-673-3019",
    num2: "Security desk",
    tel: "09496733019",
  },
  {
    office: "Guidance Office",
    desc: "Student support & counseling",
    num1: "0948-0979",
    num2: "Guidance desk",
    tel: "09480979",
  },
  {
    office: "Discipline Office",
    desc: "Incident follow-ups & mediation",
    num1: "0942-3618",
    num2: "Office hotline",
    tel: "09423618",
  },
  {
    office: "Admin Office",
    desc: "Campus operations & coordination",
    num1: "0682-9572",
    num2: "Main line",
    tel: "06829572",
  },
  {
    office: "City Emergency Hotline (161)",
    desc: "For life-threatening situations",
    num1: "161",
    num2: "National emergency",
    tel: "161",
  },
];