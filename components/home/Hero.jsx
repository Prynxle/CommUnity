"use client";

/* eslint-disable no-unused-vars */
export default function HeroSection() {

  return (
    <section
      id="home"
      className="relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/olopsc.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
          {/* Left */}
          <div>
            <h1 className="mt-14 sm:mt-20 text-[32px] sm:text-[48px] lg:text-[72px] font-semibold leading-[1.15] tracking-[-0.02em] text-white">
              Empowering every{" "}
              <span className="text-[#FFEB00] drop-shadow-[0_10px_30px_rgba(255,235,0,.18)]">
                voice.
              </span>{" "}
              <br />
              Strengthening every{" "}
              <span className="text-[#FFEB00] drop-shadow-[0_10px_30px_rgba(255,235,0,.18)]">
                future.
              </span>
            </h1>

            <p className="mt-4 sm:mt-5 max-w-2xl text-[15px] sm:text-[18px] lg:text-[22px] leading-relaxed text-white/90">
              <span className="text-white font-semibold">Welcome to the OLOPSC-Community!</span>{" "}
              A school-ready system for reporting incidents, welfare concerns, and campus issues — with
              responsible routing and{" "}
              <span className="relative text-white font-semibold">
                clear updates
                <span className="absolute left-0 right-0 -bottom-1 h-[10px] rounded-full bg-[#FFEB00]/35 -z-10" />
              </span>
              .
            </p>
          </div>

          {/* Right card */}
          <div className="relative max-w-[500px] w-full flex items-center mt-4 lg:mt-8 mx-auto lg:mx-0">
            <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[30px] bg-gradient-to-b from-[#261CC1]/14 via-[#261CC1]/08 to-[#FFEB00]/08 blur-xl" />

            <div className="w-full rounded-[26px] border border-slate-200 bg-white/80 px-5 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 shadow-[0_14px_50px_rgba(15,23,42,.10)] backdrop-blur-xl flex flex-col justify-center">
              <div className="mb-5 text-base font-semibold tracking-[0.2em] text-slate-500">
                WHAT YOU CAN DO
              </div>

              <div className="grid gap-3">
                <QuickCardLight
                  Icon={ReportIconLight}
                  title="Report a Concern"
                  text="Bullying, safety, student welfare, conflicts, harassment, and more."
                  href="#submit-report"
                />
                <QuickCardLight
                  Icon={TrackIconLight}
                  title="Track Status"
                  text="Use your Case ID to view updates and assigned office."
                  href="#track"
                />
                <QuickCardLight
                  Icon={AssistantIconLight}
                  title="Ask Support Assistant"
                  text="Get guided steps for what to do next and required details."
                  href="#track"
                />
                <QuickCardLight
                  Icon={HotlineIconLight}
                  title="Hotlines / Help"
                  text="Urgent guidance and official school contacts."
                  href="#hotlines"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-200 pt-4 mt-5">
                <div className="flex items-start gap-3 text-[13px] sm:text-[13px] text-slate-600">
                  <RedWarningTriangle className="mt-1 h-5 w-5 shrink-0" />
                  <div className="leading-relaxed">
                    If immediate danger exists, contact emergency services first — then submit a report.
                  </div>
                </div>

                <a
                  href="#hotlines"
                  className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center h-10 rounded-2xl border border-[#261CC1]/25 bg-[#261CC1]/10 px-4 text-[14px] leading-none font-semibold text-[#1a138f] hover:bg-[#261CC1]/14 hover:-translate-y-0.5 transition"
                >
                  Get Help
                </a>
              </div>
            </div>
          </div>
          {/* END Right card */}
        </div>
      </div>
    </section>
  );
}

/* ===== Light mode quick cards ===== */
function QuickCardLight({ Icon, title, text, href }) {
  return (
    <a
      href={href}
      className={[
        "group relative overflow-hidden rounded-2xl border border-slate-200",
        "bg-white/85 px-4 py-4",
        "transition-all duration-300",
        "hover:-translate-y-[2px] hover:border-slate-300",
        "hover:shadow-[0_18px_55px_rgba(15,23,42,0.12)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#261CC1]/25",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
      ].join(" ")}
    >
      {/* soft blue glow */}
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -left-24 -top-24 h-48 w-48 rounded-full",
          "bg-[#261CC1]/14 blur-2xl",
          "opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
        ].join(" ")}
      />
      {/* subtle yellow glow */}
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -right-24 -bottom-24 h-56 w-56 rounded-full",
          "bg-[#FFEB00]/10 blur-3xl",
          "opacity-0 transition-opacity duration-300",
          "group-hover:opacity-100",
        ].join(" ")}
      />
      {/* sheen */}
      <span
        aria-hidden="true"
        className={[
          "pointer-events-none absolute inset-0",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-[linear-gradient(120deg,transparent_0%,rgba(38,28,193,.10)_35%,rgba(255,235,0,.08)_55%,transparent_75%)]",
          "translate-x-[-30%] group-hover:translate-x-[30%] transition-transform duration-700",
        ].join(" ")}
      />

      <div className="relative flex items-start gap-3">
        <div className="mt-0.5 flex h-14 w-14 items-center justify-center">
          <div className="transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-[1.06]">
            <Icon className="h-[32px] w-[32px]" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="text-[17px] sm:text-[18px] font-semibold text-slate-900">{title}</div>
            <span
              aria-hidden="true"
              className="mt-0.5 shrink-0 opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
            >
              <ChevronRight className="h-4 w-4 text-slate-500" />
            </span>
          </div>

          <div className="mt-1 text-[15px] sm:text-[16px] leading-relaxed text-slate-600">{text}</div>
        </div>
      </div>

      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-slate-200" />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-[#261CC1]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
    </a>
  );
}

/* ===== Light icon set (blue + subtle yellow) ===== */
function ReportIconLight({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 3h6l4 4v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        stroke="#1f2937"
        strokeOpacity="0.85"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M14 3v4h4" stroke="#1f2937" strokeOpacity="0.85" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 14l2 2 4-5" stroke="#FFEB00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9.5h3.2" stroke="#261CC1" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function TrackIconLight({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8A7.5 7.5 0 0 1 10.5 18Z"
        stroke="#1f2937"
        strokeOpacity="0.85"
        strokeWidth="1.8"
      />
      <path d="M16.2 16.2 21 21" stroke="#261CC1" strokeWidth="2.2" strokeLinecap="round" />
      <path
        d="M10.5 7.5v4l2.7 1.6"
        stroke="#FFEB00"
        strokeWidth="2.0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AssistantIconLight({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 10.5V9a5 5 0 0 1 10 0v1.5"
        stroke="#1f2937"
        strokeOpacity="0.85"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6 10.5h1.3A1.7 1.7 0 0 1 9 12.2v.6A1.7 1.7 0 0 1 7.3 14.5H6a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2Z"
        stroke="#261CC1"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M18 10.5h-1.3A1.7 1.7 0 0 0 15 12.2v.6a1.7 1.7 0 0 0 1.7 1.7H18a2 2 0 0 0 2-2v0a2 2 0 0 0-2-2Z"
        stroke="#261CC1"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M10 18h4" stroke="#FFEB00" strokeWidth="2.0" strokeLinecap="round" />
      <path d="M9.2 16.2h5.6" stroke="#94a3b8" strokeWidth="1.2" />
    </svg>
  );
}

function HotlineIconLight({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 4h10v16H7V4Z" stroke="#1f2937" strokeOpacity="0.85" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.5 7h5" stroke="#FFEB00" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M9.5 11h5" stroke="#1f2937" strokeOpacity="0.85" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.5 15h3.5" stroke="#261CC1" strokeWidth="2.0" strokeLinecap="round" />
    </svg>
  );
}

function RedWarningTriangle({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3L2 21h20L12 3z" fill="#ff3b3b" />
      <path d="M12 9v6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17.5" r="1.25" fill="#ffffff" />
    </svg>
  );
}

function ChevronRight({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}