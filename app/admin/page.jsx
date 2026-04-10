"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminSession } from "../../lib/adminStorage";
import { poppins, georama, inter } from "../../lib/fonts";
import { FiCopy, FiArrowRight, FiPhone, FiX, FiImage, FiBarChart2, FiShield, FiClock, FiCheckCircle } from "react-icons/fi";

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
  { office: "Garcia General Hospital", desc: "Emergency & general healthcare", num1: "8941-5511", tel: "8941-5511" },
  { office: "ST. Vincent General Hospital", desc: "Emergency & general healthcare", num1: "8948-0314", tel: "8948-0314" },
  { office: "Marikina Valley Medical Center", desc: "Specialized care & advanced services", num1: "8682-2222", tel: "8682-2222" },
  { office: "SDS Medical Center", desc: "Specialized care & advanced services", num1: "", tel: "8682-8888" },
  { office: "Guidance Office", desc: "Counseling", num1: "0948-0979", tel: "09480979" },
  { office: "PNP Marikina", desc: "1st Line", num1: "0927-968-4311", tel: "0927-968-4311" },
  { office: "PNP Marikina Other Line", desc: "2nd Line", num1: "0998-598-7876", tel: "0998-598-7876" },
  { office: "Bureau of Fire Protection", desc: "Main Line", num1: "117", tel: "117" },
  { office: "City Emergency Hotline", desc: "Life-threatening", num1: "161", tel: "161" },
];

export default function AdminDashboardPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [statusModal, setStatusModal] = useState({ open: false, report: null, note: "" });
  const [photoModal, setPhotoModal] = useState({ open: false, photoUrl: null });

  const router = useRouter();
  const admin = getAdminSession();
  const token = admin?.access_token;

  const adminLabel =
    admin?.role === "csa_admin"
      ? "CSA Admin"
      : admin?.role === "clinic_admin"
        ? "Clinic Admin"
        : "Admin";

  const greetingName = useMemo(() => {
    const emailName = admin?.email?.split("@")[0]?.replace(/[._-]+/g, " ")?.trim();
    if (!emailName) return "Admin";
    return emailName.replace(/\b\w/g, (char) => char.toUpperCase());
  }, [admin?.email]);

  useEffect(() => {
    if (!admin?.access_token) {
      router.replace("/admin/login");
      return;
    }
  }, [admin, router]);

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

  async function updateStatus(reportId, newStatus, note = "") {
    if (!token) return;
    setUpdatingId(reportId);
    try {
      const res = await fetch(`/api/reports/${reportId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Update failed");
      setReports((prev) =>
        prev.map((r) => (r.report_id === reportId ? { ...r, status: newStatus } : r))
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setUpdatingId(null);
    }
  }

  const openStatusModal = (report) => {
    const nextStatus = NEXT_STATUS[report.status];
    if (!nextStatus) return;
    setStatusModal({ open: true, report, note: "" });
  };

  const closeStatusModal = () => {
    setStatusModal({ open: false, report: null, note: "" });
  };

  const handleStatusUpdate = async () => {
    if (!statusModal.report) return;
    const { report, note } = statusModal;
    const nextStatus = NEXT_STATUS[report.status];
    await updateStatus(report.report_id, nextStatus, note);
    closeStatusModal();
  };

  const byStatus = useMemo(() => {
    const map = { SUBMITTED: [], IN_PROGRESS: [], RESOLVED: [], CLOSED: [] };
    reports.forEach((r) => {
      const key = r.status in map ? r.status : "SUBMITTED";
      if (!map[key]) map[key] = [];
      map[key].push(r);
    });
    return map;
  }, [reports]);

  const stats = useMemo(
    () => [
      { key: "SUBMITTED", label: "Submitted", value: byStatus.SUBMITTED?.length ?? 0, tone: "from-sky-500 to-blue-700" },
      { key: "IN_PROGRESS", label: "In progress", value: byStatus.IN_PROGRESS?.length ?? 0, tone: "from-violet-500 to-indigo-700" },
      { key: "RESOLVED", label: "Resolved", value: byStatus.RESOLVED?.length ?? 0, tone: "from-emerald-500 to-green-700" },
      { key: "CLOSED", label: "Closed", value: byStatus.CLOSED?.length ?? 0, tone: "from-slate-500 to-slate-700" },
    ],
    [byStatus]
  );

  const totalReports = reports.length;
  const chartMax = useMemo(() => {
    const currentMax = Math.max(0, ...stats.map((item) => item.value));
    return Math.max(300, Math.ceil(currentMax / 50) * 50 || 300);
  }, [stats]);
  const yAxisTicks = useMemo(
    () => Array.from({ length: 5 }, (_, index) => Math.round((chartMax / 4) * (4 - index))),
    [chartMax]
  );
  const submittedCount = byStatus.SUBMITTED?.length ?? 0;
  const activeCount = (byStatus.SUBMITTED?.length ?? 0) + (byStatus.IN_PROGRESS?.length ?? 0);
  const resolvedCount = (byStatus.RESOLVED?.length ?? 0) + (byStatus.CLOSED?.length ?? 0);

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-44 top-24 h-[400px] w-[400px] rounded-full bg-[#261CC1]/08 blur-[100px]" />
        <div className="absolute right-[-180px] top-[-100px] h-[420px] w-[420px] rounded-full bg-[#261CC1]/08 blur-[110px]" />
        <div className="absolute left-1/2 top-64 h-[360px] w-[360px] -translate-x-1/2 rounded-full bg-[#FFEB00]/[0.08] blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <section
          id="overview"
          className="relative overflow-hidden rounded-[32px] border border-white/20 shadow-[0_28px_80px_rgba(15,23,42,0.18)]"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(10,10,35,0.84) 0%, rgba(28,7,112,0.78) 45%, rgba(28,7,112,0.52) 100%), url('/olopscLogo1.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,235,0,0.18),transparent_24%),radial-gradient(circle_at_left_center,rgba(47,91,255,0.22),transparent_26%)]" />

          <div className="relative grid gap-8 px-5 py-8 sm:px-8 sm:py-12 lg:grid-cols-[1.15fr_0.85fr] lg:px-10 lg:py-14">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 backdrop-blur-xl">
                {adminLabel} Control Center
              </div>

              <h1 className={`${poppins.className} mt-5 text-[30px] font-semibold leading-[1.08] tracking-[-0.02em] text-white sm:mt-6 sm:text-[46px] sm:leading-[1.05] lg:text-[62px]`}>
                Welcome back, <span className="text-[#FFEB00]">{greetingName}</span>.
                <br />
                Lead campus response with clarity.
              </h1>

              <p className="mt-4 max-w-2xl text-[14.5px] leading-7 text-white/90 sm:mt-5 sm:text-[18px] sm:leading-8">
                This admin workspace is tailored for school response teams, not student reporters. Review incoming concerns, monitor case flow, and keep every follow-up organized from one professional dashboard.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                <a
                  href="#reports"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 bg-gradient-to-r from-[#2F5BFF] to-[#261CC1] px-6 py-3 text-[15px] font-semibold text-white transition hover:-translate-y-1"
                >
                  Review report queue
                </a>
                <a
                  href="#response"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-[15px] font-semibold text-white backdrop-blur-sm transition hover:-translate-y-1"
                >
                  View school dashboard
                </a>
              </div>
            </div>

            <div className="relative mx-auto flex w-full max-w-[520px] items-center lg:mx-0">
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[30px] bg-gradient-to-b from-[#261CC1]/20 via-[#261CC1]/10 to-[#FFEB00]/10 blur-xl" />
              <div className="grid w-full gap-4 rounded-[28px] border border-white/20 bg-white/85 p-5 shadow-[0_20px_60px_rgba(15,23,42,0.20)] backdrop-blur-xl sm:p-6">
                <AdminHeroMetric
                  icon={<FiBarChart2 className="h-5 w-5" />}
                  label="Total reports"
                  value={totalReports}
                  helper={`${submittedCount} newly submitted`}
                />
                <AdminHeroMetric
                  icon={<FiShield className="h-5 w-5" />}
                  label="Open cases"
                  value={activeCount}
                  helper="Needs ongoing response"
                />
                <AdminHeroMetric
                  icon={<FiCheckCircle className="h-5 w-5" />}
                  label="Resolved cases"
                  value={resolvedCount}
                  helper="Handled by admin teams"
                />
                <AdminHeroMetric
                  icon={<FiClock className="h-5 w-5" />}
                  label="Admin role"
                  value={adminLabel}
                  helper="Secure dashboard access"
                  isText
                />
              </div>
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <section
          id="response"
          className="overflow-hidden rounded-3xl border border-[#D7E0FF] bg-white shadow-[0_18px_55px_rgba(38,28,193,0.10)]"
        >
          <div className="relative overflow-hidden px-4 py-5 text-white sm:px-6 sm:py-6">
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1C0770] via-[#2F5BFF] to-[#FFEB00]" />
            <div className="absolute -left-20 top-[-60px] z-0 h-[220px] w-[220px] rounded-full bg-[#2F5BFF]/55 blur-[100px]" />
            <div className="absolute right-[-60px] bottom-[-60px] z-0 h-[220px] w-[220px] rounded-full bg-[#FFEB00]/55 blur-[110px]" />
            <div className="absolute inset-0 z-0 bg-black/10" />
            <div className="relative z-10 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className={`${georama.className} text-[18px] font-bold sm:text-[20px]`}>School Dashboard</div>
                <div className={`${inter.className} mt-1 text-[13px] text-white/90 sm:text-[15px]`}>
                  Report counts by status with a higher-capacity chart scale
                </div>
              </div>
              <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
                Chart scale: 0 to {chartMax}
              </div>
            </div>
          </div>
          <div className="grid gap-6 p-4 sm:p-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((s) => (
                <div
                  key={s.key}
                  className="rounded-2xl border border-[#D7E0FF] bg-white p-4 shadow-[0_12px_35px_rgba(38,28,193,0.08)]"
                >
                  <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-[13px]">{s.label}</div>
                  <div className="mt-2 flex items-end justify-between gap-3">
                    <div className="text-[24px] font-bold text-[#1C0770] sm:text-[28px]">{s.value}</div>
                    <div className="text-xs font-medium text-gray-400">
                      {totalReports ? `${Math.round((s.value / totalReports) * 100)}%` : "0%"}
                    </div>
                  </div>
                  <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${s.tone}`}
                      style={{ width: s.value === 0 ? "0%" : `${Math.max(6, (s.value / chartMax) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[28px] border border-[#D7E0FF] bg-[#F8FAFF] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)] sm:p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#1C0770]">Report volume by status</h3>
                </div>
                <div className="text-xs uppercase tracking-[0.22em] text-gray-400">Live overview</div>
              </div>

              <div className="mt-6 grid grid-cols-[36px_minmax(0,1fr)] gap-3 sm:grid-cols-[44px_minmax(0,1fr)]">
                <div className="flex h-[220px] flex-col justify-between text-[11px] font-medium text-gray-400 sm:h-[260px] sm:text-xs">
                  {yAxisTicks.map((tick) => (
                    <span key={tick}>{tick}</span>
                  ))}
                </div>

                <div className="relative">
                  <div className="overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch]">
                    <div className="relative h-[220px] min-w-[520px] rounded-3xl border border-white bg-white/70 px-4 pb-4 pt-3 shadow-[0_18px_40px_rgba(38,28,193,0.06)] sm:h-[260px] sm:min-w-0">
                      <div className="pointer-events-none absolute inset-x-4 inset-y-3 grid grid-rows-4">
                        {yAxisTicks.slice(0, 4).map((tick) => (
                          <div key={tick} className="border-b border-dashed border-slate-200 last:border-b-0" />
                        ))}
                      </div>

                      <div className="relative flex h-full items-end justify-between gap-3">
                        {stats.map((item) => {
                          const barHeight = item.value === 0 ? 0 : Math.max(10, (item.value / chartMax) * 100);
                          return (
                            <div key={item.key} className="flex flex-1 flex-col items-center justify-end gap-2 sm:gap-3">
                              <div className="text-sm font-semibold text-[#1C0770]">{item.value}</div>
                              <div className="flex h-[150px] w-full items-end justify-center sm:h-[185px]">
                                <div
                                  className={`w-full max-w-[74px] rounded-t-[22px] bg-gradient-to-t ${item.tone} shadow-[0_14px_30px_rgba(47,91,255,0.22)] transition-all duration-500`}
                                  style={{ height: `${barHeight}%` }}
                                />
                              </div>
                              <div className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500 sm:text-xs">
                                {item.label}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-gray-400 sm:hidden">
                    Tip: swipe horizontally to view the full chart.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-[#D7E0FF] bg-white shadow-[0_18px_55px_rgba(38,28,193,0.10)]">
          <div className="relative overflow-hidden border-b border-gray-200 px-4 py-5 text-white sm:px-6 sm:py-6">
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1C0770] via-[#2F5BFF] to-[#FFEB00]" />
            <div className="absolute inset-0 z-0 bg-black/10" />
            <div className="relative z-10 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className={`${georama.className} text-[18px] sm:text-[20px] font-bold`}>Emergency Response</div>
                <div className={`${inter.className} mt-1 text-[13px] sm:text-[15px] text-white/90`}>
                  Campus hotlines for urgent assistance
                </div>
              </div>
            </div>
          </div>
          <div className="grid gap-2 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
            {HOTLINES.map((h) => (
              <a
                key={h.office}
                href={`tel:${h.tel}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-[#D7E0FF] bg-white p-3 shadow-sm transition hover:border-[#2F5BFF]/40 hover:shadow-md sm:p-4"
              >
                <div className="min-w-0">
                  <div className="text-[14px] font-semibold text-gray-900">{h.office}</div>
                  <div className="text-[12px] text-gray-500">{h.desc}</div>
                  <div className="mt-1 text-[13px] font-medium text-[#1a138f]">{h.num1}</div>
                </div>
                <span className="shrink-0 rounded-full bg-[#261CC1]/10 p-2 text-[#1a138f]">
                  <FiPhone className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section
          id="reports"
          className="overflow-hidden rounded-3xl border border-[#D7E0FF] bg-white shadow-[0_18px_55px_rgba(38,28,193,0.10)]"
        >
          <div className="relative overflow-hidden border-b border-gray-200 px-4 py-5 text-white sm:px-6 sm:py-6">
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#1C0770] via-[#2F5BFF] to-[#FFEB00]" />
            <div className="absolute inset-0 z-0 bg-black/10" />
            <div className="relative z-10">
              <div className={`${georama.className} text-[18px] sm:text-[20px] font-bold`}>Your Reports Database</div>
              <div className={`${inter.className} mt-1 text-[13px] sm:text-[15px] text-white/90`}>
                Advance status: Submitted → In progress → Resolved → Closed
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
              {(["SUBMITTED", "IN_PROGRESS", "RESOLVED", "CLOSED"]).map((statusKey) => {
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
                                  <span className="font-mono text-[13px] sm:text-[14px] text-gray-700">
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
                                    className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                                      PRIORITY_STYLES[report.priority] ?? PRIORITY_STYLES.NORMAL
                                    }`}
                                  >
                                    {report.priority}
                                  </span>
                                </div>
                                <div className="text-[12px] sm:text-[13px] text-gray-500">
                                  <span className="font-medium text-gray-700">{report.first_name}</span>
                                  {" · "}
                                  {report.email}
                                </div>
                                {report.created_at && (
                                  <div className="text-[11px] sm:text-[12px] text-gray-400">
                                    {new Date(report.created_at).toLocaleString(undefined, {
                                      dateStyle: "short",
                                      timeStyle: "short",
                                    })}
                                  </div>
                                )}
                                {report.photo_url && (
                                  <button
                                    type="button"
                                    onClick={() => setPhotoModal({ open: true, photoUrl: report.photo_url })}
                                    className="mt-2 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[12px] font-semibold text-blue-700 transition hover:bg-blue-100"
                                  >
                                    <FiImage className="h-4 w-4" />
                                    View photo
                                  </button>
                                )}
                              </div>
                              <div className="shrink-0">
                                {nextStatus ? (
                                  <button
                                    type="button"
                                    onClick={() => openStatusModal(report)}
                                    disabled={isUpdating}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#2F5BFF] bg-gradient-to-b from-[#2F5BFF] to-[#261CC1] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50 sm:w-auto"
                                  >
                                    {isUpdating ? "Updating…" : (
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

        {/* Status Update Modal */}
        {statusModal.open && statusModal.report && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Update Report Status
              </h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Changing status from <span className="font-medium">{STATUS_LABELS[statusModal.report.status]}</span> to{" "}
                  <span className="font-medium">{STATUS_LABELS[NEXT_STATUS[statusModal.report.status]]}</span>
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add a note (optional):
                </label>
                <textarea
                  value={statusModal.note}
                  onChange={(e) => setStatusModal(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Describe what actions were taken..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#2F5BFF] focus:outline-none focus:ring-1 focus:ring-[#2F5BFF]"
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeStatusModal}
                  className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updatingId === statusModal.report.report_id}
                  className="flex-1 rounded-lg bg-[#2F5BFF] px-4 py-2 text-sm font-medium text-white hover:bg-[#261CC1] disabled:opacity-50"
                >
                  {updatingId === statusModal.report.report_id ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Photo Viewer Modal */}
        {photoModal.open && photoModal.photoUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="relative max-w-2xl w-full max-h-[85vh] flex flex-col">
              <button
                onClick={() => setPhotoModal({ open: false, photoUrl: null })}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
              >
                <FiX className="h-6 w-6" />
              </button>
              <div className="flex-1 overflow-auto rounded-xl bg-white flex items-center justify-center">
                <img
                  src={photoModal.photoUrl}
                  alt="Report photo"
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button
                onClick={() => setPhotoModal({ open: false, photoUrl: null })}
                className="mt-4 w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminHeroMetric({ icon, label, value, helper, isText = false }) {
  return (
    <div className="rounded-2xl border border-[#D7E0FF] bg-white p-4 shadow-[0_12px_30px_rgba(38,28,193,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-gray-500">{label}</div>
          <div className={`mt-2 text-[#1C0770] ${isText ? "text-[20px] font-semibold sm:text-[24px]" : "text-[28px] font-bold sm:text-[34px]"}`}>
            {value}
          </div>
          <div className="mt-1 text-sm text-gray-500">{helper}</div>
        </div>
        <div className="rounded-2xl bg-[#261CC1]/10 p-3 text-[#261CC1]">{icon}</div>
      </div>
    </div>
  );
}
