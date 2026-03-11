"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getAdminSession } from "../../lib/adminStorage";
import { poppins } from "../../lib/fonts";
import { FiCopy, FiArrowRight, FiClipboard, FiBarChart2, FiShield, FiUsers } from "react-icons/fi";

const REPORT_STATUS = {
  SUBMITTED: "SUBMITTED",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
};

const NEXT_STATUS = {
  [REPORT_STATUS.SUBMITTED]: REPORT_STATUS.IN_PROGRESS,
  [REPORT_STATUS.IN_PROGRESS]: REPORT_STATUS.RESOLVED,
  [REPORT_STATUS.RESOLVED]: REPORT_STATUS.CLOSED,
  [REPORT_STATUS.CLOSED]: null,
};

const STATUS_LABELS = {
  [REPORT_STATUS.SUBMITTED]: "Submitted",
  [REPORT_STATUS.IN_PROGRESS]: "In progress",
  [REPORT_STATUS.RESOLVED]: "Resolved",
  [REPORT_STATUS.CLOSED]: "Closed",
};

const PRIORITY_STYLES = {
  CRITICAL: "bg-red-100 text-red-800 border-red-200",
  HIGH: "bg-amber-100 text-amber-800 border-amber-200",
  NORMAL: "bg-gray-100 text-gray-800 border-gray-200",
};

const STATUS_STYLES = {
  [REPORT_STATUS.SUBMITTED]: "bg-blue-100 text-blue-800 border-blue-200",
  [REPORT_STATUS.IN_PROGRESS]: "bg-indigo-100 text-indigo-800 border-indigo-200",
  [REPORT_STATUS.RESOLVED]: "bg-green-100 text-green-800 border-green-200",
  [REPORT_STATUS.CLOSED]: "bg-slate-100 text-slate-700 border-slate-200",
};

const HOTLINES = [
  { office: "Campus Clinic / Nurse", desc: "First aid & medical", num1: "0942-0055", tel: "09420055" },
  { office: "Campus Security", desc: "On-site safety", num1: "0949-673-3019", tel: "09496733019" },
  { office: "Guidance Office", desc: "Counseling", num1: "0948-0979", tel: "09480979" },
  { office: "Discipline Office", desc: "Follow-ups", num1: "0942-3618", tel: "09423618" },
  { office: "Admin Office", desc: "Coordination", num1: "0682-9572", tel: "06829572" },
  { office: "Emergency (161)", desc: "Life-threatening", num1: "161", tel: "161" },
];

export default function AdminDashboardPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const admin = getAdminSession();
  const token = admin?.access_token;

  const adminRoleLabel = String(
    admin?.role || admin?.office || admin?.department || admin?.position || ""
  ).toLowerCase();

  const welcomeName =
    adminRoleLabel.includes("csa")
      ? "Ms. Bobis"
      : adminRoleLabel.includes("clinic")
        ? "Sir Payte"
        : "Sir Payte";

  useEffect(() => {
    if (!token) return;

    (async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) throw new Error(data?.error ?? "Failed to load reports");

        setReports(data.reports ?? []);
      } catch (e) {
        setError(e.message);
        setReports([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const copyReportId = useCallback((reportId) => {
    if (!reportId) return;

    navigator.clipboard.writeText(reportId).then(() => {
      setCopiedId(reportId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }, []);

  async function updateStatus(reportId, newStatus) {
    if (!token) return;

    setUpdatingId(reportId);

    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.error ?? "Update failed");

      setReports((prev) =>
        prev.map((r) =>
          r.report_id === reportId ? { ...r, status: newStatus } : r
        )
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdatingId(null);
    }
  }

  const byStatus = useMemo(() => {
    const map = {
      SUBMITTED: [],
      IN_PROGRESS: [],
      RESOLVED: [],
      CLOSED: [],
    };

    reports.forEach((r) => {
      const key = r.status in map ? r.status : "SUBMITTED";
      map[key].push(r);
    });

    return map;
  }, [reports]);

  const stats = useMemo(
    () => [
      { key: "SUBMITTED", label: "Submitted", value: byStatus.SUBMITTED.length, icon: FiClipboard },
      { key: "IN_PROGRESS", label: "In progress", value: byStatus.IN_PROGRESS.length, icon: FiBarChart2 },
      { key: "RESOLVED", label: "Resolved", value: byStatus.RESOLVED.length, icon: FiShield },
      { key: "CLOSED", label: "Closed", value: byStatus.CLOSED.length, icon: FiUsers },
    ],
    [byStatus]
  );

  const primaryHotline =
    HOTLINES.find((h) => h.office === "Campus Security") ?? HOTLINES[0];

  const campusHotlines =
    HOTLINES.filter((h) => h.office !== primaryHotline.office);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <section
        id="home"
        className="scroll-mt-[96px] relative w-full bg-white"
      >
        <div
          className="relative flex min-h-[680px] w-full items-center justify-center overflow-hidden"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('/olopsc.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full px-6 py-16 sm:px-8 lg:px-12 xl:px-16">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-center text-center">
              <h1 className="text-[38px] font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:text-[56px] lg:text-[76px]">
                Empowering every{" "}
                <span className="text-[#FFEB00]">voice.</span>
                <br />
                Strengthening every{" "}
                <span className="text-[#FFEB00]">future.</span>
              </h1>

              <p className="mt-5 mx-auto max-w-[42rem] text-[17px] leading-8 text-white/90 sm:mt-7 sm:text-[22px] sm:leading-9">
                Welcome {welcomeName}! This is your CommUnity Admin Dashboard, where you can monitor
                reports, track progress, and respond to student concerns with clarity, urgency, and care.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row">
                <a
                  href="#admin-dashboard"
                  className="group inline-flex h-11 min-w-[210px] items-center justify-center rounded-full bg-gradient-to-r from-[#3B82F6] to-[#241CCB] px-5 text-[14px] font-bold text-white shadow-[0_12px_24px_rgba(37,99,235,0.30)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_18px_32px_rgba(37,99,235,0.40)] hover:brightness-110 active:translate-y-0 active:scale-[0.98] sm:h-12 sm:min-w-[230px] sm:px-6 sm:text-[15px]"
                >
                  Go to Admin Dashboard
                </a>

                <a
                  href="#student-reports"
                  className="group inline-flex h-11 min-w-[210px] items-center justify-center rounded-full border border-white/30 bg-white/10 px-5 text-[14px] font-bold text-white backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:border-white/50 hover:bg-white/20 hover:shadow-[0_16px_30px_rgba(255,255,255,0.10)] active:translate-y-0 active:scale-[0.98] sm:h-12 sm:min-w-[230px] sm:px-6 sm:text-[15px]"
                >
                  Go to Student Reports
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-[1200px] space-y-8 px-6 py-10 sm:space-y-10 sm:px-10 sm:py-12 lg:px-16">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <section
          id="admin-dashboard"
          className="scroll-mt-[96px] overflow-hidden rounded-3xl border border-[#D7E0FF] bg-white shadow-[0_18px_55px_rgba(38,28,193,0.10)]"
        >
          <div className="relative overflow-hidden px-4 py-5 text-white sm:px-6 sm:py-6">
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1C0770] via-[#2F5BFF] to-[#FFEB00]" />
            <div className="absolute -left-20 top-[-60px] z-0 h-[220px] w-[220px] rounded-full bg-[#2F5BFF]/55 blur-[100px]" />
            <div className="absolute bottom-[-60px] right-[-60px] z-0 h-[220px] w-[220px] rounded-full bg-[#FFEB00]/55 blur-[110px]" />
            <div className="absolute inset-0 z-0 bg-black/10" />

            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/12 backdrop-blur-sm shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                  <FiBarChart2 className="h-5 w-5 text-white" />
                </div>

                <div>
                  <div className="inline-flex items-center rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
                    Live overview
                  </div>
                  <div className="mt-2 text-[20px] font-bold sm:text-[24px]">
                    School Dashboard
                  </div>
                  <div className="mt-1 text-[13px] text-white/90 sm:text-[15px]">
                    Report counts by status
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[12px] font-medium text-white/90 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#FFEB00]" />
                Real-time summary
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-6 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.key}
                className="rounded-2xl border border-[#D7E0FF] bg-white p-4 shadow-[0_12px_35px_rgba(38,28,193,0.08)]"
              >
                <div className="text-[12px] font-semibold text-gray-500 sm:text-[13px]">{s.label}</div>
                <div className="mt-1 text-[24px] font-bold text-[#1C0770] sm:text-[28px]">{s.value}</div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#2F5BFF]"
                    style={{ width: `${Math.min(100, (s.value || 0) * 5 + 20)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="h-6 sm:h-8" />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <section id="hotlines" className="scroll-mt-[96px]">
          <div className="w-full">
            <div className="pb-6">
              <div className="text-[14px] font-semibold uppercase tracking-[0.28em] text-[#1C0770]">
                Instant help, anytime
              </div>
              <h2 className={`${poppins.className} mt-3 text-[34px] font-bold text-slate-900 sm:text-[42px]`}>
                Emergency Response
              </h2>
              <p className="mt-3 max-w-3xl text-[17px] leading-8 text-slate-600">
                Reach critical services in just one tap. Use the primary emergency hotline for life-threatening
                situations, or select a campus hotline for focused assistance.
              </p>
            </div>

            <div className="mt-8 grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_40px_rgba(38,28,193,0.08)]">
                <h3 className={`${poppins.className} text-[22px] font-bold text-slate-900`}>
                  Call Marikina Emergency Hotline
                </h3>

                <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#D8D6FF] bg-[#EEF0FF] px-4 py-2 text-[13px] font-semibold text-[#261CC1]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFEB00]" />
                  PRIORITY • CAMPUS
                </div>

                <p className="mt-6 text-[17px] leading-8 text-slate-600">
                  For any situation where life, health, or safety is in immediate danger inside campus, contact
                  Marikina Emergency Hotline.
                </p>

                <a
                  href="tel:161"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-[#2F5BFF] to-[#261CC1] px-4 py-2.5 text-[14px] font-bold text-white shadow-[0_10px_20px_rgba(38,28,193,0.20)] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-[0_16px_32px_rgba(38,28,193,0.35)] hover:brightness-110 active:scale-[0.98]"
                >
                  CALL 161 NOW
                </a>

                <div className="mt-7 border-t border-slate-200 pt-6">
                  <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.2em] text-red-500">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    Only for real emergencies
                  </div>
                  <p className="mt-4 text-[15px] leading-7 text-slate-600">
                    For non-urgent concerns and follow-ups, use the directory below for Clinic, Guidance, Discipline,
                    or Admin assistance.
                  </p>
                  <div className="mt-6 h-1.5 w-full rounded-full bg-[#F1DF59]" />
                </div>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_40px_rgba(38,28,193,0.08)]">
                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="text-[13px] font-semibold uppercase tracking-[0.28em] text-slate-500">
                    Campus Hotlines
                  </div>
                  <p className="mt-3 text-[16px] leading-7 text-slate-600">
                    Save these contacts so you can reach the right office quickly.
                  </p>
                </div>

                <div className="max-h-[420px] overflow-y-auto px-5 py-4">
                  <div className="space-y-4">
                    {[primaryHotline, ...campusHotlines].map((h) => (
                      <div
                        key={h.office}
                        className="group rounded-[22px] border border-[#CFE0FF] bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(38,28,193,0.14)] hover:border-[#9DBBFF]"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="relative min-w-0 flex-1 pl-5">
                            <span className="absolute left-0 top-0 h-full w-[4px] rounded-full bg-[#2F5BFF]" />

                            <div className="text-[15px] font-semibold leading-6 text-slate-900 sm:text-[16px]">
                              {h.office}
                            </div>

                            <div className="mt-1 text-[13px] leading-6 text-slate-500 sm:text-[14px]">
                              {h.desc}
                            </div>

                            <div className="mt-3 text-[15px] font-medium text-slate-700">
                              {h.num1}
                            </div>

                            <div className="mt-1 text-[13px] text-slate-400">
                              {h.office === "Campus Clinic / Nurse" && "Clinic desk"}
                              {h.office === "Campus Security" && "Security desk"}
                              {h.office === "Guidance Office" && "Guidance desk"}
                              {h.office === "Discipline Office" && "Office hotline"}
                              {h.office === "Admin Office" && "Main line"}
                              {h.office === "Emergency (161)" && "National emergency"}
                            </div>
                          </div>

                          <a
                            href={`tel:${h.tel}`}
                            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#C9D8FF] bg-[#F8FAFF] px-4 py-2.5 text-[14px] font-bold text-[#261CC1] transition-all duration-300 hover:bg-[#EEF3FF] hover:shadow-[0_10px_24px_rgba(38,28,193,0.10)]"
                          >
                            CALL
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#261CC1]/10 transition-transform duration-300 group-hover:translate-x-0.5">
                              <FiArrowRight className="h-3 w-3" />
                            </span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-6 sm:h-8" />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <section
          id="student-reports"
          className="scroll-mt-[96px] overflow-hidden rounded-3xl border border-[#D7E0FF] bg-white shadow-[0_18px_55px_rgba(38,28,193,0.10)]"
        >
          <div className="relative overflow-hidden border-b border-gray-200 px-4 py-5 text-white sm:px-6 sm:py-6">
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1C0770] via-[#2F5BFF] to-[#FFEB00]" />
            <div className="absolute inset-0 z-0 bg-black/10" />
            <div className="relative z-10">
              <div className="text-[18px] font-bold sm:text-[20px]">Student Reports</div>
              <div className="mt-1 text-[13px] text-white/90 sm:text-[15px]">
                Copy Report ID or advance status: Submitted → In progress → Resolved → Closed
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-gray-500">Loading reports…</div>
          ) : reports.length === 0 ? (
            <div className="py-16 text-center text-[15px] text-gray-500">
              No reports assigned yet. New submissions will appear here.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {["SUBMITTED", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((statusKey) => {
                const list = byStatus[statusKey] ?? [];
                if (list.length === 0) return null;

                return (
                  <div key={statusKey} className="p-4 sm:p-6">
                    <h3 className="mb-4 flex items-center gap-2 text-[16px] font-semibold text-gray-900">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[statusKey] ?? ""}`}
                      >
                        {STATUS_LABELS[statusKey]}
                      </span>
                      <span className="text-gray-500">({list.length})</span>
                    </h3>

                    <div className="space-y-3 sm:space-y-4">
                      {list.map((report) => {
                        const nextStatus = NEXT_STATUS[report.status];
                        const isUpdating = updatingId === report.report_id;
                        const isCopied = copiedId === report.report_id;

                        return (
                          <div
                            key={report.report_id}
                            className="rounded-2xl border border-[#D7E0FF] bg-white p-4 shadow-[0_12px_30px_rgba(38,28,193,0.08)] transition hover:shadow-[0_18px_45px_rgba(38,28,193,0.12)] sm:p-5"
                          >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              <div className="min-w-0 flex-1 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-[13px] text-gray-700 sm:text-[14px]">
                                    {report.report_id?.slice(0, 12)}…
                                  </span>

                                  <button
                                    type="button"
                                    onClick={() => copyReportId(report.report_id)}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[12px] font-semibold text-gray-700 transition hover:bg-gray-100"
                                    title="Copy full Report ID"
                                  >
                                    <FiCopy className="h-3.5 w-3.5" />
                                    {isCopied ? "Copied!" : "Copy ID"}
                                  </button>
                                </div>

                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[14px] font-medium text-gray-900">{report.category}</span>
                                  <span
                                    className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_STYLES[report.priority] ?? PRIORITY_STYLES.NORMAL}`}
                                  >
                                    {report.priority}
                                  </span>
                                </div>

                                <div className="text-[12px] text-gray-500 sm:text-[13px]">
                                  <span className="font-medium text-gray-700">{report.first_name}</span>
                                  {" · "}
                                  {report.email}
                                </div>

                                {report.created_at && (
                                  <div className="text-[11px] text-gray-400 sm:text-[12px]">
                                    {new Date(report.created_at).toLocaleString(undefined, {
                                      dateStyle: "short",
                                      timeStyle: "short",
                                    })}
                                  </div>
                                )}
                              </div>

                              <div className="shrink-0">
                                {nextStatus ? (
                                  <button
                                    type="button"
                                    onClick={() => updateStatus(report.report_id, nextStatus)}
                                    disabled={isUpdating}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#2F5BFF] bg-gradient-to-b from-[#2F5BFF] to-[#261CC1] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
                                  >
                                    {isUpdating ? (
                                      "Updating…"
                                    ) : (
                                      <>
                                        {STATUS_LABELS[nextStatus]}
                                        <FiArrowRight className="h-3.5 w-3.5" />
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <span className="inline-flex rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[12px] font-medium text-gray-500">
                                    Closed
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}