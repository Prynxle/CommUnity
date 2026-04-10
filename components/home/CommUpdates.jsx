// components/home/CommUpdatesSection.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { publicsans, inter, georama } from "../../lib/fonts";

const supabase =
  typeof window !== "undefined"
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      )
    : null;

export default function CommUpdatesSection() {
  const updates = useMemo(
    () => [
      {
        title: "Guidance Office Announcement",
        text: "Faculty and Student Services Evaluation – 2nd Semester A.Y. 2025–2026 .",
        tag: "Guidance",
        meta: "April 7, 2026 • 1:02 PM",
      },
      {
        title: "Campus Safety Advisory",
        text: "Please wear you complete school uniform and bring your school ID at all times.",
        tag: "Safety",
        meta: "April 6, 2026 • 8:30 AM",
      },
      {
        title: "Facilities Notice",
        text: (
          <>
            No Announcement.{" "}
            <span className="font-semibold text-[#1a138f]"></span>
            {/* <span className="font-semibold text-[#1a138f]">2nd Floor</span>, 3:00–5:00 PM today. */}
          </>
        ),
        tag: "Facilities",
        // meta: "Scheduled today • 3:00 PM",
      },
    ],
    []
  );

  const [stats, setStats] = useState([
    { label: "Reports filed this month", value: "—", hint: "Total submissions", percent: 0 },
    { label: "Resolved cases", value: "—", hint: "Closed successfully", percent: 0 },
    { label: "Avg. resolution time", value: "—", hint: "Across all offices", percent: 0 },
    { label: "Active cases", value: "—", hint: "Under review", percent: 0 },
  ]);

  useEffect(() => {
    if (!supabase) return;

    async function loadStats() {
      const { data, error } = await supabase.from("reports").select("status, created_at");
      if (error || !data) return;

      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      let totalThisMonth = 0;
      let resolved = 0;
      let active = 0;

      data.forEach((r) => {
        const created = r.created_at ? new Date(r.created_at) : null;
        if (created && created >= monthStart) totalThisMonth += 1;
        if (r.status === "RESOLVED") resolved += 1;
        else active += 1;
      });

      const resolutionPercent =
        resolved + active === 0 ? 0 : Math.round((resolved / (resolved + active)) * 100);

      setStats([
        {
          label: "Reports filed this month",
          value: String(totalThisMonth),
          hint: "Coming Soon",
          percent: Math.min(100, totalThisMonth || 0),
        },
        {
          label: "Resolved cases",
          value: `${resolved}`,
          hint: "Coming Soon",
          percent: Math.min(100, resolutionPercent),
        },
        {
          label: "Avg. resolution time",
          value: "—",
          hint: "Coming soon",
          percent: 0,
        },
        {
          label: "Active cases",
          value: `${active}`,
          hint: "Coming Soonin ",
          percent: Math.min(100, active || 0),
        },
      ]);
    }

    loadStats();

    const channel = supabase
      .channel("reports-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reports" },
        () => {
          loadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const quotes = useMemo(
    () => [
      { text: "My concern was acknowledged quickly and I got updates the next day.", who: "— Student" },
      { text: "Easy tracking and clear status changes. I felt heard.", who: "— Student" },
      { text: "Anonymous option helped me report safely.", who: "— Student" },
    ],
    []
  );

  return (
    <section id="dashboard" className="relative overflow-hidden border-b border-gray-200 bg-white py-10 sm:py-14 scroll-mt-28">
      {/* ✅ light mode background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-56 top-24 h-[520px] w-[520px] rounded-full bg-[#261CC1]/10 blur-[120px]" />
        <div className="absolute right-[-240px] top-[-160px] h-[620px] w-[620px] rounded-full bg-[#261CC1]/10 blur-[130px]" />
        <div className="absolute left-1/2 top-40 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#FFEB00]/[0.10] blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/60 to-white" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 space-y-12 overflow-hidden">
        {/* Header */}
        <div className="mb-2">
          <h2 className={`${publicsans.className} text-[30px] font-bold text-gray-900 sm:text-[38px]`}>
            School Dashboard
          </h2>
          <p className="mt-2 text-[17px] text-gray-700 sm:text-[20px]">
            Stay updated with announcements and view quick stats.
          </p>
          <div className="mt-4 h-[4px] w-full bg-[#2F5BFF]" />
        </div>

        {/* ✅ Main Dashboard Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_55px_rgba(38,28,193,0.12)]">
          {/* ✅ Ombre top */}
            <div className="relative overflow-hidden px-4 sm:px-6 py-5 sm:py-6 text-white">
            {/* gradient base */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1C0770] via-[#2F5BFF] to-[#FFEB00]" />
            {/* glows */}
            <div className="absolute -left-24 top-[-70px] z-0 h-[280px] w-[280px] rounded-full bg-[#2F5BFF]/55 blur-[130px]" />
            <div className="absolute right-[-80px] bottom-[-90px] z-0 h-[300px] w-[300px] rounded-full bg-[#FFEB00]/55 blur-[135px]" />
            {/* readability overlay */}
            <div className="absolute inset-0 z-0 bg-black/15" />

            {/* content */}
            <div className="relative z-10 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className={`${georama.className} text-[20px] sm:text-[22px] font-bold`}>Quick Summary</div>
                <div className={`${inter.className} mt-1 text-[15px] sm:text-[16px] text-white/90`}>
                  A snapshot of the reporting system activity and school notices.
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left: Updates */}
            <div className="border-gray-200 lg:border-r">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 px-4 sm:px-6 pt-4 sm:pt-6">
                <h3 className={`${publicsans.className} text-[20px] font-bold text-gray-900 sm:text-[22px]`}>
                  School Updates
                </h3>
                <span className="hidden sm:inline-flex rounded-full border border-blue-200 bg-[#261CC1]/10 px-3 py-1 text-[13px] font-semibold text-[#1a138f]">
                  Announcements
                </span>
              </div>

              <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-3 sm:pt-4 grid gap-4 grid-cols-1 lg:grid-cols-1">
                {updates.map((u) => (
                  <UpdateCard key={u.title} title={u.title} text={u.text} tag={u.tag} meta={u.meta} />
                ))}
              </div>
            </div>

            {/* Right: Stats */}
            <div className="px-4 sm:px-6 py-4 sm:py-6">
              <h3 className={`${publicsans.className} text-[20px] font-bold text-gray-900 sm:text-[22px]`}>
                Case Overview
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {stats.map((s) => (
                  <StatCard key={s.label} label={s.label} value={s.value} hint={s.hint} percent={s.percent} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div>
          <h3 className={`${publicsans.className} text-[22px] font-bold text-gray-900 sm:text-[26px]`}>
            What students say
          </h3>

          <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {quotes.map((q, i) => (
              <QuoteCard key={i} text={q.text} who={q.who} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function UpdateCard({ title, text, tag, meta }) {
  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border border-blue-200 bg-white p-5",
        "shadow-[0_12px_35px_rgba(38,28,193,0.10)]",
        "transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(38,28,193,0.14)]",
      ].join(" ")}
    >
      {/* ✅ CHANGED: solid blue (no ombre) */}
      <div className="absolute left-0 top-0 h-full w-[6px] bg-[#2F5BFF]" />

      <div
        className={[
          "pointer-events-none absolute -inset-y-10 -left-24 w-24 rotate-[18deg]",
          "bg-gradient-to-r from-transparent via-white/55 to-transparent",
          "opacity-0 blur-[1px] transition duration-500 group-hover:opacity-100 group-hover:translate-x-[520px]",
        ].join(" ")}
      />

      <div className="flex items-start justify-between gap-3 pl-2">
        <h4 className={`${georama.className} font-semibold text-[16px] sm:text-[18px] text-gray-900`}>{title}</h4>

        <span className="shrink-0 rounded-full border border-yellow-300/60 bg-yellow-100 px-3 py-1 text-[12px] sm:text-[13px] font-semibold text-yellow-900">
          {tag}
        </span>
      </div>

      <p className={`${inter.className} mt-2 pl-2 text-[14.5px] sm:text-[16px] text-gray-700 leading-relaxed`}>
        {text}
      </p>

      <div className="mt-3 pl-2 text-[13px] sm:text-[14px] text-gray-500">{meta}</div>

      <div className="mt-4 h-[2px] w-full bg-gradient-to-r from-[#2F5BFF]/80 via-[#2F5BFF]/20 to-transparent" />
    </div>
  );
}

function StatCard({ label, value, hint, percent = 60 }) {
  const safe = Math.max(0, Math.min(100, Number(percent) || 0));

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border border-blue-200 bg-white px-5 py-4",
        "shadow-[0_12px_35px_rgba(38,28,193,0.10)]",
        "transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(38,28,193,0.14)]",
      ].join(" ")}
    >
      <div
        className={[
          "pointer-events-none absolute -inset-y-10 -left-24 w-24 rotate-[18deg]",
          "bg-gradient-to-r from-transparent via-white/55 to-transparent",
          "opacity-0 blur-[1px] transition duration-500 group-hover:opacity-100 group-hover:translate-x-[520px]",
        ].join(" ")}
      />

      <div className="flex items-baseline justify-between gap-3">
        <div className={`${inter.className} text-[14px] sm:text-[15px] font-semibold text-gray-700`}>{label}</div>
        <div className="text-[24px] sm:text-[28px] font-bold text-[#1C0770]">{value}</div>
      </div>

      <div className="mt-1 text-[13px] sm:text-[14px] text-gray-500">{hint}</div>

      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
        {/* ✅ CHANGED: removed yellow line */}
        <div className="relative h-full rounded-full bg-[#2F5BFF]" style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
}

function QuoteCard({ text, who }) {
  return (
    <div
      className={[
        "group relative overflow-hidden rounded-2xl border border-blue-200 bg-white p-5",
        "shadow-[0_12px_35px_rgba(38,28,193,0.10)]",
        "transition hover:-translate-y-0.5 hover:shadow-[0_18px_50px_rgba(38,28,193,0.14)]",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -top-6 right-3 text-[84px] font-black text-[#261CC1]/[0.08] leading-none">
        “
      </div>

      <div
        className={[
          "pointer-events-none absolute -inset-y-10 -left-24 w-24 rotate-[18deg]",
          "bg-gradient-to-r from-transparent via-white/55 to-transparent",
          "opacity-0 blur-[1px] transition duration-500 group-hover:opacity-100 group-hover:translate-x-[520px]",
        ].join(" ")}
      />

      <p className={`${inter.className} text-[15px] sm:text-[16.5px] text-gray-800 leading-relaxed`}>“{text}”</p>

      <div className="mt-3 text-[13px] sm:text-[14px] font-semibold text-gray-600">{who}</div>

      <div className="mt-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-[#2F5BFF]" />
        <span className="h-2 w-2 rounded-full bg-[#FFEB00]" />
        <span className="h-2 w-2 rounded-full bg-[#2F5BFF]/40" />
      </div>
    </div>
  );
}