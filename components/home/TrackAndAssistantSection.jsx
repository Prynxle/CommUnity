// components/home/TrackAndAssistantSection.jsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getMyReportIds, addMyReportId } from "../../lib/reportIdStorage";
import { FiCopy, FiPlus } from "react-icons/fi";

const STATUS_LABELS = {
  SUBMITTED: "Submitted",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const STATUS_STYLES = {
  SUBMITTED: "bg-blue-100 border-blue-200 text-blue-800",
  IN_PROGRESS: "bg-indigo-100 border-indigo-200 text-indigo-800",
  RESOLVED: "bg-green-100 border-green-200 text-green-800",
  CLOSED: "bg-slate-100 border-slate-200 text-slate-700",
};

const ASSIGNED_OFFICE_LABELS = {
  csa_admin: "CSA / Guidance Office",
  clinic_admin: "Clinic / Health Office",
};

export default function TrackAndAssistantSection() {
  const [inputId, setInputId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { report, timeline }
  const [hasSearched, setHasSearched] = useState(false);

  const [myReportIds, setMyReportIds] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [myReportsLoading, setMyReportsLoading] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [addIdInput, setAddIdInput] = useState("");
  const [addIdLoading, setAddIdLoading] = useState(false);
  const [addIdError, setAddIdError] = useState("");
  const [copiedId, setCopiedId] = useState(null);

  const report = result?.report ?? null;
  const timeline = useMemo(
    () => (result?.timeline ?? []).slice().sort((a, b) => new Date(a.changed_at) - new Date(b.changed_at)),
    [result]
  );

  const lastUpdate = useMemo(() => {
    if (!report) return null;
    if (timeline.length === 0) return report.created_at ?? null;
    return timeline[timeline.length - 1]?.changed_at ?? report.created_at ?? null;
  }, [report, timeline]);

  useEffect(() => {
    setMyReportIds(getMyReportIds());
  }, []);

  useEffect(() => {
    if (myReportIds.length === 0) {
      setMyReports([]);
      return;
    }
    let cancelled = false;
    setMyReportsLoading(true);
    Promise.all(
      myReportIds.map((id) =>
        fetch(`/api/reports/${encodeURIComponent(id)}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
      )
    ).then((results) => {
      if (cancelled) return;
      setMyReports(results.filter(Boolean).map((d) => ({ report_id: d.report?.report_id, ...d })));
      setMyReportsLoading(false);
    });
    return () => { cancelled = true; };
  }, [myReportIds]);

  const copyReportId = useCallback((id) => {
    if (!id) return;
    navigator.clipboard.writeText(id).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  const filteredMyReports = useMemo(() => {
    if (!searchFilter.trim()) return myReports;
    const term = searchFilter.trim().toLowerCase();
    return myReports.filter((r) => r.report?.report_id?.toLowerCase().includes(term));
  }, [myReports, searchFilter]);

  async function handleAddByReportId(e) {
    e.preventDefault();
    const trimmed = addIdInput.trim();
    if (!trimmed) return;
    setAddIdError("");
    setAddIdLoading(true);
    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(trimmed)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setAddIdError(data?.error || "Report not found.");
        return;
      }
      addMyReportId(trimmed);
      setMyReportIds(getMyReportIds());
      setAddIdInput("");
      setResult(data);
      setHasSearched(true);
      setError("");
    } catch {
      setAddIdError("Unable to fetch report.");
    } finally {
      setAddIdLoading(false);
    }
  }

  function handleViewReport(data) {
    setResult(data);
    setHasSearched(true);
    setError("");
  }

  async function handleTrack(e) {
    e.preventDefault();
    const trimmed = inputId.trim();
    if (!trimmed) {
      setError("Please enter your Report ID.");
      setResult(null);
      setHasSearched(false);
      return;
    }

    setLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const res = await fetch(`/api/reports/${encodeURIComponent(trimmed)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error("No report found for that Report ID.");
        }
        throw new Error(data.error || "Unable to find report right now.");
      }
      setResult(data);
      if (data?.report?.report_id) {
        addMyReportId(data.report.report_id);
        setMyReportIds(getMyReportIds());
      }
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }

  const locationDisplay = report
    ? [report.location_category, report.sub_location].filter(Boolean).join(" • ")
    : "";

  const assignedLabel = report ? ASSIGNED_OFFICE_LABELS[report.assigned_to] ?? "Assigned office" : "";

  const lastUpdateDisplay =
    lastUpdate &&
    new Date(lastUpdate).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <section id="track" className="relative overflow-hidden border-b border-gray-200 bg-white py-10 sm:py-14 scroll-mt-28">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-56 top-24 h-[520px] w-[520px] rounded-full bg-[#261CC1]/10 blur-[120px]" />
        <div className="absolute right-[-240px] top-[-160px] h-[620px] w-[620px] rounded-full bg-[#261CC1]/10 blur-[130px]" />
        <div className="absolute left-1/2 top-40 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#FFEB00]/[0.12] blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/55 to-white" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8 overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-[28px] font-bold text-gray-900 sm:text-[34px]">Track your Reports</h2>
          <p className="mt-3 text-[16px] text-gray-700 sm:text-[18px]">
            Paste your Report ID from the confirmation screen or email to see which office is handling it and its
            current status.
          </p>
          <div className="mt-4 h-[4px] w-full bg-[#2F5BFF]" />
        </div>

        {/* Unified card: Your reports + Tracker */}
        <div className="overflow-hidden rounded-3xl border border-[#D7E0FF] bg-white shadow-[0_18px_55px_rgba(38,28,193,0.10)]">
          {/* Single top bar */}
          <div className="relative overflow-hidden px-4 py-5 text-white sm:px-6 sm:py-6">
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1C0770] via-[#2F5BFF] to-[#FFEB00]" />
            <div className="absolute -left-20 top-[-60px] z-0 h-[260px] w-[260px] rounded-full bg-[#2F5BFF]/55 blur-[120px]" />
            <div className="absolute right-[-60px] bottom-[-80px] z-0 h-[260px] w-[260px] rounded-full bg-[#FFEB00]/55 blur-[130px]" />
            <div className="absolute inset-0 z-0 bg-black/10" />

            <div className="relative z-10">
              <div className="text-[20px] font-bold sm:text-[22px]">Reports</div>
              <div className="mt-1 text-[14px] text-white/95 sm:text-[15px]">
                View your submitted reports and track any Report ID.
              </div>
            </div>
          </div>

          {/* Your reports controls + list */}
          <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-[14px] font-semibold text-gray-700">Your reports</div>
              <div className="text-[12px] text-gray-500">Saved on this device</div>
            </div>

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search by Report ID..."
                className="flex-1 min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-200/40"
              />
              <form onSubmit={handleAddByReportId} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={addIdInput}
                  onChange={(e) => {
                    setAddIdInput(e.target.value);
                    setAddIdError("");
                  }}
                  placeholder="Add by Report ID"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[14px] text-gray-900 placeholder:text-gray-400 outline-none focus:border-blue-300 sm:w-56"
                />
                <button
                  type="submit"
                  disabled={addIdLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-600 bg-blue-600 px-4 py-2.5 text-[14px] font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <FiPlus className="h-4 w-4" />
                  {addIdLoading ? "Adding…" : "Add"}
                </button>
              </form>
            </div>

            {addIdError && <p className="mt-2 text-[13px] text-red-600">{addIdError}</p>}

            <div className="mt-4">
              {myReportsLoading ? (
                <p className="py-6 text-center text-[14px] text-gray-500">Loading your reports…</p>
              ) : filteredMyReports.length === 0 ? (
                <p className="py-6 text-center text-[14px] text-gray-500">
                  {myReportIds.length === 0
                    ? "No reports yet. Submit a report above or add one by Report ID."
                    : "No reports match your search."}
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredMyReports.map((item) => {
                    const r = item.report;
                    if (!r) return null;
                    return (
                      <div
                        key={r.report_id}
                        className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[13px] text-gray-700 truncate">{r.report_id}</span>
                            <button
                              type="button"
                              onClick={() => copyReportId(r.report_id)}
                              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-[12px] font-semibold text-gray-700 hover:bg-gray-100"
                            >
                              <FiCopy className="h-3 w-3" />
                              {copiedId === r.report_id ? "Copied!" : "Copy"}
                            </button>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="text-[14px] font-medium text-gray-900">{r.category}</span>
                            <StatusPill status={r.status} />
                          </div>
                          {r.created_at && (
                            <div className="mt-1 text-[12px] text-gray-500">
                              Submitted{" "}
                              {new Date(r.created_at).toLocaleString(undefined, {
                                dateStyle: "short",
                                timeStyle: "short",
                              })}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleViewReport(item)}
                          className="shrink-0 rounded-xl border border-blue-600 bg-white px-4 py-2 text-[13px] font-semibold text-blue-600 hover:bg-blue-50"
                        >
                          View details
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Tracker controls */}
          <form
            onSubmit={handleTrack}
            className="flex flex-col gap-3 border-b border-gray-200 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6"
          >
            <div className="flex-1">
              <label className="block text-[13px] font-semibold text-gray-700 sm:text-[14px]">
                Track by Report ID
              </label>
              <div className="mt-1 relative">
                <input
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  placeholder="e.g. 7f0b2e4d-1234-4c9a-8f5a-..."
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

            <div className="flex-shrink-0">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-10 items-center justify-center rounded-2xl border border-blue-600 bg-blue-600 px-5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Tracking…" : "Track report"}
              </button>
            </div>
          </form>

          {error && (
            <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-[13px] text-red-800 sm:px-6 sm:text-[14px]">
              {error}
            </div>
          )}

          {/* Details */}
          <div className="grid gap-0 lg:grid-cols-[1.05fr_1.25fr]">
            {/* Left: summary */}
            <div className="border-gray-200 lg:border-r">
              <div className="px-4 py-4 sm:px-6">
                <div className="text-[14px] font-semibold text-gray-700 sm:text-[15px]">Report summary</div>
              </div>

              <div className="px-4 pb-5 sm:px-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  {!report ? (
                    <div className="text-[14px] text-gray-600">
                      {hasSearched
                        ? "No report found for that Report ID. Double-check the ID from your confirmation screen or email."
                        : "Select a report above (View details) or track by Report ID to see its status."}
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[18px] font-semibold text-gray-900 sm:text-[20px]">
                            {report.report_id}
                          </div>
                          <div className="mt-1 text-[14px] text-gray-700 sm:text-[15px]">
                            {report.category}
                          </div>
                        </div>

                        <div className="shrink-0">
                          <StatusPill status={report.status} />
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <InfoBox label="Location" value={locationDisplay || "—"} />
                        <InfoBox label="Assigned office" value={assignedLabel || "—"} />
                        <InfoBox
                          label="Submitted"
                          value={
                            report.created_at
                              ? new Date(report.created_at).toLocaleString(undefined, {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })
                              : "—"
                          }
                        />
                        <InfoBox label="Last update" value={lastUpdateDisplay || "Waiting for update"} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right: timeline */}
            <div className="px-4 py-4 sm:px-6">
              <div className="text-[14px] font-semibold text-gray-700 sm:text-[15px]">Status timeline</div>

              <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-5">
                {!report ? (
                  <div className="text-[14px] text-gray-600">
                    You’ll see a step-by-step timeline of how your report is being processed here once a valid Report ID
                    is selected.
                  </div>
                ) : (
                  <Timeline report={report} timeline={timeline} />
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
  const key = status || "SUBMITTED";
  const label = STATUS_LABELS[key] || status || "Unknown";
  const cls =
    STATUS_STYLES[key] || "bg-gray-100 border-gray-200 text-gray-700";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold ${cls}`}
    >
      {label}
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

function Timeline({ report, timeline }) {
  const steps = [];

  if (report?.created_at) {
    steps.push({
      status: "SUBMITTED",
      label: STATUS_LABELS.SUBMITTED,
      at: report.created_at,
      description: "Report submitted and recorded in the system.",
    });
  }

  for (const entry of timeline) {
    const key = entry.new_status || entry.status;
    const description = entry.note
      ? entry.note
      : key === "IN_PROGRESS"
        ? "An authorized office has started working on your report."
        : key === "RESOLVED"
          ? "The concern has been addressed by the assigned office."
          : key === "CLOSED"
            ? "The case is closed. No further action is scheduled."
            : "Status updated by the assigned office.";
    steps.push({
      status: key,
      label: STATUS_LABELS[key] || key,
      at: entry.changed_at,
      description,
    });
  }

  if (steps.length === 0) {
    return (
      <div className="text-[14px] text-gray-600">
        No timeline entries yet. Your report is waiting to be processed.
      </div>
    );
  }

  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={`${step.status}-${step.at}-${index}`} className="flex gap-3">
          <div className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-[#2F5BFF]" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[14px] font-semibold text-gray-900">
                {step.label}
              </span>
              {step.at && (
                <span className="text-[12px] text-gray-500">
                  {new Date(step.at).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              )}
            </div>
            <p className="mt-1 text-[13px] text-gray-700">
              {step.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

function SearchIcon({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8A7.5 7.5 0 0 1 10.5 18Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M16.2 16.2 21 21"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}