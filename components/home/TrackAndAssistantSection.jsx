// components/home/TrackAndAssistantSection.jsx
"use client";

import { useMemo, useState } from "react";

export default function TrackAndAssistantSection() {
  const tabs = useMemo(
    () => [
      { key: "all", label: "All" },
      { key: "under_review", label: "Under Review" },
      { key: "needs_clarification", label: "Needs Clarification" },
      { key: "resolved", label: "Resolved" },
    ],
    []
  );

  const cases = useMemo(
    () => [
      {
        id: "OLOPSC-2026-0142",
        status: "Under Review",
        statusKey: "under_review",
        category: "Student Welfare / Mental Health",
        location: "Room 204",
        office: "Guidance Office",
        time: "Today, 10:22 AM",
      },
      {
        id: "OLOPSC-2026-0089",
        status: "Needs Clarification",
        statusKey: "needs_clarification",
        category: "Bullying / Harassment",
        location: "Canteen",
        office: "Discipline Office",
        time: "Yesterday, 3:40 PM",
      },
      {
        id: "OLOPSC-2026-0021",
        status: "Resolved",
        statusKey: "resolved",
        category: "Facilities / Campus Issue",
        location: "Gate 2",
        office: "Admin Office",
        time: "Feb 12, 2026",
      },
    ],
    []
  );

  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(cases[0]?.id ?? "");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter((c) => {
      const tabOk = activeTab === "all" ? true : c.statusKey === activeTab;
      const qOk =
        !q ||
        c.id.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.office.toLowerCase().includes(q) ||
        c.status.toLowerCase().includes(q);
      return tabOk && qOk;
    });
  }, [cases, activeTab, query]);

  const selected = useMemo(() => cases.find((c) => c.id === selectedId) ?? null, [cases, selectedId]);

  return (
    <section id="track" className="relative border-b border-gray-200 bg-white py-10 sm:py-14 scroll-mt-28">
      {/* ✅ light background blobs + yellowish effect */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-56 top-24 h-[520px] w-[520px] rounded-full bg-[#261CC1]/10 blur-[120px]" />
        <div className="absolute right-[-240px] top-[-160px] h-[620px] w-[620px] rounded-full bg-[#261CC1]/10 blur-[130px]" />
        {/* ✅ yellow glow accent */}
        <div className="absolute left-1/2 top-40 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#FFEB00]/[0.12] blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/55 to-white" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-[28px] font-bold text-gray-900 sm:text-[34px]">
            Track your Reports
          </h2>

          <p className="mt-3 text-[16px] text-gray-700 sm:text-[18px]">
            Search your Case ID, check the latest status, and review which office is handling your report.
          </p>

          {/* ✅ Blue divider BELOW the description */}
          <div className="mt-4 h-[4px] w-full bg-[#2F5BFF]" />
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-[0_18px_55px_rgba(38,28,193,0.12)]">
          {/* 🔵🟡 Ombre Top Bar */}
          {/* 🔵🟡 Ombre Top Bar */}
          <div className="relative overflow-hidden px-5 py-6 text-white">

            {/* TRUE Blue → Yellow Gradient */}
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1C0770] via-[#2F5BFF] to-[#FFEB00]" />

            {/* Extra soft glow for richness */}
            <div className="absolute -left-20 top-[-60px] z-0 h-[260px] w-[260px] rounded-full bg-[#2F5BFF]/60 blur-[120px]" />
            <div className="absolute right-[-60px] bottom-[-80px] z-0 h-[260px] w-[260px] rounded-full bg-[#FFEB00]/60 blur-[130px]" />

            {/* Content */}
            <div className="relative z-10">
              <div className="text-[20px] font-bold sm:text-[22px]">
                Report Tracker
              </div>
              <div className="mt-1 text-[14px] text-white/95 sm:text-[15px]">
                Filter and select a case to view its details.
              </div>
            </div>

          </div>
          {/* Controls */}
          <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map((t) => {
                const active = t.key === activeTab;
                return (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTab(t.key)}
                    className={[
                      "rounded-xl border px-3.5 py-2 text-[14px] font-semibold transition sm:text-[15px]",
                      active
                        ? "border-blue-200 bg-[#261CC1]/10 text-[#1a138f] shadow-[0_0_0_1px_rgba(38,28,193,0.12)]"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50",
                    ].join(" ")}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-[380px]">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by Case ID, office, location…"
                className={[
                  "w-full rounded-2xl border border-gray-200 bg-white/80",
                  "px-4 py-2.5 pr-10 text-[14px] text-gray-900 sm:text-[15px]",
                  "outline-none placeholder:text-gray-400 backdrop-blur-md",
                  "transition focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-200/40",
                ].join(" ")}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                <SearchIcon className="h-4 w-4" />
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="grid gap-0 lg:grid-cols-[1.05fr_1.25fr]">
            {/* Left */}
            <div className="border-gray-200 lg:border-r">
              <div className="px-4 py-4">
                <div className="text-[14px] font-semibold text-gray-700 sm:text-[15px]">Case Queue</div>
              </div>

              <div className="px-4 pb-5 space-y-3">
                {filtered.length === 0 ? (
                  <div className="rounded-2xl border border-gray-200 bg-white p-4 text-[14px] text-gray-600">
                    No cases match your search.
                  </div>
                ) : (
                  filtered.map((c) => {
                    const isActive = c.id === selectedId;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedId(c.id)}
                        className={[
                          "w-full text-left rounded-2xl border p-4 transition",
                          "bg-white hover:bg-gray-50",
                          isActive
                            ? "border-blue-200 shadow-[0_0_0_1px_rgba(38,28,193,0.10),0_18px_55px_rgba(38,28,193,0.12)]"
                            : "border-gray-200",
                        ].join(" ")}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-[15px] font-semibold text-gray-900 sm:text-[16px]">{c.id}</div>
                            <div className="mt-1 text-[13.5px] text-gray-700 sm:text-[14px]">{c.category}</div>
                            <div className="mt-1 text-[13px] text-gray-500">{c.location}</div>
                          </div>

                          <div className="shrink-0 text-right">
                            <StatusPill status={c.status} />
                            <div className="mt-2 text-[13px] text-gray-700">{c.office}</div>
                            <div className="mt-0.5 text-[12.5px] text-gray-500">{c.time}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Right */}
            <div className="px-4 py-4">
              <div className="text-[14px] font-semibold text-gray-700 sm:text-[15px]">Selected Case</div>

              <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5">
                {!selected ? (
                  <div className="text-[14px] text-gray-600">Select a case from the list to preview details.</div>
                ) : (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-[18px] font-semibold text-gray-900 sm:text-[20px]">{selected.id}</div>
                        <div className="mt-1 text-[14px] text-gray-700 sm:text-[15px]">{selected.category}</div>
                      </div>

                      <div className="shrink-0">
                        <StatusPill status={selected.status} />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <InfoBox label="Location" value={selected.location} />
                      <InfoBox label="Assigned Office" value={selected.office} />
                      <InfoBox label="Last Update" value={selected.time} />
                      <InfoBox label="Visibility" value="Confidential" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status }) {
  const map = {
    "Under Review": "bg-[#261CC1]/10 border-[#261CC1]/20 text-[#1a138f]",
    "Needs Clarification": "bg-yellow-50 border-yellow-200 text-yellow-900",
    Resolved: "bg-green-100 border-green-200 text-green-800",
  };

  const cls = map[status] || "bg-gray-100 border-gray-200 text-gray-700";

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold ${cls}`}>
      {status}
    </span>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3.5 py-3">
      <div className="text-[12px] font-semibold text-gray-500">{label}</div>
      <div className="mt-1 text-[14px] text-gray-900 sm:text-[15px]">{value}</div>
    </div>
  );
}

function SearchIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8A7.5 7.5 0 0 1 10.5 18Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.2 16.2 21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}